# 🦞 OpenClaw · 智途AI

> **旅游行业AI SaaS产品 · 用AI龙虾替代旅游定制师的重复低效工作**
>
> 目标客户：中小旅游定制团队 & 传统旅行社
> 核心定位：需求沟通 · 行程制作 · 供应商比价，三大场景全覆盖

---

## 📄 前端页面说明

### 🏠 index.html — 官网首页 · 产品定位与核心价值
- 智途AI产品定位：旅行社AI效率工具
- 三大核心痛点与AI解法
- 整体效率对比：单日处理订单量 3-5组 → 20组+
- 产品价值主张与客户收益展示

### ✨ features.html — 实现与功能 · 三大场景 + 七大Agent + 七层能力矩阵
- **三大核心场景**
  - 需求采集：1-2小时 → 10分钟，AI对话零漏项
  - 行程制作：2-4小时 → 3分钟初稿生成
  - 供应商比价：1-3小时 → 5分钟出报告
- **七大Agent一览**：🦞龙虾（总指挥）· 🍊小橙（需求采集）· 🗺️小蓝（行程规划）· 💰小金（比价报价）· 🌟小暖（售后管家）· ❤️小心（情感伴侣）· 📋小绿（运营官）
- **七层AI能力矩阵**：从效率工具到情感伴侣的完整进化路径

### ❤️ xiaoxin_soul.html — 情感伴侣 · 小心灵魂说明书
- 小心的人格设计：知心大哥大姐 / 铁杆老友 / 成长伴侣
- 核心命题：不只是效率工具，而是帮旅行社与每一个客人建立一生的关系
- 客户画像体系：全年精准推荐 + 生日祝福 + 情感记忆
- 与传统客服的本质区别：从交易关系到终身关系

### 🛠️ fullstack.html — 全栈说明书 v1.0
- 完整技术架构图（前端 + 后端 + 数据库 + 部署）
- 七大Agent协作流程与数据流转
- Supabase数据库设计（6张核心表）
- Vercel部署方案 + 微信小程序对接路线图
- 落地路线：Phase 1验证期 → Phase 2全链路 → Phase 3规模复制

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

**对话示例：**
```json
POST /chat
{
  "message": "我想去云南，5天4晚，3大1小，预算2万",
  "sessionId": "user_001"
}
```

---

## ☁️ 部署到 Vercel

1. 代码推到 GitHub（`lvyeyun` 仓库）
2. 打开 [vercel.com/new](https://vercel.com/new) → 导入仓库
3. 填入3个环境变量（`LLM_API_KEY` / `SUPABASE_URL` / `SUPABASE_SERVICE_KEY`）
4. 点 **Deploy** → 几分钟后上线

访问地址：`https://lvyeyun.vercel.app`

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
