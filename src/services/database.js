export class DatabaseService {
  constructor(db, emotionPool) {
    this.db = db;
    this.emotionPool = emotionPool;
  }

  async createSubmission(deviceId, text, emotion) {
    const stmt = this.db.prepare(`
      INSERT INTO submissions (device_id, text, emotion, created_at)
      VALUES (?, ?, ?, ?)
    `);
    
    const result = await stmt.bind(deviceId, text, emotion, new Date().toISOString()).run();
    return result.meta.last_row_id;
  }

  async createReflection(submissionId, text, emotion, isGenerated = false) {
    const stmt = this.db.prepare(`
      INSERT INTO reflections (submission_id, text, emotion, is_generated, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = await stmt.bind(submissionId, text, emotion, isGenerated ? 1 : 0, new Date().toISOString()).run();
    const reflectionId = result.meta.last_row_id;
    
    // 更新情绪池
    await this.updateEmotionPool(emotion, reflectionId);
    
    return reflectionId;
  }

  async getRandomReflection(emotion) {
    // 从情绪池中获取该情绪的所有回声 ID
    const emotionKey = `emotion:${emotion}`;
    const reflectionIds = await this.emotionPool.get(emotionKey);
    
    if (!reflectionIds) {
      return null;
    }
    
    const ids = JSON.parse(reflectionIds);
    if (ids.length === 0) {
      return null;
    }
    
    // 随机选择一个 ID
    const randomId = ids[Math.floor(Math.random() * ids.length)];
    
    // 获取回声详情
    const stmt = this.db.prepare(`
      SELECT id, text, emotion, is_generated, created_at
      FROM reflections
      WHERE id = ?
    `);
    
    const result = await stmt.bind(randomId).first();
    return result;
  }

  async updateEmotionPool(emotion, reflectionId) {
    const emotionKey = `emotion:${emotion}`;
    
    try {
      // 获取现有的 ID 列表
      const existingIds = await this.emotionPool.get(emotionKey);
      let ids = existingIds ? JSON.parse(existingIds) : [];
      
      // 添加新的 ID（如果不存在）
      if (!ids.includes(reflectionId)) {
        ids.push(reflectionId);
        await this.emotionPool.put(emotionKey, JSON.stringify(ids));
      }
    } catch (error) {
      console.error('更新情绪池失败:', error);
    }
  }

  async createCollection(deviceId, reflectionId) {
    // 检查是否已经收藏
    const existingStmt = this.db.prepare(`
      SELECT id FROM collections 
      WHERE device_id = ? AND reflection_id = ?
    `);
    
    const existing = await existingStmt.bind(deviceId, reflectionId).first();
    if (existing) {
      throw new Error('已经收藏过这条回声');
    }
    
    // 检查收藏数量限制
    const countStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM collections 
      WHERE device_id = ?
    `);
    
    const countResult = await countStmt.bind(deviceId).first();
    if (countResult.count >= 20) {
      throw new Error('收藏数量已达上限');
    }
    
    // 创建收藏记录
    const stmt = this.db.prepare(`
      INSERT INTO collections (device_id, reflection_id, created_at)
      VALUES (?, ?, ?)
    `);
    
    const result = await stmt.bind(deviceId, reflectionId, new Date().toISOString()).run();
    return result.meta.last_row_id;
  }

  async getCollections(deviceId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const stmt = this.db.prepare(`
      SELECT 
        c.id as collection_id,
        c.created_at as collected_at,
        r.id as reflection_id,
        r.text as reflection_text,
        r.emotion,
        r.is_generated,
        r.created_at as reflection_created_at
      FROM collections c
      JOIN reflections r ON c.reflection_id = r.id
      WHERE c.device_id = ?
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `);
    
    const results = await stmt.bind(deviceId, limit, offset).all();
    
    // 获取总数
    const countStmt = this.db.prepare(`
      SELECT COUNT(*) as total FROM collections WHERE device_id = ?
    `);
    
    const countResult = await countStmt.bind(deviceId).first();
    
    return {
      collections: results.results,
      total: countResult.total,
      page,
      limit,
      hasMore: offset + limit < countResult.total
    };
  }

  async deleteCollection(deviceId, collectionId) {
    const stmt = this.db.prepare(`
      DELETE FROM collections 
      WHERE id = ? AND device_id = ?
    `);
    
    const result = await stmt.bind(collectionId, deviceId).run();
    
    if (result.meta.changes === 0) {
      throw new Error('收藏记录不存在或无权限删除');
    }
    
    return true;
  }

  async getSubmissionStats() {
    const stmt = this.db.prepare(`
      SELECT 
        COUNT(*) as total_submissions,
        COUNT(DISTINCT device_id) as unique_users,
        emotion,
        COUNT(*) as emotion_count
      FROM submissions
      GROUP BY emotion
      ORDER BY emotion_count DESC
    `);
    
    const results = await stmt.all();
    return results.results;
  }

  async getReflectionStats() {
    const stmt = this.db.prepare(`
      SELECT 
        COUNT(*) as total_reflections,
        SUM(CASE WHEN is_generated = 1 THEN 1 ELSE 0 END) as generated_count,
        emotion,
        COUNT(*) as emotion_count
      FROM reflections
      GROUP BY emotion
      ORDER BY emotion_count DESC
    `);
    
    const results = await stmt.all();
    return results.results;
  }
} 