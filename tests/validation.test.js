import { validateText, validateEmotion, validateDeviceId, validatePagination } from '../src/utils/validation.js';

describe('Validation Utils', () => {
  describe('validateText', () => {
    test('应该验证有效文本', () => {
      const result = validateText('这是一段有效的文本');
      expect(result.valid).toBe(true);
    });

    test('应该拒绝空文本', () => {
      const result = validateText('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('请输入有效的文本');
    });

    test('应该拒绝过长的文本', () => {
      const longText = 'a'.repeat(201);
      const result = validateText(longText);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('文本长度不能超过200字');
    });

    test('应该拒绝非字符串输入', () => {
      const result = validateText(123);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('请输入有效的文本');
    });
  });

  describe('validateEmotion', () => {
    test('应该验证有效情绪', () => {
      const result = validateEmotion('sad');
      expect(result.valid).toBe(true);
    });

    test('应该拒绝无效情绪', () => {
      const result = validateEmotion('invalid');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('无效的情绪标签');
    });

    test('应该拒绝空情绪', () => {
      const result = validateEmotion('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('无效的情绪标签');
    });
  });

  describe('validateDeviceId', () => {
    test('应该验证有效设备ID', () => {
      const validId = '123e4567-e89b-12d3-a456-426614174000';
      const result = validateDeviceId(validId);
      expect(result.valid).toBe(true);
    });

    test('应该拒绝无效设备ID', () => {
      const invalidId = 'invalid-uuid';
      const result = validateDeviceId(invalidId);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('无效的设备标识');
    });

    test('应该拒绝空设备ID', () => {
      const result = validateDeviceId('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('无效的设备标识');
    });
  });

  describe('validatePagination', () => {
    test('应该验证有效分页参数', () => {
      const result = validatePagination(1, 10);
      expect(result.valid).toBe(true);
    });

    test('应该拒绝无效页码', () => {
      const result = validatePagination(0, 10);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('页码必须大于0');
    });

    test('应该拒绝无效每页数量', () => {
      const result = validatePagination(1, 0);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('每页数量必须在1-50之间');
    });

    test('应该拒绝过大的每页数量', () => {
      const result = validatePagination(1, 51);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('每页数量必须在1-50之间');
    });
  });
}); 