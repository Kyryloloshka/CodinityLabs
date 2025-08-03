# API Gateway

API Gateway для мікросервісної архітектури системи управління завданнями.

## Опис

API Gateway виступає як єдина точка входу для всіх клієнтських запитів. Він маршрутизує запити до відповідних мікросервісів та надає єдиний API для клієнтів.

## Інтегровані сервіси

### Auth Service
- **URL**: `http://auth-service:8100` (dev) / `http://auth-service:8100` (prod)
- **Функціональність**: Аутентифікація та авторизація користувачів
- **Ендпоінти**: `/users/*`, `/users/login`, `/users/register`, `/users/verify`

### Assignment Service
- **URL**: `http://assignment-service-dev:3002` (dev) / `http://assignment-service:3002` (prod)
- **Функціональність**: Управління завданнями та поданнями рішень
- **Ендпоінти**: `/assignments/*`, `/assignments/submissions/*`

## API Ендпоінти

### Завдання (Assignments)

#### Отримання завдань
- `GET /assignments` - Отримати всі завдання
- `GET /assignments/:id` - Отримати завдання за ID

#### Управління завданнями
- `POST /assignments` - Створити нове завдання
- `PATCH /assignments/:id` - Оновити завдання
- `DELETE /assignments/:id` - Видалити завдання

### Подання (Submissions)

#### Отримання подань
- `GET /submissions` - Отримати всі подання
- `GET /submissions/:id` - Отримати подання за ID
- `GET /submissions/user/:userId` - Отримати подання користувача
- `GET /submissions/assignment/:assignmentId` - Отримати подання для завдання

#### Управління поданнями
- `POST /submissions` - Створити нове подання
- `DELETE /submissions/:id` - Видалити подання

### Користувачі (Users)

#### Управління користувачами
- `GET /users` - Отримати всіх користувачів
- `GET /users/:id` - Отримати користувача за ID
- `PATCH /users/:id` - Оновити користувача
- `DELETE /users/:id` - Видалити користувача

#### Аутентифікація
- `POST /users/login` - Вхід в систему
- `POST /users/register` - Реєстрація
- `POST /users/verify` - Перевірка токена

### Системні
- `GET /health` - Перевірка стану сервісу
- `GET /api` - Swagger документація

## Структура проекту

```
src/
├── assignments/           # Модуль для роботи з завданнями
│   ├── dto/              # Data Transfer Objects
│   │   ├── assignment.dto.ts
│   │   └── submission.dto.ts
│   ├── assignments.controller.ts
│   ├── submissions.controller.ts
│   ├── assignments.service.ts
│   └── assignments.module.ts
├── auth/                 # Модуль для роботи з користувачами
│   ├── dto/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── common/               # Спільні компоненти
│   └── dto/
├── config/               # Конфігурація
├── app.module.ts         # Головний модуль
├── main.ts              # Точка входу
└── health.controller.ts  # Health check
```

## Налаштування

### Змінні середовища

```env
NODE_ENV=development|production
PORT=5000
AUTH_SERVICE_URL=http://auth-service:8100
ASSIGNMENT_SERVICE_URL=http://assignment-service:8200
```

### Валідація

API Gateway використовує `class-validator` для валідації вхідних даних. Всі DTO мають відповідні декоратори валідації.

## Запуск

### Розробка
```bash
npm run start:dev
```

### Продакшн
```bash
npm run start:prod
```

### Docker
```bash
# Development
docker compose -f docker-compose.dev.yml up api-gateway

# Production
docker compose up api-gateway
```

## Документація

Swagger документація доступна за адресою: `http://localhost:5000/api`

## Тестування

Приклади запитів знаходяться в файлі `examples/assignments-api-examples.http`

## Моніторинг

- Health check: `GET /health`
- Логи: Docker logs
- Метрики: Планується додати Prometheus метрики 