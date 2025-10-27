@echo off
echo 🚀 快速启动神奇木结构学习平台...

REM 检查端口占用
netstat -ano | findstr :3000 >nul
if %errorlevel% == 0 (
    echo ⚠️  端口 3000 被占用，将使用端口 3001
) else (
    echo ✅ 端口 3000 可用
)

REM 启动开发服务器
echo 🌐 启动开发服务器...
echo 📱 访问地址: http://localhost:3000 或 http://localhost:3001
echo ⏳ 正在启动，请稍候...

npm run dev

pause
