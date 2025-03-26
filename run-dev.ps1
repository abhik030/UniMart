# PowerShell script to run UniMart in development mode with hot reloading

Write-Host "Starting UniMart in development mode with hot reloading..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "Docker is running." -ForegroundColor Green
}
catch {
    Write-Host "Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if docker-compose.hot-reload.yml exists
if (-not (Test-Path "docker-compose.hot-reload.yml")) {
    Write-Host "docker-compose.hot-reload.yml not found in the current directory." -ForegroundColor Red
    exit 1
}

# Stop any running containers
Write-Host "Stopping any running containers..." -ForegroundColor Yellow
docker compose down

# Start the application with the hot-reload configuration
Write-Host "Starting the application with hot reloading..." -ForegroundColor Yellow
docker compose -f docker-compose.hot-reload.yml up -d

# Show running containers
Write-Host "Running containers:" -ForegroundColor Green
docker compose -f docker-compose.hot-reload.yml ps

Write-Host "UniMart is now running in development mode!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:8081/api" -ForegroundColor Cyan
Write-Host "To view logs, run: docker compose -f docker-compose.hot-reload.yml logs -f" -ForegroundColor Yellow
Write-Host "To stop, run: docker compose -f docker-compose.hot-reload.yml down" -ForegroundColor Yellow 