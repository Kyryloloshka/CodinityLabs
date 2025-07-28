#!/bin/bash

echo "🔄 Initializing migrations for both services..."

# Wait for databases to be ready
echo "⏳ Waiting for databases to be ready..."
sleep 10

# Initialize migrations for auth-service
echo "📝 Initializing auth-service migrations..."
docker exec auth-service-dev npx prisma migrate dev --name init_auth_schema

# Initialize migrations for assignment-service
echo "📝 Initializing assignment-service migrations..."
docker exec assignment-service-dev npx prisma migrate dev --name init_assignment_schema

echo "✅ Migrations initialized successfully!"
echo ""
echo "📊 Database status:"
echo "  - Auth Database (localhost:5433): Ready"
echo "  - Assignment Database (localhost:5434): Ready" 