# KPI Course Work - Assignment Management System

Система управління завданнями для студентів, схожа на LeetCode/CodeWars.

## 🏗️ Архітектура

Система складається з наступних мікросервісів:

- **API Gateway** (порт 3000) - головний API endpoint
- **Auth Service** (порт 8100) - аутентифікація та авторизація
- **Assignment Service** (порт 3002) - управління завданнями та поданнями
- **PostgreSQL** (порт 5432) - база даних

## 🚀 Швидкий старт

### Варіант 1: Docker (рекомендовано)

#### Розробка
```bash
# Запуск всіх сервісів в режимі розробки
./scripts/dev-docker.sh
```

#### Продакшен
```bash
# Налаштування .env файлів
cp apps/auth-service/.env.example apps/auth-service/.env
cp apps/assignment-service/.env.example apps/assignment-service/.env
cp apps/api-gateway/.env.example apps/api-gateway/.env

# Запуск в продакшен режимі
./scripts/prod-docker.sh
```

### Варіант 2: Локальний запуск

#### Налаштування бази даних
```bash
# Запуск PostgreSQL в Docker
docker run -d \
  --name postgres-dev \
  -e POSTGRES_DB=kpi_dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine

# Налаштування міграцій
./scripts/setup-db.sh
```

#### Запуск сервісів
```bash
# Auth Service
cd apps/auth-service
pnpm install
pnpm start:dev

# Assignment Service (в новому терміналі)
cd apps/assignment-service
pnpm install
pnpm start:dev

# API Gateway (в новому терміналі)
cd apps/api-gateway
pnpm install
pnpm start:dev
```

## 📋 Доступні скрипти

- `./scripts/dev-docker.sh` - запуск всіх сервісів в Docker (розробка)
- `./scripts/prod-docker.sh` - запуск всіх сервісів в Docker (продакшен)
- `./scripts/setup-db.sh` - налаштування бази даних та міграцій
- `./scripts/dev-assignment.sh` - запуск assignment-service локально

## 🌐 API Endpoints

### API Gateway (http://localhost:3000) - Основна точка входу
- `GET /assignments` - список завдань
- `GET /assignments/:id` - отримання завдання
- `POST /assignments` - створення завдання
- `PATCH /assignments/:id` - оновлення завдання
- `DELETE /assignments/:id` - видалення завдання
- `GET /submissions` - список подань
- `GET /submissions/:id` - отримання подання
- `GET /submissions/user/:userId` - подання користувача
- `GET /submissions/assignment/:assignmentId` - подання для завдання
- `POST /submissions` - подання рішення
- `DELETE /submissions/:id` - видалення подання
- `GET /users` - список користувачів
- `GET /users/:id` - отримання користувача
- `PATCH /users/:id` - оновлення користувача
- `DELETE /users/:id` - видалення користувача
- `POST /users/login` - вхід в систему
- `POST /users/register` - реєстрація
- `POST /users/verify` - перевірка токена
- `GET /health` - перевірка стану
- `GET /api` - Swagger документація

### Прямий доступ до сервісів

#### Auth Service (http://localhost:8100)
- `GET /users` - список користувачів
- `GET /users/:id` - отримання користувача
- `PATCH /users/:id` - оновлення користувача
- `DELETE /users/:id` - видалення користувача
- `POST /users/login` - вхід в систему
- `POST /users/register` - реєстрація
- `POST /users/verify` - перевірка токена
- `GET /health` - перевірка стану

#### Assignment Service (http://localhost:3002)
- `GET /assignments` - список завдань
- `GET /assignments/:id` - отримання завдання
- `POST /assignments` - створення завдання
- `PATCH /assignments/:id` - оновлення завдання
- `DELETE /assignments/:id` - видалення завдання
- `GET /submissions` - список подань
- `GET /submissions/:id` - отримання подання
- `GET /submissions/user/:userId` - подання користувача
- `GET /submissions/assignment/:assignmentId` - подання для завдання
- `POST /submissions` - подання рішення
- `DELETE /submissions/:id` - видалення подання
- `GET /health` - перевірка стану

## 🗄️ База даних

### Схема
- **users** - користувачі системи
- **assignments** - завдання
- **test_cases** - тестові випадки
- **submissions** - подання рішень

### Міграції
```bash
# Для auth-service
cd apps/auth-service
pnpm db:migrate

# Для assignment-service
cd apps/assignment-service
pnpm db:migrate
```

## 🛠️ Розробка

### Структура проекту
```
├── apps/
│   ├── api-gateway/          # API Gateway
│   ├── auth-service/         # Сервіс аутентифікації
│   └── assignment-service/   # Сервіс завдань
├── scripts/                  # Скрипти для запуску
├── docker-compose.yml        # Docker Compose (продакшен)
└── docker-compose.dev.yml    # Docker Compose (розробка)
```

### Технології
- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL, Prisma
- **Containerization**: Docker, Docker Compose
- **Package Manager**: pnpm

### Команди розробки
```bash
# Встановлення залежностей
pnpm install

# Збірка проекту
pnpm build

# Запуск тестів
pnpm test

# Лінтінг
pnpm lint

# Форматування коду
pnpm format
```

## 📝 Приклади використання

### Створення завдання
```bash
curl -X POST http://localhost:3002/assignments \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Факторіал",
    "description": "Обчисліть факторіал числа",
    "difficulty": 3,
    "deadline": "2024-12-31T23:59:59.000Z",
    "testCases": [
      {
        "input": "5",
        "expected": "120",
        "description": "Факторіал 5"
      }
    ]
  }'
```

### Подання рішення
```bash
curl -X POST http://localhost:3002/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "assignmentId": "assignment-id",
    "code": "function factorial(n) { return n <= 1 ? 1 : n * factorial(n-1); }"
  }'
```

## 🔧 Налаштування

### Змінні середовища

#### Auth Service (.env)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/kpi_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=8100
NODE_ENV=development
```

#### Assignment Service (.env)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/kpi_db"
PORT=3002
NODE_ENV=development
```

#### API Gateway (.env)
```env
AUTH_SERVICE_URL=http://localhost:8100
ASSIGNMENT_SERVICE_URL=http://localhost:3002
PORT=3000
NODE_ENV=development
```

## 🐛 Troubleshooting

### Проблеми з Docker
```bash
# Очищення контейнерів
docker-compose down -v

# Перебудова образів
docker-compose build --no-cache

# Перегляд логів
docker-compose logs -f
```

### Проблеми з базою даних
```bash
# Скидання бази даних
docker-compose down -v
docker volume rm kpi-course-work_postgres_data

# Перезапуск з чистою базою
./scripts/dev-docker.sh
```

## 📄 Ліцензія

MIT License 