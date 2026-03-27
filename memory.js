// memory.js — 会话记忆层
// 有 Supabase 配置时持久化到数据库，否则降级为内存模式

const { DB_ENABLED, createSession, appendMessage: dbAppendMessage } = require('./db');

// 内存兜底（开发/演示用）
const localSessions = new Map();
const MAX_HISTORY = 20;

/** 获取会话历史消息 */
function getHistory(sessionId) {
  return localSessions.get(sessionId) || [];
}

/** 追加对话记录 */
async function appendHistory(sessionId, userMsg, assistantMsg, agentKey) {
  // 本地内存始终维护（用于当次请求的上下文）
  const history = localSessions.get(sessionId) || [];
  history.push({ role: 'user',      content: userMsg });
  history.push({ role: 'assistant', content: assistantMsg });

  if (history.length > MAX_HISTORY * 2) history.splice(0, 2);
  localSessions.set(sessionId, history);

  // 如果有 Supabase，异步持久化（不阻塞响应）
  if (DB_ENABLED) {
    dbAppendMessage(sessionId, { role: 'user',      content: userMsg,      agent: agentKey }).catch(() => {});
    dbAppendMessage(sessionId, { role: 'assistant', content: assistantMsg, agent: agentKey }).catch(() => {});
  }
}

/** 清除会话 */
function clearSession(sessionId) {
  localSessions.delete(sessionId);
}

/** 当前活跃会话数 */
function sessionCount() {
  return localSessions.size;
}

module.exports = { getHistory, appendHistory, clearSession, sessionCount };
