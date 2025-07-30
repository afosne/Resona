import { AIService } from '../services/ai-service.js';
import { DatabaseService } from '../services/database.js';

export async function handleSubmit(request, env, deviceId) {
  try {
    // 解析请求体
    const body = await request.json();
    const { text } = body;

    // 验证输入
    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: '请输入有效的文本' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (text.length > 200) {
      return new Response(JSON.stringify({ error: '文本长度不能超过200字' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 初始化服务
    const aiService = new AIService(env);
    const dbService = new DatabaseService(env.DB, env.EMOTION_POOL);

    // 1. 分析情绪
    const emotion = await aiService.analyzeEmotion(text);

    // 2. 保存用户提交
    const submissionId = await dbService.createSubmission(deviceId, text, emotion);

    // 3. 尝试从情绪池获取共鸣
    let reflection = await dbService.getRandomReflection(emotion);
    let isGenerated = false;

    // 4. 如果情绪池为空，生成新的共鸣
    if (!reflection) {
      const generatedText = await aiService.generateReflection(emotion, text);
      const reflectionId = await dbService.createReflection(submissionId, generatedText, emotion, true);
      
      reflection = {
        id: reflectionId,
        text: generatedText,
        emotion: emotion,
        is_generated: 1,
        created_at: new Date().toISOString()
      };
      isGenerated = true;
    }

    // 5. 保存共鸣记录（如果不是生成的）
    if (!isGenerated) {
      await dbService.createReflection(submissionId, reflection.text, reflection.emotion, false);
    }

    // 6. 返回响应
    const response = {
      success: true,
      data: {
        reflection: {
          id: reflection.id,
          text: reflection.text,
          emotion: reflection.emotion,
          is_generated: reflection.is_generated === 1
        },
        submission: {
          id: submissionId,
          emotion: emotion
        }
      }
    };

    // 设置设备 ID Cookie
    const responseObj = new Response(JSON.stringify(response), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Set-Cookie': `device_id=${deviceId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=31536000`
      }
    });

    return responseObj;

  } catch (error) {
    console.error('提交处理错误:', error);
    
    return new Response(JSON.stringify({ 
      error: '处理请求时发生错误，请稍后重试' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 