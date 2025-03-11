Write-Host "Checking for Node.js installation..." -ForegroundColor Cyan

try {
    $nodeVersion = node -v
    $npmVersion = npm -v
    
    Write-Host "Node.js is installed!" -ForegroundColor Green
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
    
    Write-Host "`nYou can now run the following commands to start the application:" -ForegroundColor Cyan
    Write-Host "cd frontend" -ForegroundColor Yellow
    Write-Host "npm install" -ForegroundColor Yellow
    Write-Host "npm start" -ForegroundColor Yellow
} catch {
    Write-Host "Node.js is not installed or not in your PATH." -ForegroundColor Red
    Write-Host "`nPlease install Node.js by following these steps:" -ForegroundColor Cyan
    
    Write-Host "1. Visit https://nodejs.org/en/download/" -ForegroundColor Yellow
    Write-Host "2. Download the Windows Installer (.msi) for your system (64-bit recommended)" -ForegroundColor Yellow
    Write-Host "3. Run the installer and follow the installation wizard" -ForegroundColor Yellow
    Write-Host "4. Restart your PowerShell or command prompt" -ForegroundColor Yellow
    Write-Host "5. Run this script again to verify the installation" -ForegroundColor Yellow
    
    Write-Host "`nAlternatively, if you have Chocolatey installed, you can run:" -ForegroundColor Cyan
    Write-Host "choco install nodejs-lts -y" -ForegroundColor Yellow
}

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 