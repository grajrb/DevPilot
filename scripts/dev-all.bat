@echo off
REM DevPilot Local Development Starter (Windows Batch)
REM Starts all services without Docker

echo ============================================
echo DevPilot Local Development
echo ============================================
echo.

REM Check prerequisites
where psql >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo X PostgreSQL not found. Install from https://postgresql.org/download/windows
    pause
    exit /b 1
)

where redis-cli >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo X Redis not found. Install from https://redis.io/download
    pause
    exit /b 1
)

where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo X Python not found. Install Python 3.11+
    pause
    exit /b 1
)

echo + Prerequisites check passed
echo.

REM Check if PostgreSQL is running
echo Checking PostgreSQL...
psql -U postgres -c "SELECT 1" >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ! PostgreSQL not running. Trying to start service...
    net start postgresql-x64-15 >nul 2>nul
    timeout /t 3 >nul
)
echo + PostgreSQL is running
echo.

REM Check if Redis is running
echo Checking Redis...
redis-cli ping | find "PONG" >nul
if %ERRORLEVEL% neq 0 (
    echo ! Redis not running. Trying to start service...
    net start Redis >nul 2>nul
    timeout /t 2 >nul
)
echo + Redis is running
echo.

REM Create database
echo Creating database...
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname='devpilot'" | find "1" >nul
if %ERRORLEVEL% neq 0 (
    psql -U postgres -c "CREATE DATABASE devpilot" >nul 2>nul
    echo + Database created
) else (
    echo + Database already exists
)
echo.

REM Run migrations
echo Running migrations...
cd apps\platform
call npx pnpm run db:migrate
cd ..\..
echo.

echo ============================================
echo Starting services in separate windows...
echo ============================================
echo.

REM Start Platform Backend
echo Starting Platform Backend...
start "DevPilot Platform" powershell -NoExit -Command "cd %cd%\apps\platform; npx pnpm run start:dev"
timeout /t 3 >nul

REM Start AI Backend
echo Starting AI Backend...
start "DevPilot AI" powershell -NoExit -Command "cd %cd%\apps\ai; python -m uvicorn app.main:app --reload --port 8000"
timeout /t 3 >nul

REM Start Frontend
echo Starting Frontend...
start "DevPilot Web" powershell -NoExit -Command "cd %cd%\apps\web; npx pnpm run dev"
timeout /t 3 >nul

echo.
echo ============================================
echo All services started!
echo ============================================
echo.
echo Services:
echo   Platform API:  http://localhost:3001/api/v1
echo   AI API:        http://localhost:8000/api/v1
echo   AI Docs:       http://localhost:8000/docs
echo   Frontend:      http://localhost:3000
echo.
echo Next steps:
echo   1. Create tenant: POST http://localhost:3001/api/v1/tenants
echo   2. Register user: POST http://localhost:3001/api/v1/auth/register
echo   3. Login: POST http://localhost:3001/api/v1/auth/login
echo.
pause
