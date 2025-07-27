#!/bin/bash

# Скрипт для налаштування середовища розробки

echo "Налаштування середовища розробки для Auth Service..."

# Створюємо .env файл для локальної розробки
echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/auth_db?schema=public"' > .env.local

# Створюємо .env файл для Docker
echo 'DATABASE_URL="postgresql://postgres:password@postgres:5432/auth_db?schema=public"' > .env

echo "✅ Файли конфігурації створені!"
echo "📝 .env - для Docker"
echo "📝 .env.local - для локальної розробки" 