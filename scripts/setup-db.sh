#!/bin/bash

echo "🗄️ Setting up database and migrations..."

# Function to run migrations for a service
run_migrations() {
    local service_name=$1
    local service_path=$2
    
    echo "📝 Running migrations for $service_name..."
    cd "$service_path"
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        echo "⚠️  No .env file found for $service_name. Skipping migrations."
        return
    fi
    
    # Generate Prisma client
    echo "🔧 Generating Prisma client for $service_name..."
    pnpm db:generate
    
    # Run migrations
    echo "🔄 Running migrations for $service_name..."
    pnpm db:migrate
    
    cd - > /dev/null
}

# Run migrations for auth-service
run_migrations "auth-service" "apps/auth-service"

# Run migrations for assignment-service
run_migrations "assignment-service" "apps/assignment-service"

echo "✅ Database setup completed!"
echo ""
echo "📊 You can now:"
echo "  - Start services with: ./scripts/dev-docker.sh"
echo "  - Or run locally with: ./scripts/dev-assignment.sh"
echo "  - View database with: pnpm db:studio (in assignment-service directory)" 