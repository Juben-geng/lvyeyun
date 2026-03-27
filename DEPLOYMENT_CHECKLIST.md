# ✅ OpenClaw 部署检查清单

## 📋 部署前检查

### 代码检查
- [ ] `vercel.json` 配置正确（路由设置）
- [ ] `db.js` 无语法错误
- [ ] `memory.js` 无语法错误
- [ ] `supabase_schema.sql` 完整
- [ ] 所有 Agent 文件完整

### 环境检查
- [ ] Node.js 已安装（建议 v18+）
- [ ] npm 已安装
- [ ] Git 已安装
- [ ] `.env.example` 存在

---

## 🗄️ Supabase 配置

### 创建项目
- [ ] 访问 [supabase.com](https://supabase.com) 并登录
- [ ] 创建新项目（openclaw-ai）
- [ ] 等待项目创建完成（2-3分钟）

### 执行建表
- [ ] 打开 SQL Editor
- [ ] 复制 `supabase_schema.sql` 内容
- [ ] 粘贴并执行
- [ ] 看到 "✅ OpenClaw 数据库建表完成！" 提示

### 获取凭证
- [ ] 复制 Project URL: `https://xxx.supabase.co`
- [ ] 复制 service_role key: `eyJhbGci...`
- [ ] 保存到安全位置

### 验证数据库
- [ ] 检查 Table Editor 中有6张表
- [ ] 测试 API 连接

---

## 🔧 环境变量配置

### 本地环境（.env）
```
LLM_API_KEY=demo                    # 演示模式
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci...
PORT=3000
```

### Vercel 环境
```
LLM_API_KEY=demo
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci...
```

---

## 📤 Git 推送

### 初始化仓库（首次）
```bash
git init
git add .
git commit -m "Initial commit: OpenClaw 智途AI"
```

### 配置远程仓库
```bash
git remote add origin https://github.com/用户名/仓库名.git
git branch -M main
git push -u origin main
```

### 更新代码
```bash
git add .
git commit -m "fix: 更新部署配置"
git push origin main
```

---

## 🚀 Vercel 部署

### 导入项目
- [ ] 访问 [vercel.com/new](https://vercel.com/new)
- [ ] 选择 Import Git Repository
- [ ] 选择 `openclaw-server` 仓库
- [ ] 点击 Import

### 配置项目
- [ ] Framework Preset: `Other`
- [ ] Root Directory: `./`（默认）

### 设置环境变量
- [ ] `LLM_API_KEY`: `demo`（或真实密钥）
- [ ] `SUPABASE_URL`: 你的 Supabase URL
- [ ] `SUPABASE_SERVICE_KEY`: 你的 service_role key

### 部署
- [ ] 点击 Deploy 按钮
- [ ] 等待 3-5 分钟
- [ ] 部署成功后记录 URL

---

## ✅ 部署后验证

### 基础检查
```bash
# 健康检查
curl https://your-project.vercel.app/status

# 查看所有 Agent
curl https://your-project.vercel.app/agents
```

### 测试七大Agent

#### 🦞 龙虾（总指挥）
```bash
curl -X POST https://your-project.vercel.app/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"我想订个旅游","sessionId":"test001"}'
```

#### 🍊 小橙（需求采集）
```bash
curl -X POST https://your-project.vercel.app/agent/xiaocheng \
  -H "Content-Type: application/json" \
  -d '{"message":"我要订个旅游","sessionId":"test002"}'
```

#### 🗺️ 小蓝（行程规划）
```bash
curl -X POST https://your-project.vercel.app/agent/xiaolan \
  -H "Content-Type: application/json" \
  -d '{"message":"云南大理5天4晚，2大1小，喜欢古镇","sessionId":"test003"}'
```

#### 💰 小金（比价报价）
```bash
curl -X POST https://your-project.vercel.app/agent/xiaojin \
  -H "Content-Type: application/json" \
  -d '{"message":"帮我比一下大理丽江5天的报价，利润要留15%","sessionId":"test004"}'
```

#### 🌟 小暖（售后管家）
```bash
curl -X POST https://your-project.vercel.app/agent/xiaonuan \
  -H "Content-Type: application/json" \
  -d '{"message":"提醒客户明天出发注意事项","sessionId":"test005"}'
```

#### ❤️ 小心（情感伴侣）
```bash
curl -X POST https://your-project.vercel.app/agent/xiaoxin \
  -H "Content-Type: application/json" \
  -d '{"message":"今天是客户生日，发个祝福","sessionId":"test006"}'
```

#### 📋 小绿（运营官）
```bash
curl -X POST https://your-project.vercel.app/agent/xiaolv \
  -H "Content-Type: application/json" \
  -d '{"message":"出今天的运营日报","sessionId":"test007"}'
```

### 前端页面访问
- [ ] 首页: `https://your-project.vercel.app/index.html`
- [ ] 功能页: `https://your-project.vercel.app/features.html`
- [ ] 情感伴侣: `https://your-project.vercel.app/xiaoxin_soul.html`
- [ ] 全栈架构: `https://your-project.vercel.app/fullstack.html`

---

## 🔍 故障排查

### 问题1：部署失败
- [ ] 检查 Vercel 部署日志
- [ ] 确认环境变量配置正确
- [ ] 检查 package.json 依赖

### 问题2：API 404 错误
- [ ] 检查 vercel.json 路由配置
- [ ] 确认 index.js 路由定义

### 问题3：Supabase 连接失败
- [ ] 验证 Supabase URL 和 Key
- [ ] 检查 Supabase 项目状态
- [ ] 查看浏览器控制台错误信息

### 问题4：静态文件 404
- [ ] 确认 HTML 文件已推送到 GitHub
- [ ] 检查 vercel.json 路由规则
- [ ] 查看文件名大小写

---

## 📊 部署成功标志

### ✅ Vercel 显示
- Deployment successful
- Build time < 2 minutes
- All routes responding

### ✅ API 响应
- `/status` 返回 JSON
- `/agents` 返回七大Agent列表
- `/chat` 对话功能正常

### ✅ 前端页面
- 首页正常加载
- 所有功能页可访问
- 样式显示正确

---

## 🎉 完成！

恭喜！你的 OpenClaw 智途AI 已成功部署到 Vercel！

现在你可以：
- 🌐 访问前端页面展示产品
- 🔧 通过 API 测试七大Agent
- 📊 在 Supabase Dashboard 管理数据
- 🚀 开始你的 AI 之旅！

---

**部署日期**: ___________  
**部署人员**: ___________  
**项目 URL**: ___________  
**部署状态**: ✅ 成功 / ❌ 失败
