#!/bin/bash

echo "🗑️ Resetting all databases and migrations..."

# Stop all containers
echo "🛑 Stopping all containers..."
docker compose -f docker-compose.dev.yml down

# Remove all database volumes
echo "🗑️ Removing database volumes..."
docker volume rm kpi-course-work_postgres_auth_data 2>/dev/null || true
docker volume rm kpi-course-work_postgres_assignment_data 2>/dev/null || true

# Remove old volumes if they exist
docker volume rm kpi-course-work_postgres_dev_data 2>/dev/null || true

# Remove all containers
echo "🗑️ Removing containers..."
docker rm -f postgres-auth-dev 2>/dev/null || true
docker rm -f postgres-assignment-dev 2>/dev/null || true
docker rm -f postgres-dev 2>/dev/null || true
docker rm -f auth-service-dev 2>/dev/null || true
docker rm -f assignment-service-dev 2>/dev/null || true
docker rm -f api-gateway-dev 2>/dev/null || true
docker rm -f client-dev 2>/dev/null || true

# Remove migration files
echo "🗑️ Removing migration files..."
rm -rf apps/auth-service/prisma/migrations/* 2>/dev/null || true
rm -rf apps/assignment-service/prisma/migrations/* 2>/dev/null || true

# Remove .env files to force recreation
echo "🗑️ Removing .env files..."
rm -f apps/auth-service/.env
rm -f apps/assignment-service/.env
rm -f apps/api-gateway/.env

echo "✅ All databases and migrations have been reset!"
echo ""
echo "🚀 To start fresh, run: ./scripts/dev-docker.sh" 