@echo off
echo 正在检查 Node.js 安装...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未检测到 Node.js
    echo 请先安装 Node.js：https://nodejs.org/
    echo 安装完成后重新运行此脚本
    pause
    exit /b 1
)

echo Node.js 已安装，版本：
node --version

echo.
echo 正在安装项目依赖...
npm install

if %errorlevel% neq 0 (
    echo 依赖安装失败，请检查网络连接
    pause
    exit /b 1
)

echo.
echo 依赖安装完成！
echo 正在启动开发服务器...
echo.
echo 应用将在 http://localhost:3000 打开
echo 按 Ctrl+C 停止服务器
echo.

npm run dev
