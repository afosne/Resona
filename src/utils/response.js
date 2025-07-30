export function createSuccessResponse(data, statusCode = 200) {
  return new Response(JSON.stringify({
    success: true,
    data
  }), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function createErrorResponse(error, statusCode = 500) {
  return new Response(JSON.stringify({
    success: false,
    error: typeof error === 'string' ? error : '服务器内部错误'
  }), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function createValidationErrorResponse(error) {
  return createErrorResponse(error, 400);
}

export function createNotFoundResponse(message = '资源不存在') {
  return createErrorResponse(message, 404);
}

export function createConflictResponse(message) {
  return createErrorResponse(message, 409);
}

export function createRateLimitResponse(retryAfter) {
  return new Response(JSON.stringify({
    success: false,
    error: '请求过于频繁，请稍后再试',
    retryAfter
  }), {
    status: 429,
    headers: { 
      'Content-Type': 'application/json',
      'Retry-After': retryAfter.toString()
    }
  });
} 