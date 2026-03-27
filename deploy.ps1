# OpenClaw 快速部署脚本
# PowerShell 脚本 - Windows 环境使用

Write-Host "🦞 OpenClaw 部署助手" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

# 检查 Git 是否已安装
try {
    $gitVersion = git --version
    Write-Host "✅ Git 已安装: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git 未安装，请先安装 Git" -ForegroundColor Red
    exit 1
}

# 检查 Node.js 是否已安装
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js 已安装: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js 未安装，请先安装 Node.js" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 第一步：安装依赖..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "✅ 依赖安装完成" -ForegroundColor Green
Write-Host ""

# 检查 .env 文件是否存在
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  未找到 .env 文件，正在创建..." -ForegroundColor Yellow
    
    # 复制环境变量模板
    Copy-Item ".env.example" ".env"
    
    Write-Host "✅ 已创建 .env 文件" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  请编辑 .env 文件，填入以下配置：" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   1. LLM_API_KEY = 你的API密钥（或设置为 demo 使用演示模式）"
    Write-Host "   2. SUPABASE_URL = https://xxx.supabase.co"
    Write-Host "   3. SUPABASE_SERVICE_KEY = 你的Supabase服务密钥"
    Write-Host ""
    Write-Host "   详细配置请参考 SUPABASE_SETUP.md" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "按任意键继续..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# 检查本地是否能运行
Write-Host ""
Write-Host "🧪 第二步：本地测试..." -ForegroundColor Yellow
Write-Host "正在启动服务器..." -ForegroundColor Cyan

# 启动服务器（后台运行）
Start-Process -FilePath "node" -ArgumentList "index.js" -NoNewWindow -RedirectStandardOutput "server.log" -RedirectStandardError "server-error.log"

# 等待服务器启动
Start-Sleep -Seconds 3

# 测试健康检查
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/status" -UseBasicParsing
    $status = $response.Content | ConvertFrom-Json
    
    if ($status.status -eq "ok") {
        Write-Host "✅ 服务器启动成功！" -ForegroundColor Green
        Write-Host "   - 状态: $($status.status)" -ForegroundColor Cyan
        Write-Host "   - 版本: $($status.version)" -ForegroundColor Cyan
        Write-Host "   - Agent数量: $($status.agents)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ 服务器响应异常" -ForegroundColor Red
        Stop-Process -Name "node" -ErrorAction SilentlyContinue
        exit 1
    }
} catch {
    Write-Host "❌ 无法连接到服务器，请检查日志" -ForegroundColor Red
    Write-Host "   查看 server-error.log 了解详情" -ForegroundColor Red
    Stop-Process -Name "node" -ErrorAction SilentlyContinue
    exit 1
}

# 停止服务器
Stop-Process -Name "node" -ErrorAction SilentlyContinue
Write-Host "✅ 本地测试完成，已停止服务器" -ForegroundColor Green

Write-Host ""
Write-Host "📤 第三步：推送到 GitHub..." -ForegroundColor Yellow

# 检查是否已经初始化 Git
if (-not (Test-Path ".git")) {
    Write-Host "正在初始化 Git 仓库..." -ForegroundColor Cyan
    git init
    git add .
    git commit -m "Initial commit: OpenClaw 智途AI"
} else {
    Write-Host "Git 仓库已存在，更新代码..." -ForegroundColor Cyan
    git add .
    git commit -m "fix: 修复部署配置和语法错误"
}

Write-Host ""
Write-Host "✅ 代码已提交到本地仓库" -ForegroundColor Green
Write-Host ""

# 检查是否配置了远程仓库
$remote = git remote get-url origin 2>$null
if ($remote) {
    Write-Host "✅ 远程仓库已配置: $remote" -ForegroundColor Green
    Write-Host "正在推送到 GitHub..." -ForegroundColor Cyan
    git push origin main
} else {
    Write-Host "⚠️  未配置远程仓库" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "请手动执行以下命令：" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   git remote add origin https://github.com/用户名/仓库名.git" -ForegroundColor White
    Write-Host "   git branch -M main" -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "然后访问 https://vercel.com/new 导入仓库" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "✅ 部署准备完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📋 下一步操作：" -ForegroundColor Yellow
Write-Host ""
Write-Host "   1. 访问 https://vercel.com/new" -ForegroundColor Cyan
Write-Host "   2. 导入 GitHub 仓库" -ForegroundColor Cyan
Write-Host "   3. 配置环境变量（参考 .env 文件）" -ForegroundColor Cyan
Write-Host "   4. 点击 Deploy" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 详细文档：" -ForegroundColor Yellow
Write-Host "   - DEPLOYMENT.md: Vercel 部署指南" -ForegroundColor Cyan
Write-Host "   - SUPABASE_SETUP.md: Supabase 配置指南" -ForegroundColor Cyan
Write-Host ""
Write-Host "🦞 祝部署顺利！" -ForegroundColor Green
