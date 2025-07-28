# KPI Course Work - Assignment Management System

Система управління завданнями для студентів, схожа на LeetCode/CodeWars.

## 🏗️ Архітектура

Система складається з наступних мікросервісів:

- **Frontend Client** (порт 4200) - Nuxt.js веб-додаток
- **API Gateway** (порт 3000) - головний API endpoint
- **Auth Service** (порт 8100) - аутентифікація та авторизація
- **Assignment Service** (порт 8200) - управління завданнями та поданнями
- **Auth Database** (порт 5433) - PostgreSQL для auth-service
- **Assignment Database** (порт 5434) - PostgreSQL для assignment-service

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

#### Налаштування баз даних
```bash
# Запуск всіх сервісів з окремими базами даних
./scripts/dev-docker.sh

# Скидання всіх баз даних та міграцій
./scripts/reset-databases.sh

# Ініціалізація міграцій
./scripts/init-migrations.sh
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

## 📋 Доступні команди

### 🚀 PNPM команди (рекомендовано)
```bash
# Розробка
pnpm dev:start          # Запуск всіх сервісів в Docker
pnpm dev:restart        # Перезапуск всіх сервісів
pnpm db:status          # Перевірка стану всіх сервісів
pnpm db:reset           # Скидання всіх баз даних
pnpm db:init            # Ініціалізація міграцій

# Prisma Studio
pnpm studio:all         # Запуск Prisma Studio для обох баз
pnpm studio:auth        # Тільки Auth Database Studio
pnpm studio:assignment  # Тільки Assignment Database Studio
pnpm studio:stop        # Зупинка всіх Prisma Studio

# Prisma команди
pnpm prisma:generate    # Генерація Prisma Client для всіх сервісів
pnpm prisma:migrate:auth # Міграція для auth-service
pnpm prisma:migrate:assignment # Міграція для assignment-service
```

### 📜 Прямі скрипти
- `./scripts/dev-docker.sh` - запуск всіх сервісів в Docker (розробка)
- `./scripts/prod-docker.sh` - запуск всіх сервісів в Docker (продакшен)
- `./scripts/dev-client.sh` - запуск тільки фронтенду в Docker (розробка)
- `./scripts/reset-databases.sh` - скидання всіх баз даних та міграцій
- `./scripts/init-migrations.sh` - ініціалізація міграцій для обох сервісів
- `./scripts/check-status.sh` - перевірка стану всіх сервісів
- `./scripts/dev-assignment.sh` - запуск assignment-service локально

### 🗄️ Prisma Studio (Управління базами даних)

- `./scripts/prisma-studio-all.sh` - запуск Prisma Studio для обох баз даних
- `./scripts/prisma-studio-auth.sh` - запуск Prisma Studio для auth бази даних
- `./scripts/prisma-studio-assignment.sh` - запуск Prisma Studio для assignment бази даних
- `./scripts/stop-prisma-studio.sh` - зупинка всіх Prisma Studio процесів

📖 **Повний довідник**: [PNPM_COMMANDS.md](./PNPM_COMMANDS.md)

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

#### Assignment Service (http://localhost:8200)
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

## 🗄️ Бази даних

### Auth Database (порт 5433)
- **users** - користувачі системи

### Assignment Database (порт 5434)
- **assignments** - завдання
- **test_cases** - тестові випадки
- **submissions** - подання рішень

### Міграції
```bash
# Автоматична ініціалізація міграцій
./scripts/init-migrations.sh

# Ручна ініціалізація для auth-service
docker exec auth-service-dev npx prisma migrate dev --name init_auth_schema

# Ручна ініціалізація для assignment-service
docker exec assignment-service-dev npx prisma migrate dev --name init_assignment_schema
```

### 🗄️ Prisma Studio (Візуальне управління БД)

Prisma Studio надає веб-інтерфейс для управління базами даних:

```bash
# Запуск Prisma Studio для обох баз даних
./scripts/prisma-studio-all.sh

# Запуск тільки для auth бази даних
./scripts/prisma-studio-auth.sh

# Запуск тільки для assignment бази даних
./scripts/prisma-studio-assignment.sh

# Зупинка всіх Prisma Studio процесів
./scripts/stop-prisma-studio.sh
```

**Доступні URL:**
- **Auth Database Studio**: http://localhost:5555
- **Assignment Database Studio**: http://localhost:5556

**Можливості Prisma Studio:**
- 📊 Перегляд всіх таблиць та даних
- ✏️ Редагування записів
- ➕ Додавання нових записів
- 🗑️ Видалення записів
- 🔍 Фільтрація та пошук
- 📈 Статистика таблиць

## 🛠️ Розробка

### Структура проекту
```
├── apps/
│   ├── client/               # Frontend додаток (Nuxt.js)
│   ├── api-gateway/          # API Gateway
│   ├── auth-service/         # Сервіс аутентифікації
│   └── assignment-service/   # Сервіс завдань
├── scripts/                  # Скрипти для запуску
├── docker-compose.yml        # Docker Compose (продакшен)
└── docker-compose.dev.yml    # Docker Compose (розробка)
```

### Технології
- **Frontend**: Nuxt.js, Vue 3, TypeScript
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
curl -X POST http://localhost:8200/assignments \
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
curl -X POST http://localhost:8200/submissions \
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
DATABASE_URL="postgresql://postgres:postgres@postgres-auth:5432/auth_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=8100
NODE_ENV=development
```

#### Assignment Service (.env)
```env
DATABASE_URL="postgresql://postgres:postgres@postgres-assignment:5432/assignment_db"
PORT=8200
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

### Проблеми з базами даних
```bash
# Скидання всіх баз даних
./scripts/reset-databases.sh

# Перезапуск з чистими базами
./scripts/dev-docker.sh

# Ініціалізація міграцій
./scripts/init-migrations.sh
```

## 📄 Ліцензія

MIT License 