# Test Backend Connection Script
# This script tests if the backend is accessible

Write-Host "🔍 Testing Backend Connection..." -ForegroundColor Cyan
Write-Host ""

$backendUrl = "https://legal-saas-backend-cshf.onrender.com"

# Test 1: Health Check
Write-Host "1️⃣ Testing Health Endpoint: $backendUrl/api/health" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/api/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend is UP! Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: API Root
Write-Host "2️⃣ Testing API Root: $backendUrl/api" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/api" -Method GET -TimeoutSec 10
    Write-Host "✅ API Root accessible! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  API Root test: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""

# Test 3: Login Endpoint
Write-Host "3️⃣ Testing Login Endpoint: $backendUrl/api/auth/login" -ForegroundColor Yellow
try {
    $body = @{
        email = "test@example.com"
        password = "test123"
    } | ConvertTo-Json

    $headers = @{
        "Content-Type" = "application/json"
    }

    $response = Invoke-WebRequest -Uri "$backendUrl/api/auth/login" -Method POST -Body $body -Headers $headers -TimeoutSec 10
    Write-Host "✅ Login endpoint accessible! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode.Value__ -eq 401 -or $_.Exception.Response.StatusCode.Value__ -eq 400) {
        Write-Host "✅ Login endpoint is working (returned auth error as expected)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Login endpoint test: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✨ Backend connection test completed!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Configuration:" -ForegroundColor Cyan
Write-Host "   Backend URL: $backendUrl" -ForegroundColor Gray
Write-Host "   API Base: $backendUrl/api" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 You can now deploy the frontend!" -ForegroundColor Green
