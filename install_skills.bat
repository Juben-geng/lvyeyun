@echo off
REM ========================================
REM 旅业云AI · TripClaw 技能安装脚本
REM ========================================

echo.
echo ========================================
echo   旅业云AI · TripClaw 技能安装
echo ========================================
echo.

REM 检查 Node.js 版本
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js v18+
    pause
    exit /b 1
)

echo [1/6] 正在安装 travel-planner（旅游规划核心技能）...
npx skills add ailabs-393/ai-labs-claude-skills@travel-planner -g -y
if %errorlevel% neq 0 (
    echo [警告] travel-planner 安装失败
) else (
    echo [成功] travel-planner 安装完成
)
echo.

echo [2/6] 正在安装 itinerary-optimizer（行程优化器）...
npx skills add onewave-ai/claude-skills@itinerary-optimizer -g -y
if %errorlevel% neq 0 (
    echo [警告] itinerary-optimizer 安装失败
) else (
    echo [成功] itinerary-optimizer 安装完成
)
echo.

echo [3/6] 正在安装 ljg-travel（城市深度研究）...
npx skills add lijigang/ljg-skills@ljg-travel -g -y
if %errorlevel% neq 0 (
    echo [警告] ljg-travel 安装失败
) else (
    echo [成功] ljg-travel 安装完成
)
echo.

echo [4/6] 正在安装 crm-automation（CRM自动化）...
npx skills add claude-office-skills/skills@crm-automation -g -y
if %errorlevel% neq 0 (
    echo [警告] crm-automation 安装失败
) else (
    echo [成功] crm-automation 安装完成
)
echo.

echo [5/6] 正在安装 customer-success（客户成功管理）...
npx skills add claude-office-skills/skills@customer-success -g -y
if %errorlevel% neq 0 (
    echo [警告] customer-success 安装失败
) else (
    echo [成功] customer-success 安装完成
)
echo.

echo [6/6] 正在安装 multi-agent-orchestration（多Agent编排）...
npx skills add yonatangross/orchestkit@multi-agent-orchestration -g -y
if %errorlevel% neq 0 (
    echo [警告] multi-agent-orchestration 安装失败
) else (
    echo [成功] multi-agent-orchestration 安装完成
)
echo.

echo ========================================
echo   安装完成！正在验证...
echo ========================================
echo.

npx skills list -g

echo.
echo ========================================
echo   提示：查看 SKILLS_INTEGRATION_GUIDE.md 了解详细信息
echo ========================================
pause
