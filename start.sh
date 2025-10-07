#!/bin/bash

echo "🚀 启动微信聊天回复助手..."

# 检查是否存在 .env 文件
if [ ! -f ".env" ]; then
    echo "⚠️  未找到 .env 文件，正在创建..."
    cp .env.example .env
    echo "✅ 已创建 .env 文件，请编辑该文件并填入您的 OpenAI API Key"
    echo "📝 编辑命令: nano .env 或 vim .env"
    read -p "按回车键继续..."
fi

# 检查 Python 依赖
echo "📦 检查 Python 依赖..."
if ! pip list | grep -q fastapi; then
    echo "🔧 安装 Python 依赖..."
    pip install -r requirements.txt
fi

# 检查 Node.js 依赖
echo "📦 检查 Node.js 依赖..."
if [ ! -d "node_modules" ]; then
    echo "🔧 安装 Node.js 依赖..."
    npm install
fi

# 启动后端服务
echo "🔥 启动后端服务..."
python main.py &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端服务
echo "🌐 启动前端服务..."
npm start &
FRONTEND_PID=$!

echo "✅ 应用启动完成！"
echo "📱 前端地址: http://localhost:3000"
echo "🔧 后端地址: http://localhost:8000"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

