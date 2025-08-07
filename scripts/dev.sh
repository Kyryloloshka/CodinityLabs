#!/bin/bash

set -e

echo "🚀 Starting development environment..."

if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

cleanup() {
    echo "🛑 Stopping development environment..."
    docker compose -f docker-compose.dev.yml down
}

trap cleanup EXIT

echo "📦 Building and starting services..."
docker compose -f docker-compose.dev.yml up --build

echo "✅ Development environment is ready!"
echo "🌐 Frontend Client: http://localhost:3000"
echo "📱 API Gateway: http://localhost:5000"
echo "🔐 Auth Service: http://localhost:8100"
echo "📝 Assignment Service: http://localhost:8200"
echo "🗄️  PostgreSQL: localhost:5432"
echo ""
echo "Press Ctrl+C to stop the environment" 