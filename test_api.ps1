# API Test Script for GameTwoShape Backend (PowerShell)
$RENDER_URL = "https://game2shape-backend-y0nk.onrender.com"

Write-Host "Testing Deployment at: $RENDER_URL" -ForegroundColor Cyan
Write-Host "-----------------------------------"

# 1. Test Health Endpoint
Write-Host "[1/2] Testing Health Endpoint..."
$resp1 = Invoke-WebRequest -Uri "$RENDER_URL/v1/health" -Method Get -ErrorAction SilentlyContinue
if ($resp1) {
    Write-Host "Status: $($resp1.StatusCode)" -ForegroundColor Green
} else {
    Write-Host "Status: Failed" -ForegroundColor Red
}

# 2. Test API Docs (Swagger)
Write-Host "[2/3] Testing API Documentation..."
$resp2 = Invoke-WebRequest -Uri "$RENDER_URL/api" -Method Get -ErrorAction SilentlyContinue
if ($resp2) {
    Write-Host "Status: $($resp2.StatusCode)" -ForegroundColor Green
} else {
    Write-Host "Status: Failed" -ForegroundColor Red
}

# 3. Test Sentry Trigger
Write-Host "[3/3] Triggering Sentry Test Error..."
$resp3 = Invoke-WebRequest -Uri "$RENDER_URL/v1/health/debug-sentry" -Method Get -ErrorAction SilentlyContinue
if ($resp3.StatusCode -ge 500 -or $resp3 -eq $null) {
    Write-Host "Status: Triggered (Check Sentry.io)" -ForegroundColor Yellow
} else {
    Write-Host "Status: Failed to trigger" -ForegroundColor Red
}

Write-Host "-----------------------------------"
Write-Host "Test complete."
