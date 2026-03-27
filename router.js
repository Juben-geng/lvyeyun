// router.js — 🦞 龙虾·总指挥（意图识别 + Agent分发）

const xiaocheng = require('./agents/xiaocheng');
const xiaolan   = require('./agents/xiaolan');
const xiaojin   = require('./agents/xiaojin');
const xiaonuan  = require('./agents/xiaonuan');
const xiaoxin   = require('./agents/xiaoxin');
const xiaolv    = require('./agents/xiaolv');
const { chat }  = require('./llm');

// 所有Agent注册表
const AGENTS = {
  xiaocheng,
  xiaolan,
  xiaojin,
  xiaonuan,
  xiaoxin,
  xiaolv,
};

// 龙虾的灵魂：总指挥，不亲自干活，只负责判断和调度
const LOBSTER_SOUL = `我是龙虾🦞，OpenClaw智途AI的总指挥。
我的职责是理解用户意图，判断应该由哪个Agent来服务，并给出简短的转接说明。

我管理的6个Agent：
- 小橙🍊：需求采集（用户想规划旅游、说需求）
- 小蓝🗺️：行程规划（需要排行程、制作方案）
- 小金💰：比价报价（问价格、算成本、做报价单）
- 小暖🌟：售后管家（出行提醒、在路上、遇到问题）
- 小心❤️：情感伴侣（生日、周年、老客户关系维护）
- 小绿📋：运营官（数据汇总、报表、运营分析）

当用户说「龙虾」或消息不明确时，我来直接回答并引导。
输出格式：只说一句话，自然、简短，像个老大哥。`;

/**
 * 根据关键词快速路由（不消耗LLM）
 */
function quickRoute(message) {
  const msg = message.toLowerCase();
  
  for (const [key, agent] of Object.entries(AGENTS)) {
    for (const keyword of agent.activationKeys) {
      if (msg.includes(keyword.toLowerCase())) {
        return key;
      }
    }
  }
  return null;
}

/**
 * 主路由入口
 * @param {string} message   - 用户消息
 * @param {string} agentHint - 前端指定的Agent（可选）
 * @param {Array}  history   - 会话历史
 * @returns {{ agent, agentName, emoji, reply }}
 */
async function route(message, agentHint, history = []) {
  // 1. 前端明确指定了Agent
  if (agentHint && AGENTS[agentHint]) {
    const agent = AGENTS[agentHint];
    const reply = await agent.handle(message, history);
    return { agent: agentHint, agentName: agent.name, emoji: agent.emoji, reply };
  }

  // 2. 关键词快速路由
  const quickAgent = quickRoute(message);
  if (quickAgent) {
    const agent = AGENTS[quickAgent];
    const reply = await agent.handle(message, history);
    return { agent: quickAgent, agentName: agent.name, emoji: agent.emoji, reply };
  }

  // 3. 龙虾兜底：直接回复 + 给出引导
  const lobsterReply = await chat(LOBSTER_SOUL, history, message);
  return { agent: 'lobster', agentName: '龙虾', emoji: '🦞', reply: lobsterReply };
}

/**
 * 直接调用指定Agent（bypass路由）
 */
async function callAgent(agentKey, message, history = []) {
  if (!AGENTS[agentKey]) {
    return { error: `Agent "${agentKey}" 不存在`, available: Object.keys(AGENTS) };
  }
  const agent = AGENTS[agentKey];
  const reply = await agent.handle(message, history);
  return { agent: agentKey, agentName: agent.name, emoji: agent.emoji, reply };
}

/**
 * 列出所有Agent信息
 */
function listAgents() {
  const list = [
    { key: 'lobster', name: '龙虾', emoji: '🦞', role: '总指挥', activationKeys: ['龙虾'] },
  ];
  for (const [key, agent] of Object.entries(AGENTS)) {
    list.push({
      key,
      name: agent.name,
      emoji: agent.emoji,
      activationKeys: agent.activationKeys,
    });
  }
  return list;
}

module.exports = { route, callAgent, listAgents };
