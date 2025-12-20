# 🚀 Legal SaaS - Installation Script
# Αυτό το script εγκαθιστά τα νέα features

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Legal SaaS - New Features Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray

try {
    npm install
    Write-Host ""
    Write-Host "✓ Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to install dependencies!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Installation Complete! ✨" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "New Features Added:" -ForegroundColor Yellow
Write-Host "  1. 👁️  Password Toggle in Login Page" -ForegroundColor White
Write-Host "  2. 🌐 Full Bilingual Support (Greek/English)" -ForegroundColor White
Write-Host ""

Write-Host "To start the development server, run:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host ""

Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  • Quick Start:         QUICK_START.md" -ForegroundColor White
Write-Host "  • Full Guide:          I18N_IMPLEMENTATION.md" -ForegroundColor White
Write-Host "  • Features Summary:    FEATURES_SUMMARY.md" -ForegroundColor White
Write-Host ""

Write-Host "Press any key to start the dev server..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')

Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Yellow
npm run dev
