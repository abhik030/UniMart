# Test script for the email verification flow in PowerShell

# Base URL for API
$API_BASE = "http://localhost:8081/api"

Write-Host "Starting email verification flow test..." -ForegroundColor Yellow

# Test 1: Health check
Write-Host "`nTesting health endpoint..." -ForegroundColor Yellow

$response = Invoke-WebRequest -Uri "$API_BASE/auth/health" -Method GET
$status = ($response.Content | ConvertFrom-Json).status

if ($status -eq "UP") {
    Write-Host "✓ Health check passed: $status" -ForegroundColor Green
} else {
    Write-Host "✗ Health check failed: $status" -ForegroundColor Red
    exit 1
}

# Test 2: Email validation
Write-Host "`nTesting email validation..." -ForegroundColor Yellow
$email = "studentunimart@gmail.com"

$body = @{
    email = $email
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$API_BASE/auth/validate-email" -Method POST -ContentType "application/json" -Body $body
$emailResult = $response.Content | ConvertFrom-Json

Write-Host "✓ Email validation passed for $email" -ForegroundColor Green
Write-Host "  University: $($emailResult.universityName)" -ForegroundColor Green
Write-Host "  Marketplace: $($emailResult.marketplaceName)" -ForegroundColor Green
Write-Host "  Redirect URL: $($emailResult.marketplaceUrl)" -ForegroundColor Green

# Test 3: Verify code
Write-Host "`nTesting code verification..." -ForegroundColor Yellow
$code = "123456" # Test code

$body = @{
    email = $email
    code = $code
    rememberMe = $true
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$API_BASE/auth/verify-code" -Method POST -ContentType "application/json" -Body $body
$verifyResult = $response.Content | ConvertFrom-Json

Write-Host "✓ Code verification passed for $email" -ForegroundColor Green
Write-Host "  Username: $($verifyResult.username)" -ForegroundColor Green
Write-Host "  Token: $($verifyResult.token)" -ForegroundColor Green

# Extract the trusted device token for the next test
$trustedToken = $verifyResult.trustedDeviceToken

if ($trustedToken) {
    Write-Host "  Trusted Token: $trustedToken" -ForegroundColor Green
} else {
    Write-Host "✗ No trusted token received" -ForegroundColor Red
    exit 1
}

# Test 4: Verify trusted token
Write-Host "`nTesting trusted token verification..." -ForegroundColor Yellow

$body = @{
    email = $email
    token = $trustedToken
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$API_BASE/auth/verify-trusted-token" -Method POST -ContentType "application/json" -Body $body
$tokenResult = $response.Content | ConvertFrom-Json

Write-Host "✓ Trusted token verification passed for $email" -ForegroundColor Green
Write-Host "  Username: $($tokenResult.username)" -ForegroundColor Green
Write-Host "  New Token: $($tokenResult.token)" -ForegroundColor Green
Write-Host "  Redirect URL: $($tokenResult.redirectUrl)" -ForegroundColor Green

Write-Host "`nEmail verification flow test completed successfully!" -ForegroundColor Yellow 