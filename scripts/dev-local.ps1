# Local Development Setup (Without Docker)

## Prerequisites

1. **PostgreSQL 15+** installed and running
   - Download from https://postgresql.org/download/windows
   - Or use: `winget install PostgreSQL.PostgreSQL`

2. **Redis 7+** installed and running
   - Download from https://redis.io/download
   - Or use: `winget install Redis.Redis`

3. **Python 3.11+** for FastAPI
   - Verify: `python --version`

4. **Node.js 20+** and **pnpm** (already installed ✓)

---

## Step 1: Start PostgreSQL & Redis

### Option A: Using Windows Services (if installed)
- PostgreSQL should start automatically as a service
- Redis should start automatically as a service

### Option B: Manual start
```powershell
# Start PostgreSQL
net start postgresql-x64-15  # or your version

# Start Redis
net start Redis
```

### Verify they're running:
```powershell
# Test PostgreSQL
psql -U postgres -h localhost -p 5432 -c "SELECT version();"

# Test Redis
redis-cli ping
```

---

## Step 2: Create Database

```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE devpilot;
\q
```

---

## Step 3: Run Database Migrations

```powershell
cd apps/platform
npx pnpm run db:migrate
```

This will create all tables using the SQL migration files.

---

## Step 4: Start Services in Separate Terminals

### Terminal 1: Platform Backend (NestJS)
```powershell
cd apps/platform
npx pnpm run start:dev
```
Server runs at http://localhost:3001/api/v1

### Terminal 2: AI Backend (FastAPI)
```powershell
cd apps/ai
python -m uvicorn app.main:app --reload --port 8000
```
Server runs at http://localhost:8000/api/v1
API Docs at http://localhost:8000/docs

### Terminal 3: Frontend (Next.js)
```powershell
cd apps/web
npx pnpm run dev
```
Frontend runs at http://localhost:3000

---

## Step 5: Verify Everything Works

1. **Check Platform API**:
   ```powershell
   curl http://localhost:3001/api/v1/health
   ```
   Should return: `{"status":"healthy","service":"platform"}`

2. **Check AI API**:
   ```powershell
   curl http://localhost:8000/api/v1/health
   ```
   Should return: `{"status":"healthy","service":"ai-backend"}`

3. **Check Frontend**:
   Open http://localhost:3000 in browser

4. **Create First Tenant**:
   ```powershell
   curl -X POST http://localhost:3001/api/v1/tenants \
     -H "Content-Type: application/json" \
     -d '{"name":"Acme Corp","slug":"acme","plan":"pro"}'
   ```

5. **Register First User**:
   ```powershell
   curl -X POST http://localhost:3001/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@acme.com","password":"securePass123","name":"Admin User"}'
   ```

6. **Login**:
   ```powershell
   curl -X POST http://localhost:3001/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@acme.com","password":"securePass123"}'
   ```

---

## Quick Start Script

I'll create a PowerShell script to start all three services:
