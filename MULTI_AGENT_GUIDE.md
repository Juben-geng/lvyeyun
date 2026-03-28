# 多Agent架构配置指南
## Multi-Agent System Configuration Guide

---

## 📋 目录

1. [架构概述](#架构概述)
2. [配置方法](#配置方法)
3. [技能融合分析](#技能融合分析)
4. [最佳实践](#最佳实践)
5. [故障排查](#故障排查)

---

## 架构概述

### 🦞 TripClaw 七大 Agent 架构

```
用户请求
   ↓
🦞 龙虾 (Lobster) - 总指挥 Agent
   ↓ 智能路由
├─ 🍊 小橙 (Xiao Cheng) - 需求采集 Agent
├─ 🗺️ 小蓝 (Xiao Lan) - 行程规划 Agent
├─ 💰 小金 (Xiao Jin) - 比价报价 Agent
├─ 🌟 小暖 (Xiao Nuan) - 售后管家 Agent
├─ ❤️ 小心 (Xiao Xin) - 情感伴侣 Agent
└─ 📋 小绿 (Xiao Lü) - 运营官 Agent
```

---

## 配置方法

### 🚀 快速启动（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/Juben-geng/openclaw-server.git
cd openclaw-server

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的 API Key

# 4. 启动服务
npm start

# 服务将在 http://localhost:3000 启动
```

---

### 🔧 手动配置步骤

#### 步骤 1: 环境变量配置

**`.env` 文件：**
```env
# 基础配置
PORT=3000
NODE_ENV=production

# LLM 配置
LLM_API_KEY=your_api_key_here
LLM_MODEL=gpt-4
LLM_BASE_URL=https://api.openai.com/v1

# 数据库配置（可选，演示模式不需要）
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
```

#### 步骤 2: Agent 配置

**`agents/config.js` 文件：**
```javascript
module.exports = {
  // 🦞 龙虾 - 总指挥
  lobster: {
    name: '龙虾',
    role: '总指挥',
    description: '智能路由所有请求到合适的Agent',
    skills: ['multi-agent-orchestration'], // 多Agent编排技能
    temperature: 0.7,
    maxTokens: 2000,
  },

  // 🍊 小橙 - 需求采集
  xiaocheng: {
    name: '小橙',
    role: '需求采集',
    description: '通过对话收集用户需求和偏好',
    skills: [],
    temperature: 0.8,
    maxTokens: 1500,
  },

  // 🗺️ 小蓝 - 行程规划
  xiaolan: {
    name: '小蓝',
    role: '行程规划',
    description: '根据需求生成详细的行程方案',
    skills: [
      'travel-planner',      // 旅游规划技能
      'itinerary-optimizer', // 行程优化技能
      'ljg-travel'           // 城市深度研究技能
    ],
    temperature: 0.6,
    maxTokens: 3000,
  },

  // 💰 小金 - 比价报价
  xiaojin: {
    name: '小金',
    role: '比价报价',
    description: '查询实时价格并生成报价单',
    skills: [],
    temperature: 0.3, // 需要精确计算
    maxTokens: 2000,
  },

  // 🌟 小暖 - 售后管家
  xiaonuan: {
    name: '小暖',
    role: '售后管家',
    description: '提供出行提醒和售后服务',
    skills: ['customer-success'], // 客户成功管理技能
    temperature: 0.7,
    maxTokens: 1500,
  },

  // ❤️ 小心 - 情感伴侣
  xiaoxin: {
    name: '小心',
    role: '情感伴侣',
    description: '维护客户关系，提供个性化服务',
    skills: ['crm-automation'], // CRM自动化技能
    temperature: 0.8,
    maxTokens: 2000,
  },

  // 📋 小绿 - 运营官
  xiaolü: {
    name: '小绿',
    role: '运营官',
    description: '数据统计和分析',
    skills: [],
    temperature: 0.5,
    maxTokens: 1500,
  },
};
```

#### 步骤 3: 路由配置

**`router.js` 文件：**
```javascript
const express = require('express');
const router = express.Router();
const { routeToAgent } = require('./agents/route');

// 主聊天接口
router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId, userId } = req.body;

    // 🦞 龙虾智能路由
    const agentResult = await routeToAgent({
      message,
      sessionId,
      userId,
    });

    res.json({
      success: true,
      agent: agentResult.agent,
      response: agentResult.response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Agent 切换接口
router.post('/switch-agent', async (req, res) => {
  try {
    const { agent, sessionId } = req.body;

    // 验证 Agent 是否存在
    const validAgents = [
      'xiaocheng',
      'xiaolan',
      'xiaojin',
      'xiaonuan',
      'xiaoxin',
      'xiaolü',
      'lobster'
    ];

    if (!validAgents.includes(agent)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid agent name',
      });
    }

    res.json({
      success: true,
      message: `Switched to ${agent}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
```

---

## 技能融合分析

### ✅ 技能与 Agent 的完美融合

| 技能名称 | 关联 Agent | 融合方式 | 效果提升 |
|---------|-----------|---------|---------|
| **multi-agent-orchestration** | 🦞 龙虾 | 编排层增强 | 智能路由更精准，多Agent协同更流畅 |
| **travel-planner** | 🗺️ 小蓝 | 知识层增强 | 行程更专业，建议更准确 |
| **itinerary-optimizer** | 🗺️ 小蓝 | 算法层增强 | 行程优化，减少疲劳，提升体验 |
| **ljg-travel** | 🗺️ 小蓝 | 数据层增强 | 300+城市深度知识库 |
| **crm-automation** | ❤️ 小心 | 工作流增强 | 客户信息自动记录，任务自动创建 |
| **customer-success** | 🌟 小暖 | SOP增强 | 售后跟进标准化，满意度提升 |

---

### 🔍 融合机制详解

#### 1. **运行时注入（Runtime Injection）**

```javascript
// agents/route.js

const skills = require('../utils/skills');

async function routeToAgent({ message, sessionId, userId }) {
  // 1. 确定目标 Agent
  const targetAgent = determineAgent(message);

  // 2. 注入技能知识
  const enhancedPrompt = await skills.inject(targetAgent, {
    message,
    context: await getContext(sessionId),
  });

  // 3. 调用 LLM
  const response = await callLLM(enhancedPrompt);

  return {
    agent: targetAgent,
    response,
  };
}

module.exports = { routeToAgent };
```

#### 2. **技能注入示例**

**无技能注入（基础版）：**
```javascript
// 小蓝的基础 Prompt
const basePrompt = `
你是一个专业的旅游规划师，名叫小蓝 🗺️

用户消息：${message}

请生成一个详细的行程方案。
`;
```

**有技能注入（增强版）：**
```javascript
// 小蓝的增强 Prompt（注入了3个技能）
const enhancedPrompt = `
你是一个专业的旅游规划师，名叫小蓝 🗺️

【⚡ travel-planner 知识库】
${skills.get('travel-planner', destination)}

【🔧 itinerary-optimizer 优化算法】
${skills.get('itinerary-optimizer', {
  days: 3,
  pace: 'moderate',
  preferences: ['family', 'history'],
})}

【📚 ljg-travel 深度研究】
${skills.get('ljg-travel', destination)}

用户消息：${message}

请生成一个详细的行程方案，并结合以上知识库提供专业建议。
`;
```

---

### 📊 融合效果对比

#### 场景：用户问"规划3天西安行程，家庭出游"

**无技能融合（基础版）：**
```json
{
  "agent": "xiaolan",
  "response": "收到需求了！我来帮你排一个舒服的行程 🗺️\n\n第1天：\n  上午：兵马俑\n  下午：华清池\n  晚上：大雁塔\n\n第2天：\n  上午：陕西历史博物馆\n  下午：城墙骑行\n  晚上：回民街\n\n第3天：\n  上午：钟鼓楼\n  下午：自由活动\n\n有问题随时问我！😊"
}
```

**有技能融合（增强版）：**
```json
{
  "agent": "xiaolan",
  "response": "收到需求了！我来帮你排一个舒服的行程 🗺️\n\n【⚡ 深度研究】\n- 西安是13朝古都，兵马俑是必去，建议请讲解员\n- 陕西历史博物馆需要提前3天预约，免费但限流\n- 美食推荐：回民街、永兴坊、洒金桥\n\n【家庭出行特别建议】\n- 兵马俑：讲解员讲解历史故事，孩子更爱听\n- 华清池：骊山索道适合亲子\n- 大雁塔：音乐喷泉孩子喜欢（20:00-20:20）\n\n【行程优化方案】\n- 第1天和第2天顺序已优化，减少往返\n- 兵马俑和华清池安排在同一天，省时省力\n- 行程节奏：上午景区+下午休闲，孩子不累\n\n第1天：\n  上午：兵马俑（3小时）+ 讲解员预约（约100元/人）\n  下午：华清池（2小时）+ 骊山索道（亲子推荐）\n  晚上：大雁塔广场 + 喷泉表演（20:00-20:20）\n  美食推荐：永兴坊（近大雁塔，适合家庭）\n\n第2天：\n  上午：陕西历史博物馆（需提前3天预约，免费）\n  下午：城墙骑行（2小时）+ 碑林（文化教育）\n  晚上：回民街美食游\n  美食推荐：羊肉泡馍、肉夹馍、甑糕（孩子最爱）\n\n第3天：\n  上午：钟鼓楼 + 西安事变纪念馆（历史教育）\n  下午：书院门文化街（购买纪念品）\n  晚上：自由活动\n\n【贴心提示】\n- 提前3天预约陕西历史博物馆\n- 兵马俑讲解员约100元/人，很值得\n- 回民街下午4点后美食摊才全开\n\n有问题随时问我！😊"
}
```

---

## 最佳实践

### ✅ 推荐配置

#### 1. **Agent 温度配置**

| Agent | 温度 | 原因 |
|-------|------|------|
| 🦞 龙虾 | 0.7 | 需要一定的创造性进行路由 |
| 🍊 小橙 | 0.8 | 对话式交互，需要灵活性 |
| 🗺️ 小蓝 | 0.6 | 规划任务需要平衡创造性和准确性 |
| 💰 小金 | 0.3 | 价格计算必须精确 |
| 🌟 小暖 | 0.7 | 需要人情味和灵活性 |
| ❤️ 小心 | 0.8 | 客户关系需要高度个性化 |
| 📋 小绿 | 0.5 | 数据统计需要平衡准确性和可读性 |

#### 2. **技能加载优先级**

```javascript
// utils/skills.js

const skillPriority = {
  'lobster': ['multi-agent-orchestration'],
  'xiaolan': [
    'travel-planner',      // 优先级1：专业规划
    'ljg-travel',          // 优先级2：城市知识
    'itinerary-optimizer'  // 优先级3：行程优化
  ],
  'xiaoxin': ['crm-automation'],
  'xiaonuan': ['customer-success'],
};
```

#### 3. **会话管理**

```javascript
// utils/session.js

const sessions = new Map();

function setSession(sessionId, data) {
  sessions.set(sessionId, {
    agent: data.agent,
    messages: data.messages || [],
    context: data.context || {},
    lastActive: new Date(),
  });
}

function getSession(sessionId) {
  return sessions.get(sessionId);
}

function updateSession(sessionId, updates) {
  const session = sessions.get(sessionId);
  if (session) {
    sessions.set(sessionId, {
      ...session,
      ...updates,
      lastActive: new Date(),
    });
  }
}

module.exports = {
  setSession,
  getSession,
  updateSession,
};
```

---

## 故障排查

### ❌ 常见问题

#### 问题 1: Agent 路由错误

**症状：**
- 用户咨询行程规划，却被路由到比价报价
- 响应内容不匹配用户需求

**解决方案：**
```javascript
// 检查 agents/route.js 中的路由逻辑

function determineAgent(message) {
  const keywords = {
    xiaolan: ['行程', '规划', '路线', '去哪里', '旅游', '景点'],
    xiaojin: ['价格', '报价', '费用', '多少钱', '预算'],
    xiaoxin: ['客户', '会员', '优惠', '折扣', '积分'],
    xiaonuan: ['售后', '退款', '投诉', '问题', '帮助'],
  };

  for (const [agent, words] of Object.entries(keywords)) {
    if (words.some(word => message.includes(word))) {
      return agent;
    }
  }

  return 'xiaocheng'; // 默认返回需求采集
}
```

#### 问题 2: 技能未生效

**症状：**
- 技能已安装，但回复质量没有提升
- 缺少技能知识库的内容

**解决方案：**
```bash
# 1. 检查技能是否正确安装
npx skills list

# 2. 检查技能目录是否存在
ls ~/.agents/skills/

# 3. 检查 Agent 配置是否包含技能
# 编辑 agents/config.js，确保 skills 数组正确

# 4. 检查技能注入逻辑
# 编辑 utils/skills.js，确保 inject 方法正常工作
```

#### 问题 3: 会话记忆丢失

**症状：**
- 用户发送多条消息，但 Agent 不记得前面的内容
- 每次都重新开始对话

**解决方案：**
```javascript
// 确保在每次请求时带上 sessionId
const { message, sessionId, userId } = req.body;

// 获取历史消息
const session = getSession(sessionId);
const messages = session ? session.messages : [];

// 将新消息加入历史
messages.push({ role: 'user', content: message });

// 调用 LLM 时带上完整历史
const response = await callLLM(prompt, messages);

// 保存回复到历史
messages.push({ role: 'assistant', content: response });

// 更新会话
updateSession(sessionId, { messages });
```

---

## 🎯 总结

### ✅ 多Agent架构的核心优势

1. **专业化分工**：每个 Agent 专注一个领域，响应更精准
2. **技能增强**：通过技能注入，大幅提升专业能力
3. **灵活路由**：龙虾智能路由，自动选择最合适的 Agent
4. **会话连续性**：支持多轮对话，记住上下文
5. **易于扩展**：可以随时添加新的 Agent 或技能

### 🚀 与单Agent系统的对比

| 维度 | 单Agent | 多Agent (TripClaw) |
|------|---------|-------------------|
| **专业性** | ⚠️ 需要处理所有领域 | ✅ 每个Agent专精一个领域 |
| **响应速度** | ⚠️ Prompt长，处理慢 | ✅ 路由精准，处理快 |
| **技能集成** | ⚠️ 技能可能冲突 | ✅ 技能按Agent隔离 |
| **扩展性** | ⚠️ 添加功能需要修改核心 | ✅ 添加新Agent不影响现有 |
| **用户体验** | ⚠️ 回复可能不一致 | ✅ 每个Agent有专属性格 |

---

## 📚 相关文档

- **[SKILLS_INTEGRATION_GUIDE.md](./SKILLS_INTEGRATION_GUIDE.md)** - 技能集成详细指南
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Vercel 部署指南
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - API 接口文档
- **[install_skills.bat](./install_skills.bat)** - 技能一键安装脚本

---

**最后更新**: 2026-03-28
**版本**: v1.0.0
**维护者**: 智途AI团队 🦞
