#!/bin/bash

echo "🔍 Starting Prisma Studio for Assignment Database..."

# Check if assignment-service container is running
if ! docker ps | grep -q "assignment-service-dev"; then
    echo "❌ Assignment service container is not running. Please start the development environment first:"
    echo "   ./scripts/dev-docker.sh"
    exit 1
fi

# Check if assignment database is accessible
if ! docker exec postgres-assignment-dev psql -U postgres -d assignment_db -c "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ Cannot connect to assignment database. Please check if the database is running."
    exit 1
fi

echo "✅ Assignment database is accessible"
echo "🌐 Starting Prisma Studio for assignment-service..."
echo "📊 Database: assignment_db (localhost:5434)"
echo "🔗 Prisma Studio will be available at: http://localhost:5556"
echo ""
echo "💡 To stop Prisma Studio, press Ctrl+C"

# Run Prisma Studio in the assignment-service container
docker exec -it assignment-service-dev npx prisma studio --hostname 0.0.0.0 --port 5556 