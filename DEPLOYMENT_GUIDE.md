# 🚀 OpenClaw 完整部署交互指南

> **目标**: 30-45分钟完成 Vercel + Supabase 完整部署

---

## 📋 部署概览

### 部署步骤
1. ✅ 推送代码到 GitHub（5分钟）
2. 🗄️ 创建 Supabase 项目并建表（20分钟）
3. 🚀 部署到 Vercel（10分钟）
4. ✅ 验证功能（10分钟）

### 预期结果
- 🌐 完整的七大Agent后端API
- 🗄️ Supabase 数据库持久化
- 🎉 所有功能正常运行

---

## 📤 第一步：推送代码到 GitHub（5分钟）

### 1.1 检查 Git 状态

打开 PowerShell 或 CMD，执行：

```powershell
cd C:\Users\Administrator\WorkBuddy\Claw\openclaw-server
git status
```

**如果看到以下内容，说明已经有 Git 仓库**：
```
On branch main
...
```

**如果没有 Git 仓库，先初始化**：
```powershell
git init
```

### 1.2 添加所有文件并提交

```powershell
git add .
git commit -m "fix: 完成部署配置和文档"
```

### 1.3 连接远程仓库

**如果已经配置过远程仓库**：
```powershell
git remote -v
# 应该显示 origin https://github.com/Juben-geng/openclaw-server.git
```

**如果没有配置，添加远程仓库**：
```powershell
git remote add origin https://github.com/Juben-geng/openclaw-server.git
git branch -M main
```

### 1.4 推送到 GitHub

```powershell
git push origin main
```

如果提示需要认证，使用你的 GitHub 账号密码即可。

**验证**：访问 https://github.com/Juben-geng/openclaw-server 查看代码是否推送成功。

---

## 🗄️ 第二步：创建 Supabase 项目（20分钟）

### 2.1 注册/登录 Supabase

