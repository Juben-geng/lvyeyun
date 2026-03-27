# 🎯 OpenClaw 部署快速参考卡

## 📋 关键步骤概览

| 步骤 | 操作 | 时间 | 状态 |
|------|------|------|------|
| 1 | 推送代码到 GitHub | 5分钟 | ⬜ |
| 2 | 创建 Supabase 项目 | 15分钟 | ⬜ |
| 3 | 执行建表脚本 | 5分钟 | ⬜ |
| 4 | 部署到 Vercel | 10分钟 | ⬜ |
| 5 | 验证功能 | 10分钟 | ⬜ |

---

## 🔑 关键信息保存处

### GitHub 仓库
- 仓库地址: `https://github.com/Juben-geng/openclaw-server`
- 分支: `main`

### Supabase 凭证（待填写）
```
Project URL: ________________________________________

service_role key: ___________________________________

数据库密码: ________________________________________
```

### Vercel 项目（待填写）
```
项目地址: ________________________________________

环境变量:
  - LLM_API_KEY: _________________________________
  - SUPABASE_URL: _______________________________
  - SUPABASE_SERVICE_KEY: ________________________
```

---

## 🚀 快速命令

### Git 推送
```powershell
cd C:\Users\Administrator\WorkBuddy\Claw\openclaw-server
git add .
git commit -m "update: 更新配置"
git push origin main
```

### 本地测试
```powershell
npm install
npm start
# 访问 http://localhost:3000/status
```

### 验证部署
```bash
# 健康检查
curl https://your-project.vercel.app/status

# Agent列表
curl https://your-project.vercel.app/agents

# 测试对话
curl -X POST https://your-project.vercel.app/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"你好","sessionId":"test"}'
```

---

## 📱 重要链接

- **Vercel**: https://vercel.com
- **Supabase**: https://supabase.com
- **GitHub**: https://github.com/Juben-geng/openclaw-server

---

## 🔍 故障排查速查

| 问题 | 检查项 | 解决方案 |
|------|--------|---------|
| 部署失败 | Vercel日志 | 查看构建错误信息 |
| API 500 | 环境变量 | 确认所有变量已配置 |
| 静态404 | 路由配置 | 检查 vercel.json |
| 数据库错误 | Supabase凭证 | 验证 URL 和 Key |

---

## ✅ 成功标志

- ✅ Vercel 显示 "Deployment successful"
- ✅ `/status` 返回 `{"status":"ok"}`
- ✅ `/agents` 返回七大Agent列表
- ✅ `/chat` 测试对话成功
- ✅ 前端页面正常显示

---

**开始部署吧！** 🚀

详细指南请查看: **DEPLOYMENT_GUIDE.md**
