# UniMart Environment Setup Script
# This script helps set up your development environment securely

Write-Host "UniMart Development Environment Setup" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

# Check if .env exists, create from template if not
if (-not (Test-Path .env)) {
    if (Test-Path .env.example) {
        Write-Host "Creating .env file from .env.example template..." -ForegroundColor Yellow
        Copy-Item .env.example .env
        Write-Host "Created .env file. Please edit it with your actual credentials." -ForegroundColor Green
    } else {
        Write-Host "Error: .env.example file not found!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host ".env file already exists." -ForegroundColor Blue
}

# Prompt user to modify environment variables
Write-Host ""
Write-Host "Would you like to update your .env file now? (y/n)" -ForegroundColor Yellow
$updateEnv = Read-Host

if ($updateEnv -eq "y" -or $updateEnv -eq "Y") {
    Write-Host "Opening .env file for editing..." -ForegroundColor Yellow
    notepad .env
    Write-Host "Environment file updated." -ForegroundColor Green
}

# Check for git configuration
Write-Host ""
Write-Host "Checking git configuration..." -ForegroundColor Yellow

# Make sure .env is in .gitignore
$gitignoreContent = Get-Content .gitignore -ErrorAction SilentlyContinue
if ($gitignoreContent -notcontains ".env") {
    Write-Host "Adding .env to .gitignore file..." -ForegroundColor Yellow
    Add-Content .gitignore "`n# Environment variables`n.env"
    Write-Host "Added .env to .gitignore." -ForegroundColor Green
} else {
    Write-Host ".env is already in .gitignore." -ForegroundColor Blue
}

# Security reminder
Write-Host ""
Write-Host "Security Reminders:" -ForegroundColor Green
Write-Host "1. Never commit .env files containing actual credentials to git" -ForegroundColor Yellow
Write-Host "2. Use test API keys for development" -ForegroundColor Yellow
Write-Host "3. Regularly update dependencies to patch security vulnerabilities" -ForegroundColor Yellow
Write-Host "4. Check SECURITY.md for more security guidelines" -ForegroundColor Yellow

Write-Host ""
Write-Host "Environment setup complete. Ready for development!" -ForegroundColor Green 