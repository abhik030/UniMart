# Test script for the authentication flow
$API_BASE = "http://localhost:8081/api"
$email = "studentunimart@gmail.com"

# Step 1: Health check
Write-Host "Step 1: Testing health endpoint..." -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "$API_BASE/auth/health" -Method GET
$responseContent = $response.Content | ConvertFrom-Json
$status = $responseContent.status
Write-Host "Health check result: $status" -ForegroundColor Green

# Step 2: Email validation
Write-Host "`nStep 2: Testing email validation..." -ForegroundColor Yellow
$body = @{
    email = $email
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$API_BASE/auth/validate-email" -Method POST -ContentType "application/json" -Body $body
$emailResult = $response.Content | ConvertFrom-Json

Write-Host "Email validation successful for: $email" -ForegroundColor Green
Write-Host "  University: $($emailResult.universityName)" -ForegroundColor Green
Write-Host "  Marketplace: $($emailResult.marketplaceName)" -ForegroundColor Green
Write-Host "  Redirect URL: $($emailResult.marketplaceUrl)" -ForegroundColor Green

# Step 3: Verify code
Write-Host "`nStep 3: Testing code verification..." -ForegroundColor Yellow
$code = "123456" # Test code

$body = @{
    email = $email
    code = $code
    rememberMe = $true
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$API_BASE/auth/verify-code" -Method POST -ContentType "application/json" -Body $body
$verifyResult = $response.Content | ConvertFrom-Json

Write-Host "Code verification successful for: $email" -ForegroundColor Green
Write-Host "  Username: $($verifyResult.username)" -ForegroundColor Green
Write-Host "  Token: $($verifyResult.token)" -ForegroundColor Green

$trustedToken = $verifyResult.trustedDeviceToken
Write-Host "  Trusted Token: $trustedToken" -ForegroundColor Green

# Step 4: Verify trusted token
Write-Host "`nStep 4: Testing trusted token verification..." -ForegroundColor Yellow

$body = @{
    email = $email
    token = $trustedToken
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$API_BASE/auth/verify-trusted-token" -Method POST -ContentType "application/json" -Body $body
$tokenResult = $response.Content | ConvertFrom-Json

Write-Host "Trusted token verification successful for: $email" -ForegroundColor Green
Write-Host "  Username: $($tokenResult.username)" -ForegroundColor Green
Write-Host "  New Token: $($tokenResult.token)" -ForegroundColor Green
Write-Host "  Redirect URL: $($tokenResult.redirectUrl)" -ForegroundColor Green

Write-Host "`nAuthentication flow test completed successfully!" -ForegroundColor Yellow 