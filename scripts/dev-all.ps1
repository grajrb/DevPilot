#!/usr/bin/env powershell
# DevPilot Local Development Starter (No Docker)
# Starts PostgreSQL, Redis, Platform, AI, and Frontend

param(
    [switch]$SkipInfra,
    [switch]$SkipPlatform,
    [switch]$SkipAI,
    [switch]$SkipWeb
)

$ErrorActionPreference = "Stop"

function Write-Status($message, $color = "Cyan") {
    Write-Host "`n[$($message.PadRight(50))]" -ForegroundColor $color
}

function Test-Command($cmd) {
    try { $null = Get-Command $cmd -ErrorAction Stop; return $true } catch { return $false }
}

# Check prerequisites
Write-Status "Checking prerequisites..." "Yellow"

if (-not (Test-Command "psql")) {
    Write-Host "❌ PostgreSQL client (psql) not found. Install PostgreSQL first." -ForegroundColor Red
    exit 1
}
if (-not (Test-Command "redis-cli")) {
    Write-Host "❌ Redis CLI not found. Install Redis first." -ForegroundColor Red
    exit 1
}
if (-not (Test-Command "python")) {
    Write-Host "❌ Python not found. Install Python 3.11+ first." -ForegroundColor Red
    exit 1
}

# Check if services are running
Write-Status "Checking infrastructure services..." "Yellow"

$pgRunning = $false
try {
    $result = psql -U postgres -h localhost -p 5432 -c "SELECT 1" 2>$null
    if ($LASTEXITCODE -eq 0) { $pgRunning = $true }
} catch {}

$redisRunning = $false
try {
    $result = redis-cli ping 2>$null
    if ($result -eq "PONG") { $redisRunning = $true }
} catch {}

if (-not $pgRunning) {
    Write-Host "⚠️  PostgreSQL is not running. Starting..." -ForegroundColor Yellow
    # Try to start PostgreSQL service
    try {
        Start-Service -Name postgresql-x64-15 -ErrorAction Stop
        Start-Sleep -Seconds 3
        Write-Host "✅ PostgreSQL started" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to start PostgreSQL. Please start it manually." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ PostgreSQL is running" -ForegroundColor Green
}

if (-not $redisRunning) {
    Write-Host "⚠️  Redis is not running. Starting..." -ForegroundColor Yellow
    try {
        Start-Service -Name Redis -ErrorAction Stop
        Start-Sleep -Seconds 2
        Write-Host "✅ Redis started" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to start Redis. Please start it manually." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Redis is running" -ForegroundColor Green
}

# Create database if it doesn't exist
Write-Status "Ensuring database exists..." "Yellow"
try {
    $dbCheck = psql -U postgres -t -c "SELECT 1 FROM pg_database WHERE datname='devpilot'" 2>$null
    if ($dbCheck -ne "1") {
        Write-Host "Creating devpilot database..." -ForegroundColor Yellow
        psql -U postgres -c "CREATE DATABASE devpilot" 2>$null | Out-Null
        Write-Host "✅ Database created" -ForegroundColor Green
    } else {
        Write-Host "✅ Database exists" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Could not create database (may already exist)" -ForegroundColor Yellow
}

# Run migrations
Write-Status "Running database migrations..." "Yellow"
Set-Location "$PSScriptRoot\..\apps\platform"
try {
    npx pnpm run db:migrate 2>&1 | Out-Null
    Write-Host "✅ Migrations applied" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Migration may have issues (check output)" -ForegroundColor Yellow
}

# Start services
if (-not $SkipPlatform) {
    Write-Status "Starting Platform Backend (NestJS)..." "Yellow"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $PSScriptRoot\..\apps\platform; npx pnpm run start:dev" -WindowStyle Normal
    Start-Sleep -Seconds 5
    Write-Host "✅ Platform backend started at http://localhost:3001/api/v1" -ForegroundColor Green
}

if (-not $SkipAI) {
    Write-Status "Starting AI Backend (FastAPI)..." "Yellow"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $PSScriptRoot\..\apps\ai; python -m uvicorn app.main:app --reload --port 8000" -WindowStyle Normal
    Start-Sleep -Seconds 5
    Write-Host "✅ AI backend started at http://localhost:8000/api/v1" -ForegroundColor Green
    Write-Host "✅ AI API Docs at http://localhost:8000/docs" -ForegroundColor Green
}

if (-not $SkipWeb) {
    Write-Status "Starting Frontend (Next.js)..." "Yellow"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $PSScriptRoot\..\apps\web; npx pnpm run dev" -WindowStyle Normal
    Start-Sleep -Seconds 5
    Write-Host "✅ Frontend started at http://localhost:3000" -ForegroundColor Green
}

Write-Host ""
Write-Status "All services are starting!" "Green"
Write-Host ""
Write-Host "Services:" -ForegroundColor White
Write-Host "  Platform API:  http://localhost:3001/api/v1" -ForegroundColor Gray
Write-Host "  AI API:        http://localhost:8000/api/v1" -ForegroundColor Gray
Write-Host "  AI Docs:       http://localhost:8000/docs" -ForegroundColor Gray
Write-Host "  Frontend:      http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Create tenant: POST http://localhost:3001/api/v1/tenants" -ForegroundColor Gray
Write-Host "2. Register user: POST http://localhost:3001/api/v1/auth/register" -ForegroundColor Gray
Write-Host "3. Login: POST http://localhost:3001/api/v1/auth/login" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow

# Keep script running
while ($true) {
    Start-Sleep -Seconds 1
}
