#!/bin/bash

echo "Налаштування середовища розробки..."

echo 'DATABASE_URL="postgresql://postgres:password@postgres:5432/auth_db?schema=public"' > apps/auth-service/.env
echo 'NODE_ENV=development' >> apps/auth-service/.env
echo 'PORT=8100' >> apps/auth-service/.env
echo 'JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-enough' >> apps/auth-service/.env
echo 'JWT_EXPIRES_IN=24h' >> apps/auth-service/.env

# Auth Service - для локальної розробки
echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/auth_db?schema=public"' > apps/auth-service/.env.local
echo 'NODE_ENV=development' >> apps/auth-service/.env.local
echo 'PORT=8100' >> apps/auth-service/.env.local
echo 'JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-enough' >> apps/auth-service/.env.local
echo 'JWT_EXPIRES_IN=24h' >> apps/auth-service/.env.local

echo 'NODE_ENV=development' > apps/api-gateway/.env
echo 'PORT=5000' >> apps/api-gateway/.env
echo 'AUTH_SERVICE_URL=http://auth-service:8100' >> apps/api-gateway/.env

# API Gateway - для локальної розробки
echo 'NODE_ENV=development' > apps/api-gateway/.env.local
echo 'PORT=5000' >> apps/api-gateway/.env.local
echo 'AUTH_SERVICE_URL=http://localhost:8100' >> apps/api-gateway/.env.local

echo "✅ Всі файли конфігурації створені!"
echo "📝 .env файли - для Docker"
echo "📝 .env.local файли - для локальної розробки" 