export function validateText(text) {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: '请输入有效的文本' };
  }
  
  if (text.trim().length === 0) {
    return { valid: false, error: '文本不能为空' };
  }
  
  if (text.length > 200) {
    return { valid: false, error: '文本长度不能超过200字' };
  }
  
  return { valid: true };
}

export function validateEmotion(emotion) {
  const validEmotions = ['sad', 'lonely', 'happy', 'confused', 'relieved', 'angry', 'missing', 'yearning'];
  
  if (!emotion || !validEmotions.includes(emotion)) {
    return { valid: false, error: '无效的情绪标签' };
  }
  
  return { valid: true };
}

export function validateDeviceId(deviceId) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!deviceId || !uuidRegex.test(deviceId)) {
    return { valid: false, error: '无效的设备标识' };
  }
  
  return { valid: true };
}

export function validatePagination(page, limit) {
  if (page < 1) {
    return { valid: false, error: '页码必须大于0' };
  }
  
  if (limit < 1 || limit > 50) {
    return { valid: false, error: '每页数量必须在1-50之间' };
  }
  
  return { valid: true };
} 