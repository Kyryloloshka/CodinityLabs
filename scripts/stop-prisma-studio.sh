#!/bin/bash

echo "🛑 Stopping all Prisma Studio instances..."

# Stop Prisma Studio in auth-service container
echo "🛑 Stopping Auth Database Studio..."
if docker exec auth-service-dev pkill -f "prisma studio" 2>/dev/null; then
    echo "✅ Auth Database Studio stopped"
else
    echo "ℹ️  Auth Database Studio was not running"
fi

# Stop Prisma Studio in assignment-service container
echo "🛑 Stopping Assignment Database Studio..."
if docker exec assignment-service-dev pkill -f "prisma studio" 2>/dev/null; then
    echo "✅ Assignment Database Studio stopped"
else
    echo "ℹ️  Assignment Database Studio was not running"
fi

# Check if any Prisma Studio processes are still running
echo ""
echo "🔍 Checking for any remaining Prisma Studio processes..."

AUTH_PROCESSES=$(docker exec auth-service-dev ps aux | grep "prisma studio" | grep -v grep | wc -l)
ASSIGNMENT_PROCESSES=$(docker exec assignment-service-dev ps aux | grep "prisma studio" | grep -v grep | wc -l)

if [ "$AUTH_PROCESSES" -eq 0 ] && [ "$ASSIGNMENT_PROCESSES" -eq 0 ]; then
    echo "✅ All Prisma Studio instances have been stopped"
else
    echo "⚠️  Some Prisma Studio processes may still be running"
    echo "   Auth processes: $AUTH_PROCESSES"
    echo "   Assignment processes: $ASSIGNMENT_PROCESSES"
    echo ""
    echo "💡 To force stop all processes:"
    echo "   docker exec auth-service-dev pkill -9 -f 'prisma studio'"
    echo "   docker exec assignment-service-dev pkill -9 -f 'prisma studio'"
fi 