import { validateAIConfig, isValidUrl, getAIServicePriority } from '../src/utils/config-validator.js';

describe('Config Validator', () => {
  describe('isValidUrl', () => {
    test('应该验证有效的 URL', () => {
      expect(isValidUrl('https://api.openai.com/v1')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('https://custom-api.example.com')).toBe(true);
    });

    test('应该拒绝无效的 URL', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl(null)).toBe(false);
      expect(isValidUrl(undefined)).toBe(false);
    });
  });

  describe('validateAIConfig', () => {
    test('应该验证完整的 OpenAI 配置', () => {
      const env = {
        OPENAI_API_KEY: 'test-key',
        OPENAI_API_URL: 'https://api.openai.com/v1',
        EMOTION_TAGS: 'sad,happy'
      };
      
      const result = validateAIConfig(env);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('应该验证完整的 Gemini 配置', () => {
      const env = {
        GEMINI_API_KEY: 'test-key',
        GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta',
        EMOTION_TAGS: 'sad,happy'
      };
      
      const result = validateAIConfig(env);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('应该检测无效的 API URL', () => {
      const env = {
        OPENAI_API_KEY: 'test-key',
        OPENAI_API_URL: 'invalid-url',
        EMOTION_TAGS: 'sad,happy'
      };
      
      const result = validateAIConfig(env);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('OPENAI_API_URL 格式无效');
    });

    test('应该检测空的情绪标签', () => {
      const env = {
        OPENAI_API_KEY: 'test-key',
        OPENAI_API_URL: 'https://api.openai.com/v1',
        EMOTION_TAGS: ''
      };
      
      const result = validateAIConfig(env);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('EMOTION_TAGS 不能为空');
    });

    test('应该在没有 API 密钥时发出警告', () => {
      const env = {
        EMOTION_TAGS: 'sad,happy'
      };
      
      const result = validateAIConfig(env);
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('未配置任何 AI API 密钥，将使用关键词匹配模式');
    });

    test('应该在未配置 API URL 时发出警告', () => {
      const env = {
        OPENAI_API_KEY: 'test-key',
        EMOTION_TAGS: 'sad,happy'
      };
      
      const result = validateAIConfig(env);
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('未配置 OPENAI_API_URL，将使用默认地址');
    });
  });

  describe('getAIServicePriority', () => {
    test('应该正确排序 OpenAI 优先的服务', () => {
      const env = {
        OPENAI_API_KEY: 'test-key',
        GEMINI_API_KEY: 'test-key',
        OPENAI_API_URL: 'https://custom-openai.com/v1',
        GEMINI_API_URL: 'https://custom-gemini.com/v1beta'
      };
      
      const services = getAIServicePriority(env);
      
      expect(services).toHaveLength(3);
      expect(services[0].name).toBe('OpenAI');
      expect(services[0].priority).toBe(1);
      expect(services[1].name).toBe('Gemini');
      expect(services[1].priority).toBe(2);
      expect(services[2].name).toBe('关键词匹配');
      expect(services[2].priority).toBe(3);
    });

    test('应该在没有 API 密钥时只包含关键词匹配', () => {
      const env = {
        EMOTION_TAGS: 'sad,happy'
      };
      
      const services = getAIServicePriority(env);
      
      expect(services).toHaveLength(1);
      expect(services[0].name).toBe('关键词匹配');
      expect(services[0].priority).toBe(3);
    });

    test('应该使用默认 URL 当未配置时', () => {
      const env = {
        OPENAI_API_KEY: 'test-key',
        GEMINI_API_KEY: 'test-key'
      };
      
      const services = getAIServicePriority(env);
      
      expect(services[0].url).toBe('https://api.openai.com/v1');
      expect(services[1].url).toBe('https://generativelanguage.googleapis.com/v1beta');
    });

    test('应该使用自定义 URL 当配置时', () => {
      const env = {
        OPENAI_API_KEY: 'test-key',
        OPENAI_API_URL: 'https://custom-openai.com/v1'
      };
      
      const services = getAIServicePriority(env);
      
      expect(services[0].url).toBe('https://custom-openai.com/v1');
    });
  });
}); 