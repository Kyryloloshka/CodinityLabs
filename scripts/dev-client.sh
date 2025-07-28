#!/bin/bash

echo "🔄 Restarting client development environment..."

# Stop and remove existing client container
docker compose -f docker-compose.dev.yml stop client
docker compose -f docker-compose.dev.yml rm -f client

# Rebuild and start client
docker compose -f docker-compose.dev.yml up --build client -d

echo "✅ Client development environment restarted!"
echo "🌐 Frontend should be available at: http://localhost:4200"
echo "📝 Hot reload is enabled - changes to files will automatically reload the page" 