@echo off
chcp 65001 > nul
echo ================================
echo TripClaw 预部署检查脚本
echo ================================
echo.

echo [1/5] 检查 Node.js 版本...
node --version
if %errorlevel% neq 0 (
    echo ❌ 错误：未安装 Node.js
    exit /b 1
)
echo ✅ Node.js 版本正常
echo.

echo [2/5] 检查依赖安装...
if not exist "node_modules" (
    echo ⚠️  依赖未安装，正在安装...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        exit /b 1
    )
)
echo ✅ 依赖已安装
echo.

echo [3/5] 检查必要文件...
set "missing_files=0"

if not exist "index.js" (
    echo ❌ 缺少：index.js
    set /a "missing_files+=1"
)

if not exist "package.json" (
    echo ❌ 缺少：package.json
    set /a "missing_files+=1"
)

if not exist "vercel.json" (
    echo ❌ 缺少：vercel.json
    set /a "missing_files+=1"
)

if not exist ".env.example" (
    echo ❌ 缺少：.env.example
    set /a "missing_files+=1"
)

if %missing_files% gtr 0 (
    echo ❌ 错误：缺少 %missing_files% 个必要文件
    exit /b 1
)
echo ✅ 所有必要文件存在
echo.

echo [4/5] 测试代码语法...
node --check index.js
if %errorlevel% neq 0 (
    echo ❌ 错误：index.js 语法错误
    exit /b 1
)
echo ✅ 代码语法正常
echo.

echo [5/5] 检查环境变量...
if exist ".env" (
    echo ✅ .env 文件存在
) else (
    echo ⚠️  .env 文件不存在，将从 .env.example 复制
    copy .env.example .env > nul
    echo ✅ 已创建 .env 文件
)
echo.

echo ================================
echo ✅ 预部署检查完成！
echo ================================
echo.
echo 可以开始部署了：
echo   1. vercel login
echo   2. vercel deploy
echo.
