# 🦞 OpenClaw · 智途AI

> 旅游SaaS · 七大Agent · 前端展示 + Node.js后端 + Supabase + Vercel

---

## 📄 前端页面

| 文件 | 说明 |
|------|------|
| `index.html` | 🏠 官网首页 |
| `features.html` | ✨ 功能特性介绍 |
| `xiaoxin_soul.html` | ❤️ 小心·情感伴侣说明书 |
| `fullstack.html` | 🛠️ 全栈技术架构说明 |

直接用浏览器打开即可预览，或部署到 Vercel 后通过公网访问。

---

## 🤖 七大Agent后端

| Agent | 名字 | 职责 |
|-------|------|------|
| 🦞 总指挥 | 龙虾 | 意图识别 + 智能路由 |
| 🍊 需求采集 | 小橙 | 采集旅游需求，零漏项 |
| 🗺️ 行程规划 | 小蓝 | 3分钟生成行程初稿 |
| 💰 比价报价 | 小金 | 自动比价 + 利润计算 |
| 🌟 售后管家 | 小暖 | 出行提醒 + 售后服务 |
| ❤️ 情感伴侣 | 小心 | 一对一终身客户关系 |
| 📋 运营官 | 小绿 | 运营数据汇总 |

---

## 🚀 快速启动（本地）

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
copy .env.example .env
# 编辑 .env 填入你的 API Key

# 3. 启动服务
npm start
# 服务运行在 http://localhost:3000
```

---

## 🗄️ 数据库（Supabase）

1. 登录 [supabase.com](https://supabase.com) 新建项目
2. 左侧 **SQL Editor** → 粘贴 `supabase_schema.sql` 全部内容 → 点 **Run**
3. 建好6张表：客户档案、会话记录、订单、行程、供应商、运营日报

---

## ⚙️ 环境变量

```env
# AI 大模型（支持 OpenAI / DeepSeek / 硅基流动）
LLM_API_KEY=你的API Key
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
| GET | `/agents` | 获取所有Agent列表 |
| POST | `/chat` | 主对话入口（龙虾自动路由） |
| POST | `/agent/:name` | 直接呼叫指定Agent |

**对话示例：**
```json
POST /chat
{
  "message": "我想去云南，5天4晚，3大1小",
  "sessionId": "user_001"
}
```

---

## ☁️ 部署到 Vercel

1. 把代码推到 GitHub
2. 打开 [vercel.com/new](https://vercel.com/new) → 导入 `lvyeyun` 仓库
3. 填入环境变量（`LLM_API_KEY` / `SUPABASE_URL` / `SUPABASE_SERVICE_KEY`）
4. 点 **Deploy** → 几分钟后上线 🚀

部署后访问地址：`https://lvyeyun.vercel.app`

---

## 📁 项目结构

```
lvyeyun/
├── index.html              ← 前端首页
├── features.html           ← 功能介绍
├── xiaoxin_soul.html       ← 小心说明书
├── fullstack.html          ← 全栈架构
├── index.js                ← Express 主入口
├── router.js               ← 🦞 龙虾路由器
├── llm.js                  ← AI 调用层
├── db.js                   ← Supabase 数据层
├── memory.js               ← 会话记忆
├── vercel.json             ← Vercel 配置
├── supabase_schema.sql     ← 建表 SQL
└── agents/
    ├── xiaocheng.js        ← 🍊 小橙
    ├── xiaolan.js          ← 🗺️ 小蓝
    ├── xiaojin.js          ← 💰 小金
    ├── xiaonuan.js         ← 🌟 小暖
    ├── xiaoxin.js          ← ❤️ 小心
    └── xiaolv.js           ← 📋 小绿
```

---

> 🦞 **龙虾说**：不只是效率工具，而是帮旅行社与每一个客人建立一生的关系。
