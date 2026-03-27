# 🦞 OpenClaw · 智途AI

> **旅游行业AI SaaS产品 · 用AI龙虾替代旅游定制师的重复低效工作**
>
> 目标客户：中小旅游定制团队 & 传统旅行社
> 核心定位：需求沟通 · 行程制作 · 供应商比价，三大场景全覆盖

---

## 📄 前端页面说明

| 页面 | 说明内容 |
|------|---------|
| `index.html` | 官网首页 · 产品定位与核心价值 · 三大痛点 · 效率对比 |
| `features.html` | 三大场景 + 七大Agent + 七层AI能力矩阵 · 完整功能介绍 |
| `xiaoxin_soul.html` | 小心灵魂说明书 · 情感伴侣 · 终身客户关系 |
| `fullstack.html` | 全栈说明书v1.0 · 架构图 · 数据库设计 · 落地路线 |

---

## 🤖 七大Agent后端

| Agent | 名字 | 替代岗位 | 激活词 |
|-------|------|---------|--------|
| 🦞 总指挥 | 龙虾 | 团队主管 | `龙虾` |
| 🍊 需求采集 | 小橙 | 定制师前台 | `小橙` `需求采集` |
| 🗺️ 行程规划 | 小蓝 | 资深定制师 | `小蓝` `制作行程` |
| 💰 比价报价 | 小金 | 操作+财务 | `小金` `比价` |
| 🌟 售后管家 | 小暖 | 售后客服 | `小暖` `出行提醒` |
| ❤️ 情感伴侣 | 小心 | 客户关系（全新）| `小心` `生日祝福` |
| 📋 运营官 | 小绿 | 操作OP | `小绿` `运营汇总` |

---

## 🚀 本地快速启动

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
copy .env.example .env
# 编辑 .env，填入 LLM_API_KEY / SUPABASE_URL / SUPABASE_SERVICE_KEY

# 3. 启动服务
npm start
# → http://localhost:3000
```

无 API Key 时自动进入**演示模式**，直接可测试所有Agent路由。

---

## 🗄️ Supabase 建表

1. 登录 [supabase.com](https://supabase.com) 新建项目
2. 左侧 **SQL Editor** → 粘贴 `supabase_schema.sql` → 点 **Run**
3. 自动创建6张表：`customers`（客户档案）· `conversations`（会话记录）· `orders`（订单）· `itineraries`（行程方案）· `suppliers`（供应商）· `daily_reports`（运营日报）

---

## ⚙️ 环境变量

```env
# AI 大模型（支持 OpenAI / DeepSeek / 硅基流动）
LLM_API_KEY=your_api_key
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

PORT=3000
```

---

## 🌐 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/status` | 健康检查 |
| GET | `/agents` | 所有Agent列表 |
| POST | `/chat` | 主对话入口（龙虾自动路由） |
| POST | `/agent/:name` | 直接呼叫指定Agent（xiaocheng / xiaolan / xiaojin / xiaonuan / xiaoxin / xiaolv）|

### 🧪 七大Agent · 真实场景测试示例

> 启动服务后，逐条复制执行，体验完整系统能力。

---

**① 🦞 龙虾总指挥 — 自动识别意图，分发给对应Agent**
```bash
# 龙虾读懂你的需求，自动决定交给谁处理
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "我想带父母去西藏，10天，预算3万，老人有高血压", "sessionId": "s001"}'
```

---

**② 🍊 小橙·需求采集 — 1问1答，零漏项采集客户需求**
```bash
# 小橙主动追问，把需求问清楚
curl -X POST http://localhost:3000/agent/xiaocheng \
  -H "Content-Type: application/json" \
  -d '{"message": "我要订个旅游", "sessionId": "s002"}'
```

---

**③ 🗺️ 小蓝·行程规划 — 3分钟出行程初稿**
```bash
# 给小蓝需求，直接出行程
curl -X POST http://localhost:3000/agent/xiaolan \
  -H "Content-Type: application/json" \
  -d '{"message": "云南大理+丽江，5天4晚，2大1小（6岁），喜欢古镇和自然风景，不想太赶", "sessionId": "s003"}'
```

---

