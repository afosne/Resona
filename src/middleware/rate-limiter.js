export async function rateLimiter(request, env, deviceId) {
  const maxRequests = parseInt(env.MAX_SUBMISSIONS_PER_MINUTE || '3');
  const windowMs = 60 * 1000; // 1分钟
  
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const key = `rate_limit:${deviceId}:${windowStart}`;
  
  try {
    // 使用 KV 存储进行频率限制
    const currentCount = await env.EMOTION_POOL.get(key);
    const count = currentCount ? parseInt(currentCount) : 0;
    
    if (count >= maxRequests) {
      const retryAfter = Math.ceil((windowStart + windowMs - now) / 1000);
      return { blocked: true, retryAfter };
    }
    
    // 增加计数
    await env.EMOTION_POOL.put(key, (count + 1).toString(), {
      expirationTtl: 120 // 2分钟后过期
    });
    
    return { blocked: false };
  } catch (error) {
    console.error('频率限制检查失败:', error);
    // 如果频率限制检查失败，允许请求通过
    return { blocked: false };
  }
} 