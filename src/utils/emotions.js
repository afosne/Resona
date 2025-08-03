// 基础情绪定义
export const BASE_EMOTIONS = {
  // 基础情绪 (8种)
  'sad': { name: '悲伤', keywords: ['难过', '悲伤', '伤心', '痛苦', '沮丧', '失望', '绝望', '哭', '泪', '忧郁', '哀伤'] },
  'lonely': { name: '孤独', keywords: ['孤独', '孤单', '寂寞', '一个人', '没人', '独处', '孤立', '孤寂', '独来独往'] },
  'happy': { name: '快乐', keywords: ['开心', '快乐', '高兴', '兴奋', '愉快', '喜悦', '幸福', '笑', '欢乐', '愉悦', '开心'] },
  'confused': { name: '困惑', keywords: ['困惑', '迷茫', '不解', '不懂', '不明白', '疑惑', '疑问', '糊涂', '混乱'] },
  'relieved': { name: '释然', keywords: ['释然', '放松', '解脱', '轻松', '安心', '放心', '如释重负', '松口气'] },
  'angry': { name: '愤怒', keywords: ['愤怒', '生气', '恼火', '烦躁', '暴躁', '火大', '气愤', '怒火', '暴怒'] },
  'missing': { name: '想念', keywords: ['想念', '思念', '怀念', '回忆', '想起', '惦记', '挂念', '思念', '怀念'] },
  'yearning': { name: '渴望', keywords: ['渴望', '向往', '期待', '希望', '梦想', '追求', '憧憬', '向往', '渴望'] },
  'excited': { name: '兴奋', keywords: ['兴奋', '激动', '激动人心', '兴奋不已', '激动万分', '热血沸腾', '亢奋'] },
  'anxious': { name: '焦虑', keywords: ['焦虑', '紧张', '担忧', '不安', '紧张不安', '心神不宁', '坐立不安', '焦虑不安'] },
  'peaceful': { name: '平静', keywords: ['平静', '宁静', '平和', '安详', '宁静致远', '心平气和', '心如止水', '恬静'] },
  'nostalgic': { name: '怀旧', keywords: ['怀旧', '怀念', '思念', '回忆', '怀念过去', '怀念往事', '怀念旧时光', '追忆'] },
  'hopeful': { name: '希望', keywords: ['希望', '期待', '憧憬', '向往', '充满希望', '满怀希望', '充满期待', '盼望'] },
  'disappointed': { name: '失望', keywords: ['失望', '沮丧', '失望透顶', '失望至极', '大失所望', '灰心', '绝望'] },
  'grateful': { name: '感激', keywords: ['感激', '感谢', '感恩', '感激不尽', '感激涕零', '感恩戴德', '感谢'] },
  'curious': { name: '好奇', keywords: ['好奇', '好奇心', '好奇宝宝', '好奇心重', '求知欲', '探索欲', '好奇'] },
  'embarrassed': { name: '尴尬', keywords: ['尴尬', '害羞', '羞愧', '尴尬至极', '羞愧难当', '难为情', '不好意思'] },
  'proud': { name: '骄傲', keywords: ['骄傲', '自豪', '自满', '骄傲自满', '自豪感', '成就感', '得意'] },
  'jealous': { name: '嫉妒', keywords: ['嫉妒', '妒忌', '羡慕', '嫉妒', '妒忌', '羡慕', '眼红', '妒忌'] },
  'content': { name: '满足', keywords: ['满足', '满意', '安心', '知足', '心满意足', '满意', '知足常乐'] },
  'surprised': { name: '惊讶', keywords: ['惊讶', '吃惊', '震惊', '意外', '没想到', '出乎意料', '惊讶'] },
  'fearful': { name: '恐惧', keywords: ['恐惧', '害怕', '恐惧', '害怕', '恐惧', '害怕', '恐惧', '害怕'] },
  'amused': { name: '有趣', keywords: ['有趣', '好玩', '搞笑', '幽默', '有趣', '好玩', '搞笑', '幽默'] },
  'bored': { name: '无聊', keywords: ['无聊', '乏味', '枯燥', '无聊', '乏味', '枯燥', '无聊', '乏味'] },
  'tired': { name: '疲惫', keywords: ['疲惫', '疲劳', '累', '疲倦', '疲惫', '疲劳', '累', '疲倦'] },
  'energetic': { name: '精力充沛', keywords: ['精力充沛', '活力', '充满活力', '精力充沛', '活力', '充满活力'] },
  'focused': { name: '专注', keywords: ['专注', '集中', '专心', '专注', '集中', '专心', '专注', '集中'] },
  'distracted': { name: '分心', keywords: ['分心', '走神', '注意力不集中', '分心', '走神', '注意力不集中'] },
  'confident': { name: '自信', keywords: ['自信', '有信心', '自信', '有信心', '自信', '有信心', '自信'] },
  'insecure': { name: '不安全感', keywords: ['不安全感', '缺乏安全感', '不安全感', '缺乏安全感', '不安全感'] },
  'loved': { name: '被爱', keywords: ['被爱', '感受到爱', '被爱', '感受到爱', '被爱', '感受到爱', '被爱'] },
  'rejected': { name: '被拒绝', keywords: ['被拒绝', '拒绝', '被拒绝', '拒绝', '被拒绝', '拒绝', '被拒绝'] },
  'accepted': { name: '被接受', keywords: ['被接受', '接受', '被接受', '接受', '被接受', '接受', '被接受'] },
  'valued': { name: '被重视', keywords: ['被重视', '重视', '被重视', '重视', '被重视', '重视', '被重视'] },
  'ignored': { name: '被忽视', keywords: ['被忽视', '忽视', '被忽视', '忽视', '被忽视', '忽视', '被忽视'] },
  'respected': { name: '被尊重', keywords: ['被尊重', '尊重', '被尊重', '尊重', '被尊重', '尊重', '被尊重'] },
  'disrespected': { name: '不被尊重', keywords: ['不被尊重', '不尊重', '不被尊重', '不尊重', '不被尊重', '不尊重'] },
  'understood': { name: '被理解', keywords: ['被理解', '理解', '被理解', '理解', '被理解', '理解', '被理解'] },
  'misunderstood': { name: '被误解', keywords: ['被误解', '误解', '被误解', '误解', '被误解', '误解', '被误解'] },
  'supported': { name: '被支持', keywords: ['被支持', '支持', '被支持', '支持', '被支持', '支持', '被支持'] },
  'abandoned': { name: '被抛弃', keywords: ['被抛弃', '抛弃', '被抛弃', '抛弃', '被抛弃', '抛弃', '被抛弃'] },
  'betrayed': { name: '被背叛', keywords: ['被背叛', '背叛', '被背叛', '背叛', '被背叛', '背叛', '被背叛'] },
  'forgiven': { name: '被原谅', keywords: ['被原谅', '原谅', '被原谅', '原谅', '被原谅', '原谅', '被原谅'] },
  'guilty': { name: '内疚', keywords: ['内疚', '愧疚', '内疚', '愧疚', '内疚', '愧疚', '内疚', '愧疚'] },
  'ashamed': { name: '羞愧', keywords: ['羞愧', '羞耻', '羞愧', '羞耻', '羞愧', '羞耻', '羞愧', '羞耻'] },
  'humble': { name: '谦逊', keywords: ['谦逊', '谦虚', '谦逊', '谦虚', '谦逊', '谦虚', '谦逊', '谦虚'] },
  'arrogant': { name: '傲慢', keywords: ['傲慢', '自大', '傲慢', '自大', '傲慢', '自大', '傲慢', '自大'] },
  'generous': { name: '慷慨', keywords: ['慷慨', '大方', '慷慨', '大方', '慷慨', '大方', '慷慨', '大方'] },
  'selfish': { name: '自私', keywords: ['自私', '自私', '自私', '自私', '自私', '自私', '自私', '自私'] },
  'kind': { name: '善良', keywords: ['善良', '好心', '善良', '好心', '善良', '好心', '善良', '好心'] },
  'cruel': { name: '残忍', keywords: ['残忍', '冷酷', '残忍', '冷酷', '残忍', '冷酷', '残忍', '冷酷'] },
  'patient': { name: '耐心', keywords: ['耐心', '耐心', '耐心', '耐心', '耐心', '耐心', '耐心', '耐心'] },
  'impatient': { name: '不耐烦', keywords: ['不耐烦', '急躁', '不耐烦', '急躁', '不耐烦', '急躁', '不耐烦', '急躁'] },
  'optimistic': { name: '乐观', keywords: ['乐观', '积极', '乐观', '积极', '乐观', '积极', '乐观', '积极'] },
  'pessimistic': { name: '悲观', keywords: ['悲观', '消极', '悲观', '消极', '悲观', '消极', '悲观', '消极'] },
  'realistic': { name: '现实', keywords: ['现实', '实际', '现实', '实际', '现实', '实际', '现实', '实际'] },
  'idealistic': { name: '理想主义', keywords: ['理想主义', '理想', '理想主义', '理想', '理想主义', '理想', '理想主义', '理想'] }
};

