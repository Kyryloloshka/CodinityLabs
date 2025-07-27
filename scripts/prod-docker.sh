#!/bin/bash

echo "🚀 Starting all services in Docker production mode..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env files exist
if [ ! -f "apps/auth-service/.env" ] || [ ! -f "apps/assignment-service/.env" ] || [ ! -f "apps/api-gateway/.env" ]; then
    echo "❌ Please create .env files for all services before running in production mode."
    echo "   You can copy from .env.example files or create them manually."
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose down

# Build and start services
echo "🔨 Building and starting services..."
docker compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Show service status
echo "📊 Service status:"
docker compose ps

echo "✅ All services are running in production mode!"
echo ""
echo "🌐 Services available at:"
echo "  - API Gateway: http://localhost:3000"
echo "  - Auth Service: http://localhost:8100"
echo "  - Assignment Service: http://localhost:3002"
echo "  - PostgreSQL: localhost:5432"
echo ""
echo "📝 To view logs: docker compose logs -f"
echo "🛑 To stop: docker compose down" 