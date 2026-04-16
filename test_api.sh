#!/bin/bash

# API Test Script for GameTwoShape Backend
RENDER_URL="https://game2shape-backend-y0nk.onrender.com"

echo "Testing Deployment at: $RENDER_URL"
echo "-----------------------------------"

# 1. Test Health Endpoint
echo "[1/2] Testing Health Endpoint..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$RENDER_URL/v1/health"

# 2. Test API Docs (Swagger)
echo "[2/3] Testing API Documentation..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$RENDER_URL/api"

# 3. Test Sentry Trigger
echo "[3/3] Triggering Sentry Test Error..."
curl -s -o /dev/null -w "Status: %{http_code} (Expected 5xx)\n" "$RENDER_URL/v1/health/debug-sentry"

echo "-----------------------------------"
echo "Test complete."
