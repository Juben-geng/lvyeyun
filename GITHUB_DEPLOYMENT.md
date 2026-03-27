# 🚀 月令灵境 - GitHub 部署指南

## 项目信息

- **仓库名**: yuetulingjing
- **GitHub 用户**: Juben-geng
- **仓库地址**: https://github.com/Juben-geng/yuetulingjing

---

## 📝 第一步：推送代码到 GitHub

由于网络连接问题，请手动执行以下命令：

```powershell
# 进入项目目录
cd C:\Users\Administrator\WorkBuddy\Claw\openclaw-server

# 检查远程仓库
git remote -v

# 如果需要重新设置远程仓库
git remote remove origin
git remote add origin https://github.com/Juben-geng/yuetulingjing.git

# 推送代码
git push -u origin main --force
```

**如果遇到认证问题**：
- Windows 凭据管理器会自动处理
- 如果提示输入用户名和密码：
  - 用户名：`Juben-geng`
  - 密码：GitHub Personal Access Token（如未创建，请在 GitHub 设置中生成）

---

## 🗄️ 第二步：创建 Supabase 数据库

### 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)
2. 点击 **New project**
3. 填写项目信息：
   - **Project Name**: `yuetulingjing`
   - **Database Password**: 设置强密码（保存好！）
   - **Region**: 选择距离你最近的区域
4. 等待项目创建（约 2 分钟）

### 2. 执行建表脚本

1. 在 Supabase 控制台，点击左侧 **SQL Editor**
2. 点击 **New Query**
3. 复制以下内容（或打开项目中的 `supabase_schema.sql`）：

```sql
-- 创建客户档案表
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100),
  phone VARCHAR(20),
  wechat VARCHAR(100),
  email VARCHAR(100),
  preferences TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建会话记录表
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  session_id VARCHAR(100),
  agent_type VARCHAR(50),
  messages JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建订单表
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  order_number VARCHAR(50),
  destination VARCHAR(100),
  days INTEGER,
  adults INTEGER,
  children INTEGER,
  price DECIMAL(10,2),
  status VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建行程方案表
CREATE TABLE IF NOT EXISTS itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  title VARCHAR(200),
  content TEXT,
  days JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建供应商表
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100),
  type VARCHAR(50),
  contact VARCHAR(100),
  price_range VARCHAR(50),
  notes TEXT
);

-- 创建运营日报表
CREATE TABLE IF NOT EXISTS daily_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE,
  total_customers INTEGER,
  total_orders INTEGER,
  total_revenue DECIMAL(10,2),
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

4. 点击 **Run** 执行脚本

### 3. 获取 API 凭证

1. 在 Supabase 控制台，点击左侧 **Settings** → **API**
2. 复制以下信息：
   - **Project URL**: `https://xxx.supabase.co`
   - **service_role key**: `eyJhbGci...`（长字符串）

⚠️ **重要**：service_role key 具有完全访问权限，请妥善保管！

---

## ☁️ 第三步：部署到 Vercel

### 1. 导入项目

1. 访问 [vercel.com/new](https://vercel.com/new)
2. 点击 **Import Git Repository**
3. 选择 `yuetulingjing` 仓库
4. 点击 **Import**

### 2. 配置项目

**Framework Preset**: `Other`

**Environment Variables**（环境变量）：

| Key | Value | 说明 |
|-----|-------|------|
| `LLM_API_KEY` | `demo` | 演示模式（测试用） |
| `SUPABASE_URL` | `https://xxx.supabase.co` | 从 Supabase 复制 |
| `SUPABASE_SERVICE_KEY` | `eyJhbGci...` | 从 Supabase 复制 |

### 3. 开始部署

1. 点击 **Deploy** 按钮
2. 等待 3-5 分钟
3. 部署成功后会显示访问地址

---

## ✅ 第四步：验证部署

### 1. 测试后端 API

```bash
# 健康检查
curl https://your-project.vercel.app/status

# Agent 列表
curl https://your-project.vercel.app/agents

# 测试对话
curl -X POST https://your-project.vercel.app/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"你好，我想订个旅游","sessionId":"test001"}'
```

### 2. 访问前端页面

- 🌐 首页：`https://your-project.vercel.app/index.html`
- ✨ 功能：`https://your-project.vercel.app/features.html`
- 💓 情感伴侣：`https://your-project.vercel.app/xiaoxin_soul.html`
- 🛠️ 全栈架构：`https://your-project.vercel.app/fullstack.html`

### 3. 验证七大 Agent

访问以下链接测试各 Agent 功能：

- 🦞 总指挥：`/chat`
- 🍊 小橙：`/agent/xiaocheng`
- 🗺️ 小蓝：`/agent/xiaolan`
- 💰 小金：`/agent/xiaojin`
- 🌟 小暖：`/agent/xiaonuan`
- ❤️ 小心：`/agent/xiaoxin`
- 📋 小绿：`/agent/xiaolv`

---

## 🎯 升级到生产模式

需要真实 AI 功能时，更新环境变量：

1. 在 Vercel 项目中，进入 **Settings** → **Environment Variables**
2. 修改 `LLM_API_KEY` 为你的真实 API 密钥
3. 可选的 AI 提供商：
   - OpenAI: `sk-...`
   - DeepSeek: `sk-...`
   - 硅基流动: `sk-...`
4. 重新部署

---

## 📊 部署检查清单

### 推送代码
- [ ] 代码已推送到 `https://github.com/Juben-geng/yuetulingjing`
- [ ] 仓库包含所有必要文件（11个文件）

### Supabase 配置
- [ ] 已创建 Supabase 项目
- [ ] 已执行建表脚本（6张表）
- [ ] 已获取 Project URL 和 service_role key

### Vercel 部署
- [ ] 已导入仓库到 Vercel
- [ ] 已配置环境变量（LLM_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY）
- [ ] 部署成功并获取访问地址

### 功能验证
- [ ] `/status` 返回 `{"status":"ok"}`
- [ ] `/agents` 返回七大 Agent 列表
- [ ] `/chat` 测试对话成功
- [ ] 前端页面正常显示
- [ ] 所有七大 Agent 功能可用

---

## 🔧 故障排查

### 问题1：Git 推送失败

**解决方案**：
```powershell
# 检查远程仓库
git remote -v

# 重新设置
git remote remove origin
git remote add origin https://github.com/Juben-geng/yuetulingjing.git
git push -u origin main --force
```

### 问题2：Supabase 连接失败

**解决方案**：
- 确认 URL 格式：`https://xxx.supabase.co`（不要有多余的斜杠）
- 确认 service_role key 是完整的长字符串
- 检查 Supabase 项目是否活跃（不是暂停状态）

### 问题3：Vercel 部署失败

**解决方案**：
- 查看 Vercel 部署日志
- 检查环境变量是否正确配置
- 确认 `vercel.json` 文件存在

### 问题4：API 调用返回 500 错误

**解决方案**：
- 检查 Vercel 环境变量是否已更新
- 重新部署 Vercel 项目
- 查看服务器日志

---

## 📞 获取帮助

- **GitHub**: https://github.com/Juben-geng/yuetulingjing
- **Vercel 文档**: https://vercel.com/docs
- **Supabase 文档**: https://supabase.com/docs

---

**部署日期**: 2026-03-27  
**项目**: 月令灵境 AI 旅游 SaaS  
**状态**: ✅ 准备就绪，可以开始部署
