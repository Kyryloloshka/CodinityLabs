#!/bin/bash

echo "🚀 Starting Assignment Service in development mode..."

# Navigate to the assignment service directory
cd apps/assignment-service

# Check if .env file exists, if not create from example
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm db:generate

# Start the development server
echo "🔥 Starting development server..."
pnpm start:dev 