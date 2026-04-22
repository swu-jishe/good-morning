# Goal Radar Demo - 本地启动脚本
# 用法: 右键此文件 → "使用 PowerShell 运行"，或在终端执行: .\start.ps1

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Goal Radar Demo - 本地启动" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] 未检测到 Node.js，请先安装: https://nodejs.org/" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

# 检查 npm
try {
    $npmVersion = npm --version
    Write-Host "[OK] npm $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] 未检测到 npm" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

Write-Host ""

# 安装依赖
if (-not (Test-Path "node_modules")) {
    Write-Host "正在安装依赖..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] 依赖安装失败" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
    Write-Host "[OK] 依赖安装完成" -ForegroundColor Green
} else {
    Write-Host "[OK] 依赖已存在，跳过安装" -ForegroundColor Green
}

Write-Host ""
Write-Host "启动开发服务器..." -ForegroundColor Yellow
Write-Host "浏览器将自动打开: http://localhost:3000" -ForegroundColor Cyan
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor DarkGray
Write-Host ""

# 启动开发服务器
npm run dev
