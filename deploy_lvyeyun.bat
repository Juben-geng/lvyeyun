@echo off
chcp 65001 >nul
title 旅业云AI·TripClaw - 一键部署脚本

echo.
echo ==================================================
echo        旅业云AI·TripClaw - 一键部署脚本
echo ==================================================
echo.

cd /d "%~dp0"

echo [1/5] 添加所有文件到暂存区...
git add -A

echo.
echo [2/5] 提交代码...
git commit -m "refactor: 全面品牌更新为旅业云AI·TripClaw，增强旅游行业功能"

echo.
echo [3/5] 设置主分支为 main...
git branch -M main

echo.
echo [4/5] 配置远程仓库为 lvyeyun...
git remote remove origin
git remote add origin https://github.com/Juben-geng/lvyeyun.git

echo.
echo [5/5] 推送代码到 GitHub...
echo.

git push -u origin main --force

if %errorlevel% equ 0 (
    echo.
    echo ==================================================
    echo           🎉 部署成功！
    echo ==================================================
    echo.
    echo 仓库地址: https://github.com/Juben-geng/lvyeyun
    echo.
    echo 下一步:
    echo 1. 创建 Supabase 项目
    echo 2. 部署到 Vercel
    echo.
) else (
    echo.
    echo ==================================================
    echo           ❌ 推送失败，请检查网络连接
    echo ==================================================
    echo.
)

echo.
echo 按任意键退出...
pause >nul
