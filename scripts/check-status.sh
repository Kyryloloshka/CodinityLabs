#!/bin/bash

echo "🔍 Checking status of all services and databases..."

echo ""
echo "📊 Container Status:"
docker compose -f docker-compose.dev.yml ps

echo ""
echo "🗄️ Database Status:"

echo "Auth Database (localhost:5433):"
if docker exec postgres-auth-dev psql -U postgres -d auth_db -c "\dt" > /dev/null 2>&1; then
    echo "  ✅ Connected and ready"
    echo "  📋 Tables:"
    docker exec postgres-auth-dev psql -U postgres -d auth_db -c "\dt" | grep -v "List of relations" | grep -v "Schema" | grep -v "Owner" | grep -v "^$" | sed 's/|/ /g' | awk '{print "    - " $2}'
else
    echo "  ❌ Connection failed"
fi

echo ""
echo "Assignment Database (localhost:5434):"
if docker exec postgres-assignment-dev psql -U postgres -d assignment_db -c "\dt" > /dev/null 2>&1; then
    echo "  ✅ Connected and ready"
    echo "  📋 Tables:"
    docker exec postgres-assignment-dev psql -U postgres -d assignment_db -c "\dt" | grep -v "List of relations" | grep -v "Schema" | grep -v "Owner" | grep -v "^$" | sed 's/|/ /g' | awk '{print "    - " $2}'
else
    echo "  ❌ Connection failed"
fi

echo ""
echo "🌐 Service Health Checks:"

# Check API Gateway
echo "API Gateway (http://localhost:5000):"
if curl -s http://localhost:5000/health > /dev/null; then
    echo "  ✅ Healthy"
else
    echo "  ❌ Unhealthy"
fi

# Check Auth Service
echo "Auth Service (http://localhost:8100):"
if curl -s http://localhost:8100/health > /dev/null; then
    echo "  ✅ Healthy"
else
    echo "  ❌ Unhealthy"
fi

# Check Assignment Service
echo "Assignment Service (http://localhost:8200):"
if curl -s http://localhost:8200/health > /dev/null; then
    echo "  ✅ Healthy"
else
    echo "  ❌ Unhealthy"
fi

# Check Frontend
echo "Frontend Client (http://localhost:3000):"
if curl -s http://localhost:3000 > /dev/null; then
    echo "  ✅ Healthy"
else
    echo "  ❌ Unhealthy"
fi

echo ""
echo "🗄️ Prisma Studio Status:"

# Check Auth Prisma Studio
echo "Auth Prisma Studio (http://localhost:5555):"
if curl -s http://localhost:5555 > /dev/null; then
    echo "  ✅ Running"
else
    echo "  ❌ Not running"
fi

# Check Assignment Prisma Studio
echo "Assignment Prisma Studio (http://localhost:5556):"
if curl -s http://localhost:5556 > /dev/null; then
    echo "  ✅ Running"
else
    echo "  ❌ Not running"
fi

echo ""
echo "📝 Available endpoints:"
echo "  - Frontend: http://localhost:3000"
echo "  - API Gateway: http://localhost:5000"
echo "  - Auth Service: http://localhost:8100"
echo "  - Assignment Service: http://localhost:8200"
echo "  - Auth Database: localhost:5433"
echo "  - Assignment Database: localhost:5434"
echo "  - Auth Prisma Studio: http://localhost:5555"
echo "  - Assignment Prisma Studio: http://localhost:5556" 