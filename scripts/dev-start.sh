#!/bin/bash
# Quick start script for DevPilot development

echo "================================"
echo "DevPilot Development Environment"
echo "================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is running"

# Start infrastructure
echo ""
echo "Starting PostgreSQL and Redis..."
docker-compose up -d postgres redis

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
        echo "✅ PostgreSQL is ready"
        break
    fi
    echo -n "."
    sleep 1
done

# Run migrations
echo ""
echo "Running database migrations..."
docker-compose exec -T platform npm run db:migrate || true

echo ""
echo "================================"
echo "Environment ready!"
echo "================================"
echo ""
echo "Services running:"
echo "  Frontend:    http://localhost:3000"
echo "  Platform:    http://localhost:3001/api/v1"
echo "  AI Backend:  http://localhost:8000/api/v1"
echo "  AI Docs:     http://localhost:8000/docs"
echo ""
echo "Next steps:"
echo "1. Create a tenant: POST http://localhost:3001/api/v1/tenants"
echo "2. Create a user: POST http://localhost:3001/api/v1/auth/register"
echo "3. Login: POST http://localhost:3001/api/v1/auth/login"
echo ""
