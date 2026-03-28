// routes/miniapp.js — 🦞 微信小程序专用API
// 小程序前端通过这些API与后端交互

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const auth = require('../auth');
const { route, callAgent, listAgents } = require('../router');
const { v4: uuidv4 } = require('uuid');
const { getHistory, appendHistory, clearSession, sessionCount } = require('../memory');

// ─────────────────────────────────────────────
// 小程序版本管理
// ─────────────────────────────────────────────

// 当前小程序版本信息
const miniappVersions = [
  {
    version: '1.0.0',
    status: 'released',
    description: '首个正式版：AI对话、行程规划',
    releasedAt: '2026-03-28',
    forceUpdate: false,
  },
];

// ─────────────────────────────────────────────
// GET /api/miniapp/info — 小程序信息
// ─────────────────────────────────────────────
router.get('/info', (req, res) => {
  const latest = miniappVersions[miniappVersions.length - 1];
  res.json({
    app: {
      name: '智途AI',
      version: latest.version,
      description: '七大AI Agent · 让旅行更简单',
      icon: '/logo.svg',
      apiBase: process.env.API_BASE_URL || '',
    },
    agents: listAgents(),
    update: {
      current: latest.version,
      status: latest.status,
      description: latest.description,
      forceUpdate: latest.forceUpdate,
    },
  });
});

// ─────────────────────────────────────────────
// POST /api/miniapp/chat — 小程序AI对话
// Body: { message, sessionId?, agent? }
// Header: Authorization: Bearer <token>
// ─────────────────────────────────────────────
router.post('/chat', requireAuth, async (req, res) => {
  const { message, agent: agentHint } = req.body;
  let { sessionId } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: '消息不能为空' });
  }
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
    console.error('[MiniApp Chat Error]', err);
    res.status(500).json({ error: '服务暂时异常' });
  }
});

// ─────────────────────────────────────────────
// GET /api/miniapp/agents — Agent列表
// ─────────────────────────────────────────────
router.get('/agents', (req, res) => {
  res.json({ agents: listAgents() });
});

// ─────────────────────────────────────────────
// GET /api/miniapp/itinerary — 行程方案（历史）
// ─────────────────────────────────────────────
router.get('/itinerary', requireAuth, (req, res) => {
  // TODO: 从数据库获取用户的历史行程
  res.json({ itineraries: [], message: '暂无行程记录' });
});

// ─────────────────────────────────────────────
// 管理后台：小程序版本管理
// ─────────────────────────────────────────────

// 获取所有版本
router.get('/admin/versions', requireAuth, (req, res) => {
  res.json({ versions: miniappVersions });
});

// 发布新版本
router.post('/admin/versions', requireAuth, (req, res) => {
  const { version, description, forceUpdate } = req.body;
  if (!version || !description) return res.status(400).json({ error: '版本号和描述不能为空' });

  miniappVersions.push({
    version,
    status: 'released',
    description,
    releasedAt: new Date().toISOString().slice(0, 10),
    forceUpdate: forceUpdate || false,
  });

  res.json({ message: '版本已发布', versions: miniappVersions });
});

module.exports = router;
