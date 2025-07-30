export function validateAIConfig(env) {
  const errors = [];
  const warnings = [];

  // 检查 API 密钥
  if (!env.OPENAI_API_KEY && !env.GEMINI_API_KEY) {
    warnings.push('未配置任何 AI API 密钥，将使用关键词匹配模式');
  }

  // 验证 OpenAI 配置
  if (env.OPENAI_API_KEY) {
    if (!env.OPENAI_API_URL) {
      warnings.push('未配置 OPENAI_API_URL，将使用默认地址');
    } else if (!isValidUrl(env.OPENAI_API_URL)) {
      errors.push('OPENAI_API_URL 格式无效');
    }
    
    if (!env.OPENAI_MODEL) {
      warnings.push('未配置 OPENAI_MODEL，将使用默认模型 gpt-3.5-turbo');
    }
  }

  // 验证 Gemini 配置
  if (env.GEMINI_API_KEY) {
    if (!env.GEMINI_API_URL) {
      warnings.push('未配置 GEMINI_API_URL，将使用默认地址');
    } else if (!isValidUrl(env.GEMINI_API_URL)) {
      errors.push('GEMINI_API_URL 格式无效');
    }
    
    if (!env.GEMINI_MODEL) {
      warnings.push('未配置 GEMINI_MODEL，将使用默认模型 gemini-pro');
    }
  }

  // 验证情绪标签
  if (!env.EMOTION_TAGS) {
    warnings.push('未配置 EMOTION_TAGS，将使用默认标签');
  } else {
    const tags = env.EMOTION_TAGS.split(',');
    if (tags.length < 1) {
      errors.push('EMOTION_TAGS 不能为空');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export function getAIServicePriority(env) {
  const services = [];
  
  if (env.OPENAI_API_KEY) {
    services.push({
      name: 'OpenAI',
      url: env.OPENAI_API_URL || 'https://api.openai.com/v1',
      model: env.OPENAI_MODEL || 'gpt-3.5-turbo',
      priority: 1
    });
  }
  
  if (env.GEMINI_API_KEY) {
    services.push({
      name: 'Gemini',
      url: env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta',
      model: env.GEMINI_MODEL || 'gemini-pro',
      priority: 2
    });
  }
  
  services.push({
    name: '关键词匹配',
    url: 'local',
    model: 'keyword-matching',
    priority: 3
  });
  
  return services.sort((a, b) => a.priority - b.priority);
}

export function logAIConfig(env) {
  const config = validateAIConfig(env);
  const services = getAIServicePriority(env);
  
  console.log('🤖 AI 服务配置:');
  
  if (config.errors.length > 0) {
    console.error('❌ 配置错误:');
    config.errors.forEach(error => console.error(`  - ${error}`));
  }
  
  if (config.warnings.length > 0) {
    console.warn('⚠️ 配置警告:');
    config.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }
  
  console.log('📋 可用服务:');
  services.forEach((service, index) => {
    const status = index === 0 ? '✅ 主要' : '🔄 备用';
    console.log(`  ${index + 1}. ${status} ${service.name} (${service.url}) - 模型: ${service.model}`);
  });
  
  return config.valid;
} 