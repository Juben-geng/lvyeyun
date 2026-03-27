@echo off
REM ================================================
REM 月令灵境 - 一键部署脚本
REM 日期: 2026-03-27
REM ================================================

echo.
echo ========================================
echo   月令灵境 AI 旅游 SaaS - 一键部署
echo ========================================
echo.

REM 检查 Git 是否已安装
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [错误] 未检测到 Git，请先安装 Git: https://git-scm.com/downloads
    pause
    exit /b 1
)

REM 步骤 1: 检查 Git 状态
echo [1/3] 检查 Git 仓库状态...
cd /d C:\Users\Administrator\WorkBuddy\Claw\openclaw-server
git status
echo.

REM 步骤 2: 推送到 GitHub
echo [2/3] 推送代码到 GitHub...
echo 仓库地址: https://github.com/Juben-geng/yuetulingjing.git
echo.
set /p confirm="确认推送? (Y/N): "
if /i not "%confirm%"=="Y" (
    echo [取消] 用户取消操作
    pause
    exit /b 0
)

echo.
git push -u origin main --force
if %ERRORLEVEL% neq 0 (
    echo.
    echo [错误] 推送失败，请检查网络连接或 GitHub 凭证
    echo.
    echo 提示:
    echo 1. 确认 GitHub 凭证已配置（Windows 凭据管理器）
    echo 2. 如需要，请创建 Personal Access Token: https://github.com/settings/tokens
    echo 3. Token 需要的权限: repo, workflow
    echo.
    pause
    exit /b 1
)

echo.
echo [成功] 代码已推送到 GitHub!
echo.

REM 步骤 3: 显示后续步骤
echo [3/3] 后续步骤:
echo.
echo 1. 创建 Supabase 项目:
echo    访问: https://supabase.com
echo    - 创建项目（名称: yuetulingjing）
echo    - 执行 supabase_schema.sql 建表
echo    - 获取 Project URL 和 service_role key
echo.
echo 2. 部署到 Vercel:
echo    访问: https://vercel.com/new
echo    - 导入 yuetulingjing 仓库
echo    - 配置环境变量:
echo      LLM_API_KEY = demo
echo      SUPABASE_URL = https://xxx.supabase.co
echo      SUPABASE_SERVICE_KEY = eyJhbGci...
echo    - 点击 Deploy
echo.
echo 3. 查看详细文档:
echo    GITHUB_DEPLOYMENT.md
echo.
echo ========================================
echo   部署指南已准备完成!
echo ========================================
echo.

REM 打开浏览器（可选）
set /p browser="是否打开 GitHub 仓库? (Y/N): "
if /i "%browser%"=="Y" (
    start https://github.com/Juben-geng/yuetulingjing
)

REM 打开部署文档
start C:\Users\Administrator\WorkBuddy\Claw\openclaw-server\GITHUB_DEPLOYMENT.md

echo.
pause
