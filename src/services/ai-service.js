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
    
    this.emotionTags = env.EMOTION_TAGS?.split(',') || [
      'sad', 'lonely', 'happy', 'confused', 'relieved', 'angry', 'missing', 'yearning'
    ];
  }

  async analyzeEmotion(text) {
    try {
      // 优先使用 OpenAI，如果没有则使用 Gemini
      if (this.openaiApiKey) {
        return await this.analyzeWithOpenAI(text);
      } else if (this.geminiApiKey) {
        return await this.analyzeWithGemini(text);
      } else {
        // 如果没有 API 密钥，使用简单的关键词匹配
        return this.analyzeWithKeywords(text);
      }
    } catch (error) {
      console.error('情绪分析失败:', error);
      // 降级到关键词匹配
      return this.analyzeWithKeywords(text);
    }
  }

  async analyzeWithOpenAI(text) {
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
            content: `你是一个情绪分析专家。请分析用户输入的文本，并从以下情绪标签中选择最匹配的一个：${this.emotionTags.join(', ')}。只返回情绪标签，不要其他内容。`
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 10,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API 错误: ${response.status}`);
    }

    const data = await response.json();
    const emotion = data.choices[0].message.content.trim().toLowerCase();
    
    // 验证返回的情绪标签是否在预设列表中
    if (this.emotionTags.includes(emotion)) {
      return emotion;
    } else {
      // 如果返回的情绪不在预设列表中，使用默认值
      return 'confused';
    }
  }

  async analyzeWithGemini(text) {
    const response = await fetch(`${this.geminiApiUrl}/models/${this.geminiModel}:generateContent?key=${this.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `分析以下文本的情绪，从这些标签中选择一个：${this.emotionTags.join(', ')}。只返回标签名称：\n\n${text}`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API 错误: ${response.status}`);
    }

    const data = await response.json();
    const emotion = data.candidates[0].content.parts[0].text.trim().toLowerCase();
    
    if (this.emotionTags.includes(emotion)) {
      return emotion;
    } else {
      return 'confused';
    }
  }

  analyzeWithKeywords(text) {
    const lowerText = text.toLowerCase();
    
    // 简单的关键词匹配规则
    const keywordMap = {
      'sad': ['难过', '悲伤', '伤心', '痛苦', '沮丧', '失落', 'sad', 'unhappy'],
      'lonely': ['孤独', '寂寞', '孤单', 'alone', 'lonely', 'isolated'],
      'happy': ['开心', '快乐', '高兴', '兴奋', '喜悦', 'happy', 'joyful'],
      'confused': ['困惑', '迷茫', '不解', 'confused', 'puzzled', 'uncertain'],
      'relieved': ['释然', '轻松', '解脱', 'relieved', 'relaxed'],
      'angry': ['愤怒', '生气', '恼火', 'angry', 'mad', 'furious'],
      'missing': ['想念', '思念', 'miss', 'missing', 'longing'],
      'yearning': ['渴望', '向往', 'yearning', 'desire', 'wish']
    };

    for (const [emotion, keywords] of Object.entries(keywordMap)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return emotion;
      }
    }

    // 默认返回困惑
    return 'confused';
  }

  async generateReflection(emotion, originalText) {
    try {
      if (this.openaiApiKey) {
        return await this.generateWithOpenAI(emotion, originalText);
      } else if (this.geminiApiKey) {
        return await this.generateWithGemini(emotion, originalText);
      } else {
        return this.generateWithTemplates(emotion);
      }
    } catch (error) {
      console.error('生成共鸣句子失败:', error);
      return this.generateWithTemplates(emotion);
    }
  }

  async generateWithOpenAI(emotion, originalText) {
    const emotionNames = {
      'sad': '悲伤',
      'lonely': '孤独',
      'happy': '快乐',
      'confused': '困惑',
      'relieved': '释然',
      'angry': '愤怒',
      'missing': '想念',
      'yearning': '渴望'
    };

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
            content: `你是一个温暖的共鸣者。用户表达了${emotionNames[emotion]}的情绪，请生成一句简短而温暖的共鸣回应（不超过20字），让用户感受到被理解和支持。`
          },
          {
            role: 'user',
            content: originalText
          }
        ],
        max_tokens: 50,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API 错误: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  async generateWithGemini(emotion, originalText) {
    const emotionNames = {
      'sad': '悲伤',
      'lonely': '孤独',
      'happy': '快乐',
      'confused': '困惑',
      'relieved': '释然',
      'angry': '愤怒',
      'missing': '想念',
      'yearning': '渴望'
    };

    const response = await fetch(`${this.geminiApiUrl}/models/${this.geminiModel}:generateContent?key=${this.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `用户表达了${emotionNames[emotion]}的情绪："${originalText}"。请生成一句简短而温暖的共鸣回应（不超过20字），让用户感受到被理解和支持。`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API 错误: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  }

  generateWithTemplates(emotion) {
    const templates = {
      'sad': [
        '我理解你的难过，一切都会好起来的',
        '悲伤的时候，记得给自己一个拥抱',
        '你的感受是真实的，我在这里陪着你'
      ],
      'lonely': [
        '孤独的时候，星星也在陪伴着你',
        '你并不孤单，我懂你的感受',
        '有时候孤独也是一种力量'
      ],
      'happy': [
        '你的快乐感染了我，真好',
        '保持这份美好，世界因你而明亮',
        '快乐是最珍贵的礼物'
      ],
      'confused': [
        '迷茫是成长的必经之路',
        '慢慢来，答案会自己出现的',
        '困惑的时候，给自己一些时间'
      ],
      'relieved': [
        '释然的感觉真好，你做得对',
        '放下负担，轻装前行',
        '内心的平静是最美的风景'
      ],
      'angry': [
        '愤怒是正常的，但别让它伤害自己',
        '深呼吸，让情绪慢慢平静',
        '你的愤怒我理解，但请善待自己'
      ],
      'missing': [
        '想念是爱的另一种表达',
        '那些美好的回忆永远在心里',
        '思念让爱更加深刻'
      ],
      'yearning': [
        '渴望是前进的动力',
        '你的梦想值得被追逐',
        '内心的渴望指引着方向'
      ]
    };

    const emotionTemplates = templates[emotion] || templates['confused'];
    const randomIndex = Math.floor(Math.random() * emotionTemplates.length);
    return emotionTemplates[randomIndex];
  }
} 