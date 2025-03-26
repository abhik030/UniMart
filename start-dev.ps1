Write-Host "Starting UniMart development environment..." -ForegroundColor Green

# Go to config directory
cd config

# Stop any running containers
docker-compose down

# Start containers with the development configuration
docker-compose -f docker-compose.dev.yml up -d --build

Write-Host "Development environment started!" -ForegroundColor Green
Write-Host "Frontend is available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend is available at: http://localhost:8080" -ForegroundColor Cyan

# Return to the root directory
cd .. 