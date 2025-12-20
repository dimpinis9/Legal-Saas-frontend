# Fix Dependencies Script
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Installing Missing Dependencies" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Installing all dependencies..." -ForegroundColor Yellow

try {
    npm install
    Write-Host ""
    Write-Host "✓ Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to install dependencies!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try running manually:" -ForegroundColor Yellow
    Write-Host "  npm install" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Yellow
npm run dev
