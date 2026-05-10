# Quick start script for Windows PowerShell
Write-Host "================================" -ForegroundColor Cyan
Write-Host "DevPilot Development Environment" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if Docker is running
try {
    docker info > $null 2>&1
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Starting PostgreSQL and Redis..." -ForegroundColor Yellow
docker-compose up -d postgres redis

Write-Host "Waiting for PostgreSQL..." -ForegroundColor Yellow
$ready = $false
for ($i=0; $i -lt 30; $i++) {
    try {
        docker-compose exec -T postgres pg_isready -U postgres > $null 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ PostgreSQL is ready" -ForegroundColor Green
            $ready = $true
            break
        }
    } catch {}
    Write-Host -NoNewline "."
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host "Running database migrations..." -ForegroundColor Yellow
docker-compose exec -T platform npm run db:migrate 2>$null || Write-Host "⚠️  Migrations skipped (may run on first start)" -ForegroundColor Yellow

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Environment ready!" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services running:" -ForegroundColor White
Write-Host "  Frontend:    http://localhost:3000" -ForegroundColor Gray
Write-Host "  Platform:    http://localhost:3001/api/v1" -ForegroundColor Gray
Write-Host "  AI Backend:  http://localhost:8000/api/v1" -ForegroundColor Gray
Write-Host "  AI Docs:     http://localhost:8000/docs" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Create a tenant: POST http://localhost:3001/api/v1/tenants" -ForegroundColor Gray
Write-Host "2. Create a user: POST http://localhost:3001/api/v1/auth/register" -ForegroundColor Gray
Write-Host "3. Login: POST http://localhost:3001/api/v1/auth/login" -ForegroundColor Gray
Write-Host ""
