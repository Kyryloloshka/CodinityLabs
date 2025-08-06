#!/bin/bash

echo "🔍 Starting Prisma Studio for Auth Database..."

if ! docker ps | grep -q "auth-service-dev"; then
    echo "❌ Auth service container is not running. Please start the development environment first:"
    echo "   ./scripts/dev-docker.sh"
    exit 1
fi

if ! docker exec postgres-auth-dev psql -U postgres -d auth_db -c "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ Cannot connect to auth database. Please check if the database is running."
    exit 1
fi

echo "✅ Auth database is accessible"
echo "🌐 Starting Prisma Studio for auth-service..."
echo "📊 Database: auth_db (localhost:5433)"
echo "🔗 Prisma Studio will be available at: http://localhost:5555"
echo ""
echo "💡 To stop Prisma Studio, press Ctrl+C"

docker exec -it auth-service-dev npx prisma studio --hostname 0.0.0.0 --port 5555 