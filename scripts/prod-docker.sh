#!/bin/bash

echo "🚀 Starting all services in Docker production mode..."

if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

if [ ! -f "apps/auth-service/.env" ] || [ ! -f "apps/assignment-service/.env" ] || [ ! -f "apps/api-gateway/.env" ]; then
    echo "❌ Please create .env files for all services before running in production mode."
    echo "   You can copy from .env.example files or create them manually."
    exit 1
fi

echo "🛑 Stopping existing containers..."
docker compose down

echo "🔨 Building and starting services..."
docker compose up --build -d

echo "⏳ Waiting for services to be ready..."
sleep 15

echo "📊 Service status:"
docker compose ps

echo "✅ All services are running in production mode!"
echo ""
echo "🌐 Services available at:"
echo "  - Frontend Client: http://localhost:3000"
echo "  - API Gateway: http://localhost:5000"
echo "  - Auth Service: http://localhost:8100"
echo "  - Assignment Service: http://localhost:8200"
echo "  - PostgreSQL: localhost:5432"
echo ""
echo "📝 To view logs: docker compose logs -f"
echo "🛑 To stop: docker compose down" 