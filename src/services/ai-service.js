import { EmotionAnalyzer } from '../utils/emotions.js';

export class AIService {
  constructor(env) {
    this.env = env;
    this.openaiApiKey = env.OPENAI_API_KEY;
    this.geminiApiKey = env.GEMINI_API_KEY;
    this.openaiApiUrl = env.OPENAI_API_URL || 'https://api.openai.com/v1';
    this.geminiApiUrl = env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta';
    
    // 模型配置
    this.openaiModel = env.OPENAI_MODEL || 'gpt-3.5-turbo';
    this.geminiModel = env.GEMINI_MODEL || 'gemini-pro';
    
    // 使用新的情绪分析器
    this.emotionAnalyzer = new EmotionAnalyzer(env);
  }

  async analyzeEmotion(text) {
    return await this.emotionAnalyzer.analyzeEmotion(text);
  }

  async generateReflection(emotion, originalText) {
    try {
      // 1. 尝试AI生成
      if (this.openaiApiKey) {
        try {
          const result = await this.generateWithOpenAI(emotion, originalText);
          console.log('✅ OpenAI 生成成功');
          return result;
        } catch (error) {
          console.error('❌ OpenAI 生成失败:', error.message);
          
          // 尝试 Gemini
          if (this.geminiApiKey) {
            try {
              const result = await this.generateWithGemini(emotion, originalText);
              console.log('✅ Gemini 生成成功');
              return result;
            } catch (geminiError) {
              console.error('❌ Gemini 生成也失败:', geminiError.message);
              return await this.generateWithAITemplate(emotion, originalText);
            }
          } else {
            return await this.generateWithAITemplate(emotion, originalText);
          }
        }
      } else if (this.geminiApiKey) {
        try {
          const result = await this.generateWithGemini(emotion, originalText);
          console.log('✅ Gemini 生成成功');
          return result;
        } catch (error) {
          console.error('❌ Gemini 生成失败:', error.message);
          return await this.generateWithAITemplate(emotion, originalText);
        }
      } else {
        return await this.generateWithAITemplate(emotion, originalText);
      }
    } catch (error) {
      console.error('生成共鸣失败，使用基础模板:', error);
      return this.generateWithBasicTemplate(emotion);
    }
  }

  async generateWithOpenAI(emotion, originalText) {
    const emotionInfo = this.emotionAnalyzer.getEmotionInfo(emotion);
    const emotionName = emotionInfo ? emotionInfo.name : emotion;

    const response = await fetch(`${this.openaiApiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.openaiModel,
        messages: [
          {
            role: 'system',
            content: `你是一个温暖的共鸣者。用户表达了${emotionName}的情绪，请生成一段温暖而深刻的共鸣回应（50-200字），让用户感受到被理解和支持。回应要真诚、温暖、有共鸣感，可以包含安慰、鼓励或理解的话语。`
          },
          {
            role: 'user',
            content: originalText
          }
        ],
        max_tokens: 300,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API 错误: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  async generateWithGemini(emotion, originalText) {
    const emotionInfo = this.emotionAnalyzer.getEmotionInfo(emotion);
    const emotionName = emotionInfo ? emotionInfo.name : emotion;

    const response = await fetch(`${this.geminiApiUrl}/models/${this.geminiModel}:generateContent?key=${this.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `用户表达了${emotionName}的情绪："${originalText}"。请生成一段温暖而深刻的共鸣回应（50-200字），让用户感受到被理解和支持。回应要真诚、温暖、有共鸣感，可以包含安慰、鼓励或理解的话语。`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API 错误: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  }

  // AI生成模板（当直接生成失败时的备用方案）
  async generateWithAITemplate(emotion, originalText) {
    try {
      // 使用AI生成多个模板选项
      const templates = await this.generateEmotionTemplates(emotion);
      if (templates && templates.length > 0) {
        // 随机选择一个模板
        const randomIndex = Math.floor(Math.random() * templates.length);
        return templates[randomIndex];
      }
    } catch (error) {
      console.error('AI模板生成失败:', error);
    }
    
    // 如果AI模板生成失败，使用基础模板
    return this.generateWithBasicTemplate(emotion);
  }

  // 生成情绪模板
  async generateEmotionTemplates(emotion) {
    try {
      const emotionInfo = this.emotionAnalyzer.getEmotionInfo(emotion);
      const emotionName = emotionInfo ? emotionInfo.name : emotion;

      if (this.openaiApiKey) {
        return await this.generateTemplatesWithOpenAI(emotionName);
      } else if (this.geminiApiKey) {
        return await this.generateTemplatesWithGemini(emotionName);
      }
    } catch (error) {
      console.error('生成情绪模板失败:', error);
      return null;
    }
  }

  async generateTemplatesWithOpenAI(emotionName) {
    const response = await fetch(`${this.openaiApiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.openaiModel,
        messages: [
          {
            role: 'system',
            content: `你是一个情绪共鸣专家。请为"${emotionName}"这种情绪生成3段温暖、真诚的共鸣回应（每段50-200字），让用户感受到被理解和支持。请以JSON数组格式返回，例如：["回应1", "回应2", "回应3"]`
          }
        ],
        max_tokens: 600,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API 错误: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    try {
      // 尝试解析JSON
      const templates = JSON.parse(content);
      if (Array.isArray(templates)) {
        return templates;
      }
    } catch (parseError) {
      console.error('解析模板JSON失败:', parseError);
    }
    
    // 如果JSON解析失败，尝试提取引号内的内容
    const matches = content.match(/"([^"]+)"/g);
    if (matches) {
      return matches.map(match => match.replace(/"/g, ''));
    }
    
    return null;
  }

  async generateTemplatesWithGemini(emotionName) {
    const response = await fetch(`${this.geminiApiUrl}/models/${this.geminiModel}:generateContent?key=${this.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `请为"${emotionName}"这种情绪生成3段温暖、真诚的共鸣回应（每段50-200字），让用户感受到被理解和支持。请以JSON数组格式返回，例如：["回应1", "回应2", "回应3"]`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API 错误: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text.trim();
    
    try {
      const templates = JSON.parse(content);
      if (Array.isArray(templates)) {
        return templates;
      }
    } catch (parseError) {
      console.error('解析模板JSON失败:', parseError);
    }
    
    const matches = content.match(/"([^"]+)"/g);
    if (matches) {
      return matches.map(match => match.replace(/"/g, ''));
    }
    
    return null;
  }

  // 基础模板（最后的备用方案）
  generateWithBasicTemplate(emotion) {
    const emotionInfo = this.emotionAnalyzer.getEmotionInfo(emotion);
    const emotionName = emotionInfo ? emotionInfo.name : '这种';
    
    const basicTemplates = [
      `我理解你的${emotionName}，这种感受是真实而深刻的。每个人都会经历这样的时刻，你并不孤单。请相信，这种情绪是暂时的，就像天空中的云朵，终会散去。给自己一些时间和耐心，一切都会慢慢好起来的。我在这里陪着你，你的感受很重要，值得被倾听和理解。`,
      `你的${emotionName}我感同身受，这种情绪确实让人感到沉重。但请记住，情绪就像潮水，有涨有落。现在的你正在经历低谷，但这并不意味着永远。你的内心比想象中更强大，你有能力度过这个难关。我在这里支持你，相信你能够找到内心的平静。`,
      `${emotionName}的时候，记得给自己一些时间和空间。这种情绪需要被接纳，而不是被压抑。你可以尝试深呼吸，或者做一些让自己感到舒适的事情。记住，你不需要独自承担这一切，寻求帮助是勇敢的表现。我相信你有足够的力量去面对，一切都会慢慢变好。`,
      `你的感受是真实的，我完全理解你的${emotionName}。这种情绪可能让你感到无助，但请相信，这只是人生旅程中的一段路。每个人都有脆弱的时候，这很正常。你的情绪值得被尊重，你的痛苦值得被理解。我在这里倾听你，陪伴你，相信你能够找到内心的力量。`,
      `我在这里倾听你，你的${emotionName}很重要，值得被认真对待。这种情绪可能让你感到孤独，但请记住，你并不孤单。每个人都会经历类似的感受，这是人类情感的一部分。给自己一些温柔，就像对待一个受伤的朋友一样。我相信你有能力度过这个困难时期，一切都会好起来的。`,
      `你并不孤单，我懂你的${emotionName}。这种感受可能让你觉得没有人理解，但我想告诉你，你的情绪是合理的，你的痛苦是真实的。每个人都有自己的脆弱时刻，这并不代表软弱。请相信，这种情绪会过去，就像所有的困难一样。我在这里支持你，陪伴你度过这个时刻。`,
      `你的${emotionName}是正常的，给自己一些耐心和宽容。这种情绪可能让你感到困惑，但请记住，情绪本身就是复杂的。你不需要立即解决所有问题，有时候最好的方式就是允许自己感受。我相信你有足够的内在力量，一切都会慢慢变得清晰。我理解你的心情，一切都会慢慢变好。`,
      `我理解你的心情，这种${emotionName}确实让人感到沉重。但请相信，这只是暂时的状态，就像所有的情绪一样，它们会来也会走。你不需要独自面对这一切，寻求支持是明智的选择。我相信你有能力度过这个困难时期，你的内心比想象中更坚强。一切都会慢慢变好，我在这里陪着你。`
    ];
    
    const randomIndex = Math.floor(Math.random() * basicTemplates.length);
    return basicTemplates[randomIndex];
  }

  // 动态添加情绪
  addDynamicEmotion(emotionKey, emotionConfig) {
    this.emotionAnalyzer.addDynamicEmotion(emotionKey, emotionConfig);
  }

  // 获取所有情绪
  getAllEmotions() {
    return this.emotionAnalyzer.getAllEmotions();
  }

  // 获取情绪信息
  getEmotionInfo(emotionKey) {
    return this.emotionAnalyzer.getEmotionInfo(emotionKey);
  }

  // 获取情绪总数
  getEmotionCount() {
    return this.emotionAnalyzer.getEmotionCount();
  }
} 