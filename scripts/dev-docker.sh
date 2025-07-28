#!/bin/bash

echo "🐳 Starting all services in Docker development mode..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create .env files if they don't exist
echo "📝 Setting up environment files..."

# Auth service
if [ ! -f "apps/auth-service/.env" ]; then
    echo "Creating auth-service .env..."
    cat > apps/auth-service/.env << EOF
DATABASE_URL="postgresql://postgres:postgres@postgres-auth:5432/auth_db"
JWT_SECRET="your-super-secret-jwt-key-that-is-at-least-32-characters-long"
JWT_EXPIRES_IN="24h"
PORT=8100
NODE_ENV=development
EOF
fi

# Assignment service
if [ ! -f "apps/assignment-service/.env" ]; then
    echo "Creating assignment-service .env..."
    cat > apps/assignment-service/.env << EOF
DATABASE_URL="postgresql://postgres:postgres@postgres-assignment:5432/assignment_db"
PORT=8200
NODE_ENV=development
EOF
fi

# API Gateway
if [ ! -f "apps/api-gateway/.env" ]; then
    echo "Creating api-gateway .env..."
    cat > apps/api-gateway/.env << EOF
AUTH_SERVICE_URL=http://auth-service-dev:8100
ASSIGNMENT_SERVICE_URL=http://assignment-service-dev:8200
PORT=3000
NODE_ENV=development
EOF
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose -f docker-compose.dev.yml down

# Build and start services
echo "🔨 Building and starting services..."
docker compose -f docker-compose.dev.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Show service status
echo "📊 Service status:"
docker compose -f docker-compose.dev.yml ps

echo "✅ All services are running!"
echo ""
echo "🌐 Services available at:"
echo "  - Frontend Client: http://localhost:4200"
echo "  - API Gateway: http://localhost:3000"
echo "  - Auth Service: http://localhost:8100"
echo "  - Assignment Service: http://localhost:8200"
echo "  - Auth Database: localhost:5433"
echo "  - Assignment Database: localhost:5434"
echo ""
echo "📝 To view logs: docker compose -f docker-compose.dev.yml logs -f"
echo "🛑 To stop: docker compose -f docker-compose.dev.yml down" 