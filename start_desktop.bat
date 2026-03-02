@echo off
chcp 65001 >nul

REM 启动永达传媒AI广告投放管理系统桌面端前端
echo 启动桌面端前端服务...
echo 服务地址: http://localhost:3001
echo API代理到: http://localhost:16000
echo.

cd /d "%~dp0\frontend-desktop"

REM 检查Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Node.js，请先安装Node.js 18+
    pause
    exit /b 1
)

REM 检查npm_modules
if not exist "node_modules" (
    echo 安装依赖...
    call npm install
    if errorlevel 1 (
        echo 安装依赖失败
        pause
        exit /b 1
    )
)

echo 启动桌面端前端...
npm run dev

pause
