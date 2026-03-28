// memory.js — 会话记忆层
// 有 Supabase 配置时持久化到数据库，否则降级为内存模式

let DB_ENABLED = false;
let dbAppendMessage = null;

try {
  const db = require('./db');
  DB_ENABLED = db.DB_ENABLED;
  dbAppendMessage = db.appendMessage;
} catch (err) {
  console.log('[Memory] ℹ️ db模块未加载，使用纯内存模式');
}

// 内存兜底
const localSessions = new Map();
const MAX_HISTORY = 20;

function getHistory(sessionId) {
  return localSessions.get(sessionId) || [];
}

async function appendHistory(sessionId, userMsg, assistantMsg, agentKey) {
  const history = localSessions.get(sessionId) || [];
  history.push({ role: 'user', content: userMsg });
  history.push({ role: 'assistant', content: assistantMsg });
  if (history.length > MAX_HISTORY * 2) history.splice(0, 2);
  localSessions.set(sessionId, history);

  if (DB_ENABLED && dbAppendMessage) {
    dbAppendMessage(sessionId, { role: 'user', content: userMsg, agent: agentKey }).catch(() => {});
    dbAppendMessage(sessionId, { role: 'assistant', content: assistantMsg, agent: agentKey }).catch(() => {});
  }
}

function clearSession(sessionId) { localSessions.delete(sessionId); }
function sessionCount() { return localSessions.size; }

module.exports = { getHistory, appendHistory, clearSession, sessionCount };