1. 访问 [supabase.com](https://supabase.com)
2. 点击 **Start your project**
3. 使用 GitHub 账号登录或注册

### 2.2 创建新项目

1. 点击 **New project** 按钮
2. 填写项目信息：

   - **Name**: `openclaw-ai`（或你喜欢的名字）
   - **Database Password**: 设置一个强密码（例如：`OpenClaw2026!`）
     - ⚠️ **重要**：请记住这个密码！无法查看！
   - **Region**: 选择最接近你的区域
     - 推荐：**Southeast Asia (Singapore)**（如果在国内）
     - 或 **East US (Virginia)**（如果在美国）

3. 点击 **Create new project**
4. 等待 2-3 分钟，项目创建完成

### 2.3 执行建表脚本

1. 在左侧菜单点击 **SQL Editor**
2. 点击 **New query** 按钮
3. 复制 `supabase_schema.sql` 文件的全部内容
4. 粘贴到 SQL Editor
5. 点击 **Run** 按钮（或按 `Ctrl+Enter`）

**成功标志**：看到提示 `✅ OpenClaw 数据库建表完成！6张表已就绪。`

### 2.4 验证表结构

1. 在左侧菜单点击 **Table Editor**
2. 检查是否有以下6张表：
   - ✅ customers
   - ✅ customer_memories
   - ✅ sessions
   - ✅ orders
   - ✅ itineraries
   - ✅ quotes

### 2.5 获取 API 凭证

1. 在左侧菜单点击 **Project Settings**
2. 点击 **API** 标签
3. 复制以下信息并保存到安全位置：

#### Project URL
```
https://xxxxxxxxxxxx.supabase.co
```

#### service_role key（重要！）
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**注意**：
- ✅ 复制 `service_role` key（不是 `anon` key）
- ⚠️ 这个密钥有完整数据库权限，请妥善保管
- ❌ 不要泄露给任何人或发布到 GitHub

---

## 🚀 第三步：部署到 Vercel（10分钟）

### 3.1 连接 Vercel

1. 访问 [vercel.com/new](https://vercel.com/new)
2. 如果没有账号，点击 **Sign up** 注册（推荐使用 GitHub 账号登录）
3. 允许 Vercel 访问你的 GitHub 账号

### 3.2 导入项目

1. 在 Vercel 首页点击 **Add New...** → **Project**
2. 在 **Import Git Repository** 中找到 `openclaw-server`
3. 点击右侧的 **Import** 按钮

### 3.3 配置项目

在配置页面：

- **Framework Preset**: 选择 `Other`
- **Root Directory**: 保持默认 `./`
- **Build and Output Settings**: 保持默认

### 3.4 配置环境变量

滚动到 **Environment Variables** 部分，添加以下变量：

#### 变量 1：LLM_API_KEY
- **Name**: `LLM_API_KEY`
- **Value**: `your_real_api_key_here`
  - 替换为你的 OpenAI / DeepSeek / 硅基流动 API 密钥
  - 或暂时使用 `demo` 进行测试

#### 变量 2：SUPABASE_URL
- **Name**: `SUPABASE_URL`
- **Value**: `https://xxxxxxxxxxxx.supabase.co`
  - 替换为你的 Supabase Project URL

#### 变量 3：SUPABASE_SERVICE_KEY
- **Name**: `SUPABASE_SERVICE_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  - 替换为你的 Supabase service_role key

#### 可选变量（不配置不影响运行）
- **Name**: `LLM_BASE_URL`
- **Value**: `https://api.openai.com/v1`

- **Name**: `LLM_MODEL`
- **Value**: `gpt-4o-mini`

### 3.5 开始部署

1. 确认所有配置无误
2. 点击页面底部的 **Deploy** 按钮
3. 等待 3-5 分钟

**成功标志**：看到绿色的 `✅ Deployment successful` 提示。

### 3.6 记录访问地址

部署成功后，复制你的项目 URL：
```
https://openclaw-server-xxxxx.vercel.app
```

---

## ✅ 第四步：验证部署（10分钟）

### 4.1 测试健康检查

打开浏览器或使用 curl：

```bash
curl https://your-project.vercel.app/status
```

**预期响应**：
```json
{
  "status": "ok",
  "product": "OpenClaw 智途AI",
  "version": "1.0.0",
  "agents": 7,
  "activeSessions": 0,
  "time": "2026-03-27T..."
}
```

### 4.2 测试 Agent 列表

```bash
curl https://your-project.vercel.app/agents
```

**预期响应**：返回七大Agent的完整列表。

### 4.3 测试对话功能

#### 测试 🦞 龙虾（总指挥）

```bash
curl -X POST https://your-project.vercel.app/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"我想订个旅游","sessionId":"test001"}'
```

#### 测试 🍊 小橙（需求采集）

```bash
curl -X POST https://your-project.vercel.app/agent/xiaocheng \
  -H "Content-Type: application/json" \
  -d '{"message":"我要订个旅游","sessionId":"test002"}'
```

#### 测试 🗺️ 小蓝（行程规划）

```bash
curl -X POST https://your-project.vercel.app/agent/xiaolan \
  -H "Content-Type: application/json" \
  -d '{"message":"云南大理5天4晚，2大1小，喜欢古镇","sessionId":"test003"}'
```

### 4.4 访问前端页面

在浏览器中打开：

- 首页: `https://your-project.vercel.app/index.html`
- 功能页: `https://your-project.vercel.app/features.html`
- 情感伴侣: `https://your-project.vercel.app/xiaoxin_soul.html`
- 全栈架构: `https://your-project.vercel.app/fullstack.html`

### 4.5 验证 Supabase 数据库

1. 访问 Supabase 项目
2. 打开 **Table Editor**
3. 查看 `sessions` 表
4. 应该能看到你的测试会话记录

---

## 🎊 部署完成！

恭喜！你的 OpenClaw 智途AI 已成功部署！

### 你现在拥有

- 🌐 **完整的后端API** - 七大Agent全部在线
- 🗄️ **Supabase数据库** - 数据持久化存储
- 🎯 **客户关系管理** - 小心可以记住每个客人
- 🚀 **全球CDN加速** - Vercel自动优化
- 🔒 **自动HTTPS** - 安全访问保障

### 下一步

1. **配置域名**（可选）
   - 在 Vercel 项目设置中添加自定义域名

2. **配置API密钥**（如果使用演示模式）
   - 在 Vercel 环境变量中更新为真实的 LLM API Key

3. **测试所有Agent**
   - 使用上面的 curl 命令逐一测试

4. **邀请团队使用**
   - 分享前端页面 URL
   - 配置团队 API Key 配额

---

## 🔍 故障排查

### 问题1：部署失败
**解决方案**：
- 查看 Vercel 部署日志
- 检查环境变量配置
- 确认 GitHub 仓库权限

### 问题2：API 返回 500 错误
**解决方案**：
- 检查 Supabase URL 和 Key 是否正确
- 查看 Vercel 函数日志
- 验证 Supabase 项目状态

### 问题3：静态文件 404
**解决方案**：
- 检查 vercel.json 路由配置
- 确认 HTML 文件已推送到 GitHub
- 查看 Vercel 构建日志

### 问题4：Supabase 连接失败
**解决方案**：
- 验证 service_role key 是否正确
- 检查 Supabase 项目是否活跃
- 查看 Supabase Logs

---

## 📞 获取帮助

遇到问题时，可以参考：

- **DEPLOYMENT.md** - 详细的部署文档
- **SUPABASE_SETUP.md** - Supabase 配置指南
- **DEPLOYMENT_CHECKLIST.md** - 故障排查清单
- **Vercel 文档**: https://vercel.com/docs
- **Supabase 文档**: https://supabase.com/docs

---

**祝你部署顺利！** 🦞

**预计完成时间**: 30-45分钟  
**难度**: ⭐⭐⭐ (中等)
