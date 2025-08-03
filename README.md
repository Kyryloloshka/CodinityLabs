# KPI Course Work - Мікросервісна архітектура

## Оновлена система авторизації

### Нова архітектура токенів

Система тепер використовує два типи токенів:

1. **Access Token** - короткоживучий токен (15 хвилин) для авторизації запитів
2. **Refresh Token** - довгоживучий токен (7 днів) для оновлення access токена

### Зберігання токенів

- **Access Token**: зберігається **тільки** в реактивній змінній (Pinia store) - **НЕ зберігається в localStorage**
- **Refresh Token**: зберігається в http-only cookie для безпеки
- **User Data**: зберігається в localStorage для відновлення сесії

### Автоматичне оновлення токенів

Система автоматично оновлює access токен при:
- Отриманні помилки 401
- Ініціалізації додатку (якщо є збережений користувач)
- Використовує refresh token з cookie

### Безпека

- Access token **НЕ зберігається** в localStorage (захист від XSS)
- Refresh token зберігається в http-only cookie (захист від XSS атак)
- Access token має короткий термін дії для мінімізації ризиків
- Автоматичне оновлення токенів без втручання користувача

## Структура проекту

```
kpi-course-work/
├── apps/
│   ├── api-gateway/          # API Gateway з авторизацією
│   ├── auth-service/         # Сервіс авторизації
│   ├── assignment-service/   # Сервіс завдань
│   ├── checker-service/      # Сервіс перевірки
│   └── client/              # Nuxt.js клієнт
├── docker-compose.yml        # Docker композиція
└── scripts/                 # Скрипти для розробки
```

## Запуск проекту

### Розробка

```bash
# Запуск всіх сервісів
./scripts/dev.sh

# Або окремо
./scripts/dev-docker.sh
./scripts/dev-db.sh
```

### Продакшн

```bash
./scripts/prod-docker.sh
```

## API Endpoints

### Авторизація

- `POST /users/login` - Вхід в систему
- `POST /users/register` - Реєстрація
- `POST /users/refresh` - Оновлення токена
- `GET /users/profile` - Профіль користувача

### Завдання

- `GET /assignments` - Список завдань
- `POST /assignments` - Створення завдання
- `GET /assignments/:id` - Деталі завдання
- `PUT /assignments/:id` - Оновлення завдання
- `DELETE /assignments/:id` - Видалення завдання

## Технології

- **Backend**: NestJS, Prisma, PostgreSQL
- **Frontend**: Nuxt 3, Vue 3, Pinia
- **Авторизація**: JWT з access/refresh токенами
- **Контейнеризація**: Docker, Docker Compose 