// index.js — OpenClaw 智途AI 后端入口
// 🦞 七大Agent · 旅游SaaS · Node.js + Express

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { v4: uuidv4 } = require('uuid');

const { route, callAgent, listAgents } = require('./router');
const { getHistory, appendHistory, clearSession, sessionCount } = require('./memory');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────
// 健康检查
// ─────────────────────────────────────────────
app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    product: 'OpenClaw 智途AI',
    version: '1.0.0',
    agents: listAgents().length,
    activeSessions: sessionCount(),
    time: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────
// 列出所有Agent
// ─────────────────────────────────────────────
app.get('/agents', (req, res) => {
  res.json({ agents: listAgents() });
});

// ─────────────────────────────────────────────
// 主对话接口（龙虾路由）
// POST /chat
// Body: { message, sessionId?, agent? }
// ─────────────────────────────────────────────
app.post('/chat', async (req, res) => {
  const { message, agent: agentHint } = req.body;
  let { sessionId } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: '消息不能为空' });
  }

  // 自动生成sessionId
  if (!sessionId) sessionId = uuidv4();

  const history = getHistory(sessionId);

  try {
    const result = await route(message.trim(), agentHint, history);
    appendHistory(sessionId, message, result.reply);

    res.json({
      sessionId,
      agent: result.agent,
      agentName: result.agentName,
      emoji: result.emoji,
      reply: result.reply,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[Chat Error]', err);
    res.status(500).json({ error: '服务暂时异常，请稍后再试' });
  }
});

// ─────────────────────────────────────────────
// 直接呼叫指定Agent
// POST /agent/:name
// Body: { message, sessionId? }
// ─────────────────────────────────────────────
app.post('/agent/:name', async (req, res) => {
  const { name } = req.params;
  const { message } = req.body;
  let { sessionId } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: '消息不能为空' });
  }

  if (!sessionId) sessionId = uuidv4();

  const history = getHistory(sessionId);

  try {
    const result = await callAgent(name, message.trim(), history);
    if (result.error) {
      return res.status(404).json(result);
    }

    appendHistory(sessionId, message, result.reply);

    res.json({
      sessionId,
      agent: result.agent,
      agentName: result.agentName,
      emoji: result.emoji,
      reply: result.reply,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[Agent Error]', err);
    res.status(500).json({ error: '服务暂时异常' });
  }
});

// ─────────────────────────────────────────────
// 清除会话
// DELETE /session/:sessionId
// ─────────────────────────────────────────────
app.delete('/session/:sessionId', (req, res) => {
  clearSession(req.params.sessionId);
  res.json({ ok: true, message: '会话已清除' });
});

// ─────────────────────────────────────────────
// 启动
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   🦞 OpenClaw 智途AI 后端已启动           ║
  ║   http://localhost:${PORT}                  ║
  ╠══════════════════════════════════════════╣
  ║   GET  /status        健康检查           ║
  ║   GET  /agents        查看所有Agent      ║
  ║   POST /chat          主对话入口         ║
  ║   POST /agent/:name   直接呼叫Agent      ║
  ║   DELETE /session/:id 清除会话           ║
  ╚══════════════════════════════════════════╝
  `);
});
