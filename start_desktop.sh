#!/bin/bash

# 启动永达传媒AI广告投放管理系统桌面端前端
echo "启动桌面端前端服务..."
echo "服务地址: http://localhost:3001"
echo "API代理到: http://localhost:16000"
echo ""

cd "$(dirname "$0")/frontend-desktop"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "错误: 未找到Node.js，请先安装Node.js 18+"
    exit 1
fi

# 检查npm_modules
if [ ! -d "node_modules" ]; then
    echo "安装依赖..."
    npm install
fi

echo "启动桌面端前端..."
npm run dev
