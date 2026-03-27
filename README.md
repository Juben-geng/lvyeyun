# 🦞 OpenClaw · 智途AI 后端

> 旅游SaaS · 七大Agent · Node.js + Supabase + Vercel

## 快速启动（本地）

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 填入 LLM_API_KEY、SUPABASE_URL、SUPABASE_SERVICE_KEY

# 3. 启动
npm start
# → http://localhost:3000
```

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/status` | 健康检查 |
| GET | `/agents` | 查看所有Agent |
| POST | `/chat` | 主对话（龙虾自动路由） |
| POST | `/agent/:name` | 直接呼叫指定Agent |
| DELETE | `/session/:id` | 清除会话 |

### 调用示例

```bash
# 发消息（龙虾自动判断路由给哪个Agent）
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "我想去云南旅游5天"}'

# 直接呼叫小心（情感伴侣）
curl -X POST http://localhost:3000/agent/xiaoxin \
  -H "Content-Type: application/json" \
  -d '{"message": "今天是王阿姨的生日", "sessionId": "xxx"}'
```

---

## 部署到 Vercel

### 第一步：建 Supabase 数据库

1. 去 [supabase.com](https://supabase.com) 注册，新建项目
2. 进入 **SQL Editor**，复制 `supabase_schema.sql` 全部内容执行
3. 去 **Project Settings → API** 复制：
   - `Project URL` → `SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_KEY`

### 第二步：部署 Vercel

```bash
# 方式一：命令行（需安装 vercel CLI）
npm i -g vercel
vercel

# 方式二：GitHub 自动部署（推荐）
# 1. 把 openclaw-server 推到 GitHub
# 2. 去 vercel.com 导入项目
# 3. 在 Environment Variables 填入：
#    LLM_API_KEY / SUPABASE_URL / SUPABASE_SERVICE_KEY / LLM_MODEL
# 4. Deploy → 拿到公网地址 ✅
```

---

## 七大 Agent

| Agent | 激活词 | 职责 |
|-------|--------|------|
| 🦞 龙虾 | `龙虾` | 总指挥，意图识别+分发 |
| 🍊 小橙 | `小橙` `需求采集` | 10分钟完整采集旅游需求 |
| 🗺️ 小蓝 | `小蓝` `制作行程` | 3分钟生成行程初稿 |
| 💰 小金 | `小金` `比价` `报价` | 5分钟出比价报告 |
| 🌟 小暖 | `小暖` `出行提醒` | 出行前中后全程管家 |
| ❤️ 小心 | `小心` `生日祝福` | 情感伴侣，终身关系维护 |
| 📋 小绿 | `小绿` `运营汇总` | 运营数据汇总与分析 |

## 数据库结构

```
customers         客户档案（小心的记忆核心）
customer_memories 客户记忆（旅行故事/偏好/情感）
sessions          会话历史（多Agent对话）
orders            订单
itineraries       行程方案（小蓝生成）
quotes            报价单（小金生成）
```