// 动态情绪存储
let dynamicEmotions = new Map();

// 情绪分析器
export class EmotionAnalyzer {
  constructor(env) {
    this.env = env;
    this.baseEmotions = BASE_EMOTIONS;
    this.dynamicEmotions = dynamicEmotions;
  }

  // 分析文本情绪
  async analyzeEmotion(text) {
    try {
      // 1. 首先尝试AI分析
      if (this.env.OPENAI_API_KEY || this.env.GEMINI_API_KEY) {
        const aiEmotion = await this.analyzeWithAI(text);
        if (aiEmotion) {
          return aiEmotion;
        }
      }

      // 2. 使用关键词匹配
      const keywordEmotion = this.analyzeWithKeywords(text);
      if (keywordEmotion) {
        return keywordEmotion;
      }

      // 3. 动态情绪识别
      const dynamicEmotion = this.analyzeDynamicEmotion(text);
      if (dynamicEmotion) {
        return dynamicEmotion;
      }

      // 4. 默认返回困惑
      return 'confused';
    } catch (error) {
      console.error('情绪分析失败:', error);
      return 'confused';
    }
  }

  // AI情绪分析
  async analyzeWithAI(text) {
    try {
      if (this.env.OPENAI_API_KEY) {
        return await this.analyzeWithOpenAI(text);
      } else if (this.env.GEMINI_API_KEY) {
        return await this.analyzeWithGemini(text);
      }
    } catch (error) {
      console.error('AI情绪分析失败:', error);
      return null;
    }
  }

