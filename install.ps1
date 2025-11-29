# ==========================================
# Photo Hosting Project - Full Installation
# ==========================================
# Run this script in PowerShell (as Administrator)
# ==========================================

Write-Host "🚀 Photo Hosting Project Installation" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "1️⃣  Checking Node.js installation..." -ForegroundColor Yellow
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
$npmCheck = Get-Command npm -ErrorAction SilentlyContinue

if ($null -eq $nodeCheck -or $null -eq $npmCheck) {
    Write-Host "❌ Node.js is NOT installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Please install Node.js first:" -ForegroundColor Cyan
    Write-Host "   1. Go to: https://nodejs.org/" -ForegroundColor White
    Write-Host "   2. Download LTS version (16 or newer)" -ForegroundColor White
    Write-Host "   3. Run installer" -ForegroundColor White
    Write-Host "   4. ✅ CHECK 'Add to PATH'" -ForegroundColor Green
    Write-Host "   5. Restart PowerShell" -ForegroundColor White
    Write-Host "   6. Run this script again" -ForegroundColor White
    Write-Host ""
    exit
}

Write-Host "✅ Node.js found" -ForegroundColor Green
node --version
npm --version
Write-Host ""

# Install backend dependencies
Write-Host "2️⃣  Installing Backend Dependencies..." -ForegroundColor Yellow
cd d:\project\three\backend

if (Test-Path "node_modules") {
    Write-Host "   Cleaning old node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
}

Write-Host "   Running: npm install" -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend npm install failed" -ForegroundColor Red
    exit
}
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
Write-Host ""

# Install frontend dependencies
Write-Host "3️⃣  Installing Frontend Dependencies..." -ForegroundColor Yellow
cd d:\project\three\frontend

if (Test-Path "node_modules") {
    Write-Host "   Cleaning old node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
}

Write-Host "   Running: npm install" -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend npm install failed" -ForegroundColor Red
    exit
}
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
Write-Host ""

# Create .env files
Write-Host "4️⃣  Setting up Environment Files..." -ForegroundColor Yellow

# Backend .env
if (-not (Test-Path "d:\project\three\backend\.env")) {
    Write-Host "   Creating backend/.env" -ForegroundColor Cyan
    Copy-Item "d:\project\three\backend\.env.example" "d:\project\three\backend\.env" -ErrorAction SilentlyContinue
    Write-Host "   ✅ backend/.env created" -ForegroundColor Green
} else {
    Write-Host "   ✓ backend/.env already exists" -ForegroundColor Gray
}

# Frontend .env
if (-not (Test-Path "d:\project\three\frontend\.env")) {
    Write-Host "   Creating frontend/.env" -ForegroundColor Cyan
    Copy-Item "d:\project\three\frontend\.env.example" "d:\project\three\frontend\.env" -ErrorAction SilentlyContinue
    Write-Host "   ✅ frontend/.env created" -ForegroundColor Green
} else {
    Write-Host "   ✓ frontend/.env already exists" -ForegroundColor Gray
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "✅ INSTALLATION COMPLETE!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start Backend (Port 5000):" -ForegroundColor White
Write-Host "  cd d:\project\three\backend" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "To start Frontend (Port 3000) - in NEW PowerShell window:" -ForegroundColor White
Write-Host "  cd d:\project\three\frontend" -ForegroundColor Yellow
Write-Host "  npm start" -ForegroundColor Yellow
Write-Host ""
Write-Host "📖 Documentation:" -ForegroundColor Cyan
Write-Host "  - Quick Start: QUICK_START.md" -ForegroundColor Gray
Write-Host "  - Setup Guide: SETUP_GUIDE.md" -ForegroundColor Gray
Write-Host "  - API Docs: docs/API_DOCUMENTATION.md" -ForegroundColor Gray
Write-Host "  - Architecture: ARCHITECTURE.md" -ForegroundColor Gray
Write-Host ""