**④ 💰 小金·比价报价 — 自动比价+利润计算**
```bash
# 小金出供应商比价报告
curl -X POST http://localhost:3000/agent/xiaojin \
  -H "Content-Type: application/json" \
  -d '{"message": "大理丽江5天，客人预算8000/人，帮我比一下A社和B社报价，利润要留15%", "sessionId": "s004"}'
```

---

**⑤ 🌟 小暖·售后管家 — 出行提醒+全程安全陪伴**
```bash
# 小暖发出行前提醒
curl -X POST http://localhost:3000/agent/xiaonuan \
  -H "Content-Type: application/json" \
  -d '{"message": "王阿姨一家明天早上8点出发去云南，航班MU2345，提醒她注意事项", "sessionId": "s005"}'
```

---

**⑥ ❤️ 小心·情感伴侣 — 一对一终身客户关系**
```bash
# 小心在客人生日当天发祝福
curl -X POST http://localhost:3000/agent/xiaoxin \
  -H "Content-Type: application/json" \
  -d '{"message": "今天是王阿姨64岁生日，她去年和我们去了西藏，特别喜欢布达拉宫，发一条走心祝福", "sessionId": "s006"}'
```

---

**⑦ 📋 小绿·运营官 — 日报汇总+订单数据**
```bash
# 小绿生成今日运营日报
curl -X POST http://localhost:3000/agent/xiaolv \
  -H "Content-Type: application/json" \
  -d '{"message": "出今天的运营汇总，新询单5个，成交2单，出行3组，有什么需要跟进的", "sessionId": "s007"}'
```

---

**⑧ 系统健康检查 + 查看所有Agent状态**
```bash
# 检查服务是否正常
curl http://localhost:3000/status

# 列出全部7个Agent信息
curl http://localhost:3000/agents
```

---

## ☁️ 部署到 Vercel

1. 打开 [vercel.com/new](https://vercel.com/new) → 选 `lvyeyun` 仓库
2. Environment Variables 只填这3个：

| Key | Value |
|-----|-------|
| `LLM_API_KEY` | `demo`（演示模式，可先不接真实AI） |
| `SUPABASE_URL` | 你的 Supabase Project URL |
| `SUPABASE_SERVICE_KEY` | 你的 Supabase service_role key |

3. 点 **Deploy** → 完成 🚀

验证：打开 `https://lvyeyun.vercel.app/status` 返回 `{"status":"ok"}` = 成功

> 💡 没有 Supabase 也能部署，系统自动降级内存模式，所有功能照常演示。

---

## 📁 项目结构

```
lvyeyun/
├── index.html              ← 🏠 官网首页
├── features.html           ← ✨ 三大场景+七大Agent+七层矩阵
├── xiaoxin_soul.html       ← ❤️ 小心·情感伴侣灵魂说明书
├── fullstack.html          ← 🛠️ 全栈说明书 v1.0
├── index.js                ← Express 主入口
├── router.js               ← 🦞 龙虾·总指挥路由器
├── llm.js                  ← AI 调用层（演示模式自动降级）
├── db.js                   ← Supabase 数据层
├── memory.js               ← 会话记忆（Supabase / 内存双模式）
├── vercel.json             ← Vercel 部署配置
├── supabase_schema.sql     ← 6张表建表 SQL
├── .env.example            ← 环境变量模板
└── agents/
    ├── xiaocheng.js        ← 🍊 小橙·需求采集
    ├── xiaolan.js          ← 🗺️ 小蓝·行程规划
    ├── xiaojin.js          ← 💰 小金·比价报价
    ├── xiaonuan.js         ← 🌟 小暖·售后管家
    ├── xiaoxin.js          ← ❤️ 小心·情感伴侣
    └── xiaolv.js           ← 📋 小绿·运营官
```

---

## 🗺️ 落地路线

```
Phase 1（0-3月）：验证需求采集模块（小橙上线）
       ↓
Phase 2（3-6月）：打通需求→行程→报价全链路
       ↓
Phase 3（6-12月）：SaaS规模复制，接入更多旅行社
```

---

> 🦞 **龙虾说**：不只是效率工具，而是帮旅行社与每一个客人建立**一生的关系**。
