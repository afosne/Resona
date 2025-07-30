import { DatabaseService } from '../services/database.js';

export async function handleCollect(request, env, deviceId) {
  try {
    // 解析请求体
    const body = await request.json();
    const { reflection_id } = body;

    // 验证输入
    if (!reflection_id || typeof reflection_id !== 'number') {
      return new Response(JSON.stringify({ error: '请提供有效的回声ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 初始化数据库服务
    const dbService = new DatabaseService(env.DB, env.EMOTION_POOL);

    // 创建收藏记录
    const collectionId = await dbService.createCollection(deviceId, reflection_id);

    // 返回成功响应
    const response = {
      success: true,
      data: {
        collection_id: collectionId,
        message: '收藏成功'
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('收藏处理错误:', error);
    
    let statusCode = 500;
    let errorMessage = '处理请求时发生错误，请稍后重试';

    // 处理特定错误
    if (error.message === '已经收藏过这条回声') {
      statusCode = 409;
      errorMessage = error.message;
    } else if (error.message === '收藏数量已达上限') {
      statusCode = 400;
      errorMessage = error.message;
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 