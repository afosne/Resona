import { handleSubmitToAi } from './handlers/submit.js';
import { handleCollect } from './handlers/collect.js';
import { handleGetCollections } from './handlers/collections.js';
import { handleDeleteCollection } from './handlers/delete-collection.js';
import { rateLimiter } from './middleware/rate-limiter.js';
import { deviceIdMiddleware } from './middleware/device-id.js';
import { corsMiddleware } from './middleware/cors.js';
import { logAIConfig } from './utils/config-validator.js';
import { getSwaggerHTML, getSwaggerJSON } from './swagger.js';

export default {
  async fetch(request, env, ctx) {
    // 应用 CORS 中间件
    const corsResponse = corsMiddleware(request);
    if (corsResponse) return corsResponse;

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Swagger UI 路由
      if (path === '/docs' || path === '/api-docs') {
        return new Response(getSwaggerHTML(), {
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        });
      }

      if (path === '/api/v1/swagger.json') {
        return new Response(JSON.stringify(getSwaggerJSON()), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 应用设备 ID 中间件
      const deviceIdResult = await deviceIdMiddleware(request, env);
      if (deviceIdResult.error) {
        return new Response(JSON.stringify({ error: deviceIdResult.error }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 应用频率限制中间件
      const rateLimitResult = await rateLimiter(request, env, deviceIdResult.deviceId);
      if (rateLimitResult.blocked) {
        return new Response(JSON.stringify({ 
          error: '请求过于频繁，请稍后再试',
          retryAfter: rateLimitResult.retryAfter 
        }), {
          status: 429,
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': rateLimitResult.retryAfter.toString()
          }
        });
      }

      // 路由处理
      switch (path) {
        case '/api/v1/submit':
          if (request.method === 'POST') {
            return await handleSubmitToAi(request, env, deviceIdResult.deviceId);
          }
          break;
          
        case '/api/v1/collect':
          if (request.method === 'POST') {
            return await handleCollect(request, env, deviceIdResult.deviceId);
          } else if (request.method === 'DELETE') {
            return await handleDeleteCollection(request, env, deviceIdResult.deviceId);
          }
          break;

        case '/api/v1/collections':
          if (request.method === 'GET') {
            return await handleGetCollections(request, env, deviceIdResult.deviceId);
          }
          break;

        case '/api/v1/health':
          return new Response(JSON.stringify({ 
            status: 'ok', 
            timestamp: new Date().toISOString(),
            ai_config: getAIConfigStatus(env)
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });

        case '/api/v1/config':
          if (request.method === 'GET') {
            return await handleGetConfig(request, env);
          }
          break;

        case '/api/v1/emotions':
          if (request.method === 'GET') {
            return await handleGetEmotions(request, env);
          } else if (request.method === 'POST') {
            return await handleAddEmotion(request, env);
          }
          break;

        default:
          return new Response(JSON.stringify({ error: '接口不存在' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
      }

      return new Response(JSON.stringify({ error: '方法不允许' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('请求处理错误:', error);
      return new Response(JSON.stringify({ error: '服务器内部错误' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

// 获取 AI 配置状态
function getAIConfigStatus(env) {
  const services = [];
  
  if (env.OPENAI_API_KEY) {
    services.push({
      name: 'OpenAI',
      url: env.OPENAI_API_URL || 'https://api.openai.com/v1',
      model: env.OPENAI_MODEL || 'gpt-3.5-turbo',
      configured: true
    });
  }
  
  if (env.GEMINI_API_KEY) {
    services.push({
      name: 'Gemini',
      url: env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta',
      model: env.GEMINI_MODEL || 'gemini-pro',
      configured: true
    });
  }
  
  if (services.length === 0) {
    services.push({
      name: '关键词匹配',
      url: 'local',
      model: 'keyword-matching',
      configured: true
    });
  }
  
  return {
    services,
    total_services: services.length,
    primary_service: services[0]?.name || '关键词匹配',
    primary_model: services[0]?.model || 'keyword-matching'
  };
}

// 处理配置查询请求
async function handleGetConfig(request, env) {
  try {
    const { validateAIConfig, getAIServicePriority } = await import('./utils/config-validator.js');
    
    const config = validateAIConfig(env);
    const services = getAIServicePriority(env);
    
    const response = {
      success: true,
      data: {
        config: {
          valid: config.valid,
          errors: config.errors,
          warnings: config.warnings
        },
        services: services.map((service, index) => ({
          ...service,
          is_primary: index === 0
        })),
        environment: env.ENVIRONMENT || 'development'
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('获取配置错误:', error);
    return new Response(JSON.stringify({ 
      error: '获取配置时发生错误' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 处理获取情绪列表请求
async function handleGetEmotions(request, env) {
  try {
    const { AIService } = await import('./services/ai-service.js');
    const aiService = new AIService(env);
    
    const emotions = aiService.getAllEmotions();
    const emotionCount = aiService.getEmotionCount();
    
    const response = {
      success: true,
      data: {
        emotions,
        total_count: emotionCount,
        base_count: Object.keys(emotions).filter(key => emotions[key].type === 'base').length,
        dynamic_count: Object.keys(emotions).filter(key => emotions[key].type === 'dynamic').length
      }
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('获取情绪列表错误:', error);
    return new Response(JSON.stringify({ 
      error: '获取情绪列表时发生错误' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 处理添加动态情绪请求
async function handleAddEmotion(request, env) {
  try {
    const body = await request.json();
    const { emotion_key, name, keywords, description, intensity, category } = body;

    // 验证必需字段
    if (!emotion_key || !name) {
      return new Response(JSON.stringify({ 
        error: 'emotion_key 和 name 是必需字段' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { AIService } = await import('./services/ai-service.js');
    const aiService = new AIService(env);
    
    // 检查情绪是否已存在
    const existingEmotion = aiService.getEmotionInfo(emotion_key);
    if (existingEmotion) {
      return new Response(JSON.stringify({ 
        error: '情绪已存在' 
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 添加动态情绪
    aiService.addDynamicEmotion(emotion_key, {
      name,
      keywords: keywords || [],
      description: description || '',
      intensity: intensity || 'medium',
      category: category || 'dynamic'
    });

    const response = {
      success: true,
      data: {
        emotion_key,
        name,
        message: '动态情绪添加成功'
      }
    };

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('添加动态情绪错误:', error);
    return new Response(JSON.stringify({ 
      error: '添加动态情绪时发生错误' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 