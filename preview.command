#!/bin/bash
# 本地预览 onechart.top 数据雷达
# 双击此文件即可在浏览器中查看

DIR="$(cd "$(dirname "$0")" && pwd)"
PORT=8765

echo "🚀 启动本地预览服务器..."
echo "   地址: http://localhost:$PORT"
echo "   按 Ctrl+C 停止"

# 打开浏览器
sleep 1
open "http://localhost:$PORT/index.html" 2>/dev/null

# 启动 HTTP 服务器
cd "$DIR" && python3 -m http.server $PORT 2>/dev/null