  // OpenAI情绪分析
  async analyzeWithOpenAI(text) {
    const allEmotions = Object.keys(this.baseEmotions).join(', ');
    
    const response = await fetch(`${this.env.OPENAI_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `你是一个情绪分析专家。请分析用户输入的文本，并从以下情绪标签中选择最匹配的一个：${allEmotions}。只返回情绪标签，不要其他内容。`
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 20,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API 错误: ${response.status}`);
    }

    const data = await response.json();
    const emotion = data.choices[0].message.content.trim().toLowerCase();
    
    // 验证情绪是否在预设列表中
    if (this.baseEmotions[emotion] || this.dynamicEmotions.has(emotion)) {
      return emotion;
    }
    
    return null;
  }

  // Gemini情绪分析
  async analyzeWithGemini(text) {
    const allEmotions = Object.keys(this.baseEmotions).join(', ');
    
    const response = await fetch(`${this.env.GEMINI_API_URL}/models/${this.env.GEMINI_MODEL}:generateContent?key=${this.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `分析以下文本的情绪，从这些标签中选择一个：${allEmotions}。只返回标签名称：\n\n${text}`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API 错误: ${response.status}`);
    }

    const data = await response.json();
    const emotion = data.candidates[0].content.parts[0].text.trim().toLowerCase();
    
    if (this.baseEmotions[emotion] || this.dynamicEmotions.has(emotion)) {
      return emotion;
    }
    
    return null;
  }

  // 关键词匹配分析
  analyzeWithKeywords(text) {
    const textLower = text.toLowerCase();
    
    // 检查基础情绪
    for (const [emotion, config] of Object.entries(this.baseEmotions)) {
      if (config.keywords.some(keyword => textLower.includes(keyword))) {
        return emotion;
      }
    }
    
    // 检查动态情绪
    for (const [emotion, config] of this.dynamicEmotions) {
      if (config.keywords.some(keyword => textLower.includes(keyword))) {
        return emotion;
      }
    }
    
    return null;
  }

  // 动态情绪识别
  analyzeDynamicEmotion(text) {
    // 这里可以实现更复杂的动态情绪识别逻辑
    // 比如基于上下文、情感强度等
    return null;
  }

  // 添加动态情绪
  addDynamicEmotion(emotionKey, emotionConfig) {
    this.dynamicEmotions.set(emotionKey, {
      name: emotionConfig.name,
      keywords: emotionConfig.keywords || [],
      description: emotionConfig.description || '',
      intensity: emotionConfig.intensity || 'medium',
      category: emotionConfig.category || 'dynamic',
      created_at: new Date().toISOString()
    });
    
    console.log(`✅ 添加动态情绪: ${emotionKey} - ${emotionConfig.name}`);
  }

  // 获取所有情绪
  getAllEmotions() {
    const allEmotions = {};
    
    // 添加基础情绪
    for (const [key, config] of Object.entries(this.baseEmotions)) {
      allEmotions[key] = {
        ...config,
        type: 'base',
        category: 'basic'
      };
    }
    
    // 添加动态情绪
    for (const [key, config] of this.dynamicEmotions) {
      allEmotions[key] = {
        ...config,
        type: 'dynamic',
        category: config.category || 'dynamic'
      };
    }
    
    return allEmotions;
  }

  // 获取情绪信息
  getEmotionInfo(emotionKey) {
    return this.baseEmotions[emotionKey] || this.dynamicEmotions.get(emotionKey);
  }

  // 获取情绪总数
  getEmotionCount() {
    return Object.keys(this.baseEmotions).length + this.dynamicEmotions.size;
  }
} 