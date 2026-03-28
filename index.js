// index.js — OpenClaw 智途AI 后端入口 v2.0
// 🦞 七大Agent · 用户系统 · CMS · 小程序

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { v4: uuidv4 } = require('uuid');

const { route, callAgent, listAgents } = require('./router');
const { getHistory, appendHistory, clearSession, sessionCount } = require('./memory');
const { requireAuth } = require('./middleware/auth');

const authRoutes   = require('./routes/auth');
const cmsRoutes    = require('./routes/cms');
const miniappRoutes = require('./routes/miniapp');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ── 核心接口 ──
app.get('/status', (req, res) => {
  res.json({ status: 'ok', product: '智途AI·旅业云', version: '2.0.0', agents: listAgents().length, activeSessions: sessionCount(), time: new Date().toISOString() });
});
app.get('/agents', (req, res) => { res.json({ agents: listAgents() }); });

app.post('/chat', requireAuth, async (req, res) => {
  const { message, agent: agentHint } = req.body;
  let { sessionId } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: '消息不能为空' });
  if (!sessionId) sessionId = uuidv4();
  const history = getHistory(sessionId);
  try {
    const result = await route(message.trim(), agentHint, history);
    appendHistory(sessionId, message, result.reply);
    res.json({ sessionId, agent: result.agent, agentName: result.agentName, emoji: result.emoji, reply: result.reply, timestamp: new Date().toISOString() });
  } catch (err) { console.error('[Chat Error]', err); res.status(500).json({ error: '服务暂时异常' }); }
});

app.post('/agent/:name', requireAuth, async (req, res) => {
  const { name } = req.params;
  const { message } = req.body;
  let { sessionId } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: '消息不能为空' });
  if (!sessionId) sessionId = uuidv4();
  const history = getHistory(sessionId);
  try {
    const result = await callAgent(name, message.trim(), history);
    if (result.error) return res.status(404).json(result);
    appendHistory(sessionId, message, result.reply);
    res.json({ sessionId, agent: result.agent, agentName: result.agentName, emoji: result.emoji, reply: result.reply, timestamp: new Date().toISOString() });
  } catch (err) { console.error('[Agent Error]', err); res.status(500).json({ error: '服务暂时异常' }); }
});

app.delete('/session/:sessionId', (req, res) => { clearSession(req.params.sessionId); res.json({ ok: true }); });

// ── 模块路由 ──
app.use('/api/auth', authRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/miniapp', miniappRoutes);

app.use((req, res) => { res.status(404).json({ error: '接口不存在' }); });

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════════════╗
  ║   🦞 智途AI·旅业云 v2.0  http://localhost:${PORT}        ║
  ╠══════════════════════════════════════════════════════════╣
  ║   核心: /status /agents /chat /agent/:name               ║
  ║   用户: /api/auth/register|login|wechat-login|profile     ║
  ║   CMS:  /api/cms/nav|sections|pages|config               ║
  ║   小程序: /api/miniapp/info|chat|agents                   ║
  ╚══════════════════════════════════════════════════════════╝
  `);
});
