#!/bin/bash

echo "🔍 Starting Prisma Studio for both databases..."

if ! docker ps | grep -q "auth-service-dev" || ! docker ps | grep -q "assignment-service-dev"; then
    echo "❌ Services are not running. Please start the development environment first:"
    echo "   ./scripts/dev-docker.sh"
    exit 1
fi

if ! docker exec postgres-auth-dev psql -U postgres -d auth_db -c "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ Cannot connect to auth database."
    exit 1
fi

if ! docker exec postgres-assignment-dev psql -U postgres -d assignment_db -c "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ Cannot connect to assignment database."
    exit 1
fi

echo "✅ Both databases are accessible"
echo ""
echo "🌐 Starting Prisma Studio instances..."
echo "📊 Auth Database Studio: http://localhost:5555"
echo "📊 Assignment Database Studio: http://localhost:5556"
echo ""
echo "💡 You can also run them separately:"
echo "   ./scripts/prisma-studio-auth.sh      # Auth database only"
echo "   ./scripts/prisma-studio-assignment.sh # Assignment database only"
echo ""

start_auth_studio() {
    echo "🚀 Starting Auth Database Studio..."
    docker exec -it auth-service-dev npx prisma studio --hostname 0.0.0.0 --port 5555
}

start_assignment_studio() {
    echo "🚀 Starting Assignment Database Studio..."
    docker exec -it assignment-service-dev npx prisma studio --hostname 0.0.0.0 --port 5556
}

if command -v gnome-terminal > /dev/null 2>&1; then
    echo "🖥️  Opening in separate terminals..."
    gnome-terminal -- bash -c "cd $(pwd) && ./scripts/prisma-studio-auth.sh; exec bash" &
    sleep 2
    gnome-terminal -- bash -c "cd $(pwd) && ./scripts/prisma-studio-assignment.sh; exec bash" &
elif command -v konsole > /dev/null 2>&1; then
    echo "🖥️  Opening in separate terminals..."
    konsole --new-tab -e bash -c "cd $(pwd) && ./scripts/prisma-studio-auth.sh; exec bash" &
    sleep 2
    konsole --new-tab -e bash -c "cd $(pwd) && ./scripts/prisma-studio-assignment.sh; exec bash" &
elif command -v xterm > /dev/null 2>&1; then
    echo "🖥️  Opening in separate terminals..."
    xterm -e "cd $(pwd) && ./scripts/prisma-studio-auth.sh; exec bash" &
    sleep 2
    xterm -e "cd $(pwd) && ./scripts/prisma-studio-assignment.sh; exec bash" &
else
    echo "⚠️  No supported terminal emulator found. Starting in background..."
    echo "📊 Auth Studio: http://localhost:5555"
    echo "📊 Assignment Studio: http://localhost:5556"
    echo ""
    echo "💡 To stop the studios, use:"
    echo "   docker exec auth-service-dev pkill -f 'prisma studio'"
    echo "   docker exec assignment-service-dev pkill -f 'prisma studio'"
    
    docker exec -d auth-service-dev npx prisma studio --hostname 0.0.0.0 --port 5555
    docker exec -d assignment-service-dev npx prisma studio --hostname 0.0.0.0 --port 5556
    
    echo "✅ Both Prisma Studio instances started in background"
    echo "🔗 Auth Studio: http://localhost:5555"
    echo "🔗 Assignment Studio: http://localhost:5556"
fi 