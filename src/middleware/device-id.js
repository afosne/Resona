import { v4 as uuidv4 } from 'uuid';

export async function deviceIdMiddleware(request, env) {
  // 从 Cookie 中获取设备 ID
  const cookies = request.headers.get('cookie');
  let deviceId = null;
  
  if (cookies) {
    const cookieMatch = cookies.match(/device_id=([^;]+)/);
    if (cookieMatch) {
      deviceId = cookieMatch[1];
    }
  }
  
  // 如果没有设备 ID，生成一个新的
  if (!deviceId) {
    deviceId = uuidv4();
  }
  
  // 验证设备 ID 格式
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(deviceId)) {
    return { error: '无效的设备标识' };
  }
  
  return { deviceId };
} 