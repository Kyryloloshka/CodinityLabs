FROM node:18-alpine

# Встановлюємо необхідні пакети
RUN apk add --no-cache python3 make g++

# Створюємо користувача без прав root
RUN addgroup -g 1001 -S codeuser && \
    adduser -u 1001 -S codeuser -G codeuser

# Створюємо директорію для виконання коду
WORKDIR /app

# Копіюємо скрипт виконання
COPY run-code.js .

# Встановлюємо права
RUN chown -R codeuser:codeuser /app

# Переключаємося на користувача без прав root
USER codeuser

# Обмежуємо ресурси
ENV NODE_OPTIONS="--max-old-space-size=128"

# Таймаут за замовчуванням
ENV TIMEOUT=1000

# Команда за замовчуванням
CMD ["node", "run-code.js"] 