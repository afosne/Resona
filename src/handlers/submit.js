import { AIService } from '../services/ai-service.js';
import { DatabaseService } from '../services/database.js';

export async function handleSubmitToAi(request, env, deviceId) {
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

    // 3. 优先尝试 AI 生成共鸣
    let reflection = null;
    let isGenerated = false;

    try {
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
      console.log('✅ AI 生成共鸣成功:', generatedText);
    } catch (aiError) {
      console.error('❌ AI 生成失败，使用预设数据:', aiError);
      
      // 4. 如果 AI 生成失败，从情绪池获取预设共鸣
      reflection = await dbService.getRandomReflection(emotion);
      
      if (reflection) {
        // 保存共鸣记录（如果不是生成的）
        await dbService.createReflection(submissionId, reflection.text, reflection.emotion, false);
        console.log('📝 使用预设共鸣:', reflection.text);
      } else {
        // 5. 如果情绪池也为空，使用模板生成
        const templateText = aiService.generateWithTemplates(emotion);
        const reflectionId = await dbService.createReflection(submissionId, templateText, emotion, false);
        
        reflection = {
          id: reflectionId,
          text: templateText,
          emotion: emotion,
          is_generated: 0,
          created_at: new Date().toISOString()
        };
        console.log('📋 使用模板共鸣:', templateText);
      }
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