import { DatabaseService } from '../services/database.js';

export async function handleGetCollections(request, env, deviceId) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;

    // 验证分页参数
    if (page < 1 || limit < 1 || limit > 50) {
      return new Response(JSON.stringify({ error: '无效的分页参数' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 初始化数据库服务
    const dbService = new DatabaseService(env.DB, env.EMOTION_POOL);

    // 获取收藏列表
    const result = await dbService.getCollections(deviceId, page, limit);

    // 格式化响应数据
    const collections = result.collections.map(item => ({
      collection_id: item.collection_id,
      collected_at: item.collected_at,
      reflection: {
        id: item.reflection_id,
        text: item.reflection_text,
        emotion: item.emotion,
        is_generated: item.is_generated === 1,
        created_at: item.reflection_created_at
      }
    }));

    const response = {
      success: true,
      data: {
        collections,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          has_more: result.hasMore
        }
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('获取收藏列表错误:', error);
    
    return new Response(JSON.stringify({ 
      error: '获取收藏列表时发生错误，请稍后重试' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 