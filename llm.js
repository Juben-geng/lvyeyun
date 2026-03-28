// llm.js — 统一LLM调用层
// 支持 OpenAI / 任何兼容接口（硅基流动、DeepSeek、通义等）

const OpenAI = require('openai');

const DEMO_MODE = !process.env.LLM_API_KEY || process.env.LLM_API_KEY === 'demo';

let client = null;

// 只在非演示模式下初始化 OpenAI 客户端
if (!DEMO_MODE) {
  client = new OpenAI({
    baseURL: process.env.LLM_BASE_URL || 'https://api.openai.com/v1',
    apiKey: process.env.LLM_API_KEY,
  });
}

const MODEL = process.env.LLM_MODEL || 'gpt-4o-mini';

/**
 * 调用LLM
 * @param {string} systemPrompt - Agent人格/系统提示
 * @param {Array}  history      - 历史消息 [{role, content}]
 * @param {string} userMessage  - 当前用户消息
 * @returns {string} AI回复文本
 */
async function chat(systemPrompt, history = [], userMessage) {
  // 演示模式：直接返回模拟响应
  if (DEMO_MODE) {
    return mockResponse(systemPrompt, userMessage);
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: userMessage },
  ];

  try {
    const res = await client.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.8,
      max_tokens: 1500,
    });
    return res.choices[0].message.content;
  } catch (err) {
    console.error('[LLM Error]', err.message);
    return mockResponse(systemPrompt, userMessage);
  }
}

// 演示模式：无需API Key也能跑通流程
function mockResponse(systemPrompt, userMessage) {
  const agentName = systemPrompt.match(/我是(.+?)[，,]/)?.[1] || 'Agent';
  return `【${agentName} 模拟响应】\n收到消息：「${userMessage}」\n\n（当前为演示模式，请在 Vercel 环境变量中配置 LLM_API_KEY 启用真实AI）`;
}

module.exports = { chat };
