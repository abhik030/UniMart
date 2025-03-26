# Simple test for the health endpoint
$API_BASE = "http://localhost:8081/api"

Write-Host "Testing health endpoint..." -ForegroundColor Yellow

$response = Invoke-WebRequest -Uri "$API_BASE/auth/health" -Method GET
$responseContent = $response.Content | ConvertFrom-Json
$status = $responseContent.status

Write-Host "Health check result: $status" -ForegroundColor Green 