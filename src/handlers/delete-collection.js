import { DatabaseService } from '../services/database.js';

export async function handleDeleteCollection(request, env, deviceId) {
  try {
    // 解析请求体
    const body = await request.json();
    const { collection_id } = body;

    // 验证输入
    if (!collection_id || typeof collection_id !== 'number') {
      return new Response(JSON.stringify({ error: '请提供有效的收藏ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 初始化数据库服务
    const dbService = new DatabaseService(env.DB, env.EMOTION_POOL);

    // 删除收藏记录
    await dbService.deleteCollection(deviceId, collection_id);

    // 返回成功响应
    const response = {
      success: true,
      data: {
        message: '删除成功'
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('删除收藏错误:', error);
    
    let statusCode = 500;
    let errorMessage = '删除收藏时发生错误，请稍后重试';

    // 处理特定错误
    if (error.message === '收藏记录不存在或无权限删除') {
      statusCode = 404;
      errorMessage = error.message;
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 