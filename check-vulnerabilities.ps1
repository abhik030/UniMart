# UniMart Vulnerability Checker Script
# This script helps check for vulnerabilities in dependencies

Write-Host "UniMart Vulnerability Checker" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green
Write-Host ""

# Check if npm is installed
try {
    $npmVersion = npm -v
    Write-Host "NPM version: $npmVersion" -ForegroundColor Blue
} catch {
    Write-Host "Error: NPM is not installed or not in PATH!" -ForegroundColor Red
    exit 1
}

# Check Node.js dependencies
if (Test-Path "frontend") {
    Write-Host ""
    Write-Host "Checking frontend dependencies for vulnerabilities..." -ForegroundColor Yellow
    Set-Location -Path "frontend"
    npm audit
    Set-Location -Path ".."
} else {
    Write-Host "Frontend directory not found." -ForegroundColor Red
}

# Check if Maven is installed
try {
    $mvnVersion = mvn -v | Select-String "Apache Maven"
    Write-Host ""
    Write-Host "Maven version: $mvnVersion" -ForegroundColor Blue
} catch {
    Write-Host ""
    Write-Host "Maven is not installed or not in PATH. Skipping Java dependency check." -ForegroundColor Yellow
}

# Check Java dependencies if Maven is available
if (Test-Path "backend" -and $mvnVersion) {
    Write-Host ""
    Write-Host "Checking backend dependencies..." -ForegroundColor Yellow
    Set-Location -Path "backend"
    mvn dependency:analyze
    Set-Location -Path ".."
}

Write-Host ""
Write-Host "Vulnerability check complete. Review the output for any security issues." -ForegroundColor Green
Write-Host "Recommended actions:" -ForegroundColor Yellow
Write-Host "1. Run 'npm audit fix' in the frontend directory to fix Node.js vulnerabilities" -ForegroundColor Yellow
Write-Host "2. Update vulnerable dependencies in pom.xml for Java vulnerabilities" -ForegroundColor Yellow 