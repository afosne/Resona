import { AIService } from '../src/services/ai-service.js';

describe('AIService', () => {
  let aiService;
  
  beforeEach(() => {
    const env = {
      OPENAI_API_KEY: null,
      GEMINI_API_KEY: null,
      OPENAI_API_URL: 'https://custom-openai.example.com/v1',
      GEMINI_API_URL: 'https://custom-gemini.example.com/v1beta',
      EMOTION_TAGS: 'sad,lonely,happy,confused,relieved,angry,missing,yearning'
    };
    aiService = new AIService(env);
  });

  describe('构造函数', () => {
    test('应该正确设置自定义 API 地址', () => {
      expect(aiService.openaiApiUrl).toBe('https://custom-openai.example.com/v1');
      expect(aiService.geminiApiUrl).toBe('https://custom-gemini.example.com/v1beta');
    });

    test('应该使用默认 API 地址当未配置时', () => {
      const env = {
        OPENAI_API_KEY: null,
        GEMINI_API_KEY: null,
        EMOTION_TAGS: 'sad,lonely,happy,confused,relieved,angry,missing,yearning'
      };
      const defaultAiService = new AIService(env);
      
      expect(defaultAiService.openaiApiUrl).toBe('https://api.openai.com/v1');
      expect(defaultAiService.geminiApiUrl).toBe('https://generativelanguage.googleapis.com/v1beta');
    });
  });

  describe('analyzeEmotion', () => {
    test('应该正确识别悲伤情绪', () => {
      const result = aiService.analyzeWithKeywords('我今天很难过');
      expect(result).toBe('sad');
    });

    test('应该正确识别快乐情绪', () => {
      const result = aiService.analyzeWithKeywords('我今天很开心');
      expect(result).toBe('happy');
    });

    test('应该正确识别孤独情绪', () => {
      const result = aiService.analyzeWithKeywords('我感觉很孤独');
      expect(result).toBe('lonely');
    });

    test('应该返回默认情绪当无法识别时', () => {
      const result = aiService.analyzeWithKeywords('今天天气不错');
      expect(result).toBe('confused');
    });
  });

  describe('generateReflection', () => {
    test('应该生成悲伤情绪的共鸣', () => {
      const result = aiService.generateWithTemplates('sad');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('应该生成快乐情绪的共鸣', () => {
      const result = aiService.generateWithTemplates('happy');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('应该为未知情绪返回默认模板', () => {
      const result = aiService.generateWithTemplates('unknown');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('API 调用', () => {
    test('应该使用自定义 OpenAI API 地址', async () => {
      const env = {
        OPENAI_API_KEY: 'test-key',
        GEMINI_API_KEY: null,
        OPENAI_API_URL: 'https://custom-openai.example.com/v1',
        EMOTION_TAGS: 'sad,lonely,happy,confused,relieved,angry,missing,yearning'
      };
      
      const customAiService = new AIService(env);
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: 'sad' } }]
        })
      });

      await customAiService.analyzeEmotion('测试文本');
      
      expect(fetch).toHaveBeenCalledWith(
        'https://custom-openai.example.com/v1/chat/completions',
        expect.any(Object)
      );
    });

    test('应该使用自定义 Gemini API 地址', async () => {
      const env = {
        OPENAI_API_KEY: null,
        GEMINI_API_KEY: 'test-key',
        GEMINI_API_URL: 'https://custom-gemini.example.com/v1beta',
        EMOTION_TAGS: 'sad,lonely,happy,confused,relieved,angry,missing,yearning'
      };
      
      const customAiService = new AIService(env);
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          candidates: [{ content: { parts: [{ text: 'sad' }] } }]
        })
      });

      await customAiService.analyzeEmotion('测试文本');
      
      expect(fetch).toHaveBeenCalledWith(
        'https://custom-gemini.example.com/v1beta/models/gemini-pro:generateContent?key=test-key',
        expect.any(Object)
      );
    });
  });
}); 