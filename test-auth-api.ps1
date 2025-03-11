Write-Host "===== Testing UniMart Authentication API =====" -ForegroundColor Cyan
Write-Host

# Base URL
$BASE_URL = "http://localhost:8080/api"

# 1. Test Supported Universities Endpoint
Write-Host "1. Testing GET /api/auth/supported-universities" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/auth/supported-universities" -Method Get
$response | ConvertTo-Json -Depth 5
Write-Host

# 2. Test Email Validation Endpoint
Write-Host "2. Testing POST /api/auth/validate-email" -ForegroundColor Green
$body = @{
    email = "test@northeastern.edu"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$BASE_URL/auth/validate-email" -Method Post -Body $body -ContentType "application/json"
$response | ConvertTo-Json -Depth 5
Write-Host

# Save the verification code from the console output
Write-Host "3. Check the console output in your Spring Boot app for the verification code" -ForegroundColor Yellow
Write-Host "   Then use that code in the next request"
Write-Host
$CODE = Read-Host "Enter the verification code"

# 3. Test Verification Code Endpoint
Write-Host "4. Testing POST /api/auth/verify-code" -ForegroundColor Green
$body = @{
    email = "test@northeastern.edu"
    code = $CODE
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$BASE_URL/auth/verify-code" -Method Post -Body $body -ContentType "application/json"
$response | ConvertTo-Json -Depth 5
Write-Host

# 4. Test Unsupported University Endpoint
Write-Host "5. Testing GET /api/unsupported" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$BASE_URL/unsupported?email=user@unsupported.edu" -Method Get
$response | ConvertTo-Json -Depth 5
Write-Host

Write-Host "===== Testing Complete =====" -ForegroundColor Cyan 