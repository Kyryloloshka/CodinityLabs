#!/bin/bash

# Database management script for development environment

set -e

AUTH_SERVICE_CONTAINER="auth-service-dev"
POSTGRES_CONTAINER="postgres-dev"

case "$1" in
    "migrate")
        echo "🔄 Running database migrations..."
        docker exec -it $AUTH_SERVICE_CONTAINER pnpm prisma:migrate
        ;;
    "generate")
        echo "🔧 Generating Prisma client..."
        docker exec -it $AUTH_SERVICE_CONTAINER pnpm prisma:generate
        ;;
    "studio")
        echo "🎨 Opening Prisma Studio..."
        echo "Prisma Studio will be available at: http://localhost:5555"
        cd apps/auth-service && DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kpi_auth_dev?schema=public" pnpm prisma studio
        ;;
    "reset")
        echo "⚠️  Resetting database (this will delete all data)..."
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker exec -it $POSTGRES_CONTAINER psql -U postgres -d kpi_auth_dev -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
            docker exec -it $AUTH_SERVICE_CONTAINER pnpm prisma:migrate
            echo "✅ Database reset complete"
        else
            echo "❌ Database reset cancelled"
        fi
        ;;
    "logs")
        echo "📋 Showing database logs..."
        docker logs $POSTGRES_CONTAINER
        ;;
    "connect")
        echo "🔌 Connecting to PostgreSQL..."
        docker exec -it $POSTGRES_CONTAINER psql -U postgres -d kpi_auth_dev
        ;;
    "stop-studio")
        echo "🛑 Stopping Prisma Studio..."
        pkill -f "prisma studio" || echo "No Prisma Studio process found"
        ;;
    *)
        echo "Usage: $0 {migrate|generate|studio|reset|logs|connect|stop-studio}"
        echo ""
        echo "Commands:"
        echo "  migrate      - Run database migrations"
        echo "  generate     - Generate Prisma client"
        echo "  studio       - Open Prisma Studio"
        echo "  reset        - Reset database (delete all data)"
        echo "  logs         - Show database logs"
        echo "  connect      - Connect to PostgreSQL"
        echo "  stop-studio  - Stop Prisma Studio"
        exit 1
        ;;
esac 