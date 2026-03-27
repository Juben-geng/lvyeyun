// llm.js — 统一LLM调用层
// 支持 OpenAI / 任何兼容接口（硅基流动、DeepSeek、通义等）

const OpenAI = require('openai');
require('dotenv').config();

const client = new OpenAI({
  baseURL: process.env.LLM_BASE_URL || 'https://api.openai.com/v1',
  apiKey: process.env.LLM_API_KEY || 'sk-placeholder',
});

const MODEL = process.env.LLM_MODEL || 'gpt-4o-mini';

/**
 * 调用LLM
 * @param {string} systemPrompt - Agent人格/系统提示
 * @param {Array}  history      - 历史消息 [{role, content}]
 * @param {string} userMessage  - 当前用户消息
 * @returns {string} AI回复文本
 */
async function chat(systemPrompt, history = [], userMessage) {
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
    // 未配置API Key时返回模拟响应，方便本地测试
    return mockResponse(systemPrompt, userMessage);
  }
}

// 本地测试用：无需API Key也能跑通流程
function mockResponse(systemPrompt, userMessage) {
  const agentName = systemPrompt.match(/我是(.+?)，/)?.[1] || 'Agent';
  return `【${agentName} 模拟响应】\n收到消息：「${userMessage}」\n\n（当前为演示模式，请在 .env 中配置 LLM_API_KEY 启用真实AI）`;
}

module.exports = { chat };
