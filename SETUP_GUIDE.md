# 🚀 Инструкции по Установке и Запуску

## Требования

- **Node.js** 16.x или выше
- **npm** 8.x или выше
- **PostgreSQL** 13.x или выше
- **Redis** 6.x или выше (опционально, но рекомендуется)
- **Docker** (опционально, для контейнеризации)

---

## 📦 Установка Backend

### 1. Перейти в папку backend

```bash
cd backend
```

### 2. Установить зависимости

```bash
npm install
```

### 3. Настроить переменные окружения

```bash
# Скопировать шаблон
cp .env.example .env

# Отредактировать .env файл с вашими значениями
# Необходимо заполнить:
# - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
# - JWT_SECRET, JWT_REFRESH_SECRET
# - AWS S3 ключи (если используется S3)
```

### 4. Настроить базу данных PostgreSQL

```bash
# Создать новую БД
createdb imagehost_db

# Или через PostgreSQL shell
psql
CREATE DATABASE imagehost_db;
```

### 5. Запустить миграции (когда будут созданы)

```bash
npm run migrate:up
```

### 6. Запустить в режиме разработки

```bash
npm run dev
```

Сервер запустится на `http://localhost:5000`

---

## 🌐 Установка Frontend

### 1. Перейти в папку frontend

```bash
cd frontend
```

### 2. Установить зависимости

```bash
npm install
```

### 3. Настроить переменные окружения

```bash
# Скопировать шаблон
cp .env.example .env

# Отредактировать .env файл
# REACT_APP_API_URL должен указывать на backend (http://localhost:5000/api)
```

### 4. Запустить в режиме разработки

```bash
npm start
```

Приложение откроется на `http://localhost:3000`

---

## 🐳 Docker Setup (Опционально)

### 1. Собрать образы

```bash
# В корне проекта
docker-compose build
```

### 2. Запустить контейнеры

```bash
docker-compose up -d
```

### 3. Проверить статус

```bash
docker-compose ps
```

### 4. Просмотр логов

```bash
# Все сервисы
docker-compose logs -f

# Только backend
docker-compose logs -f backend

# Только frontend
docker-compose logs -f frontend
```

### 5. Остановить контейнеры

```bash
docker-compose down
```

---

## 📋 Структура Проекта

```
project/three
├── backend/
│   ├── src/
│   │   ├── controllers/       # Обработчики запросов
│   │   ├── routes/            # API маршруты
│   │   ├── middleware/        # Middleware (auth, error handling)
│   │   ├── services/          # Бизнес-логика
│   │   ├── models/            # Модели данных
│   │   ├── config/            # Конфигурация
│   │   ├── utils/             # Утилиты
│   │   └── server.js          # Главный файл
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/        # React компоненты
│   │   ├── pages/             # Страницы
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Утилиты
│   │   ├── styles/            # CSS/SCSS
│   │   ├── context/           # Context API
│   │   ├── App.jsx            # Корневой компонент
│   │   └── index.js           # Точка входа
│   ├── public/
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── docs/
│   └── API_DOCUMENTATION.md   # API документация
│
├── ARCHITECTURE.md            # Архитектурный документ
├── docker-compose.yml         # Docker compose конфиг
└── README.md                  # Главный README
```

---

## ✅ Проверка Установки

### Backend

```bash
# Проверить, что сервер запущен
curl http://localhost:5000/health

# Ожидаемый ответ:
# {
#   "status": "OK",
#   "timestamp": "2025-11-29T10:00:00.000Z",
#   "uptime": 123.45
# }
```

### Frontend

Откройте `http://localhost:3000` в браузере - должна загрузиться главная страница.

---

## 🧪 Тестирование

### Backend

```bash
cd backend

# Запустить все тесты
npm test

# Запустить тесты в watch режиме
npm run test:watch

# Запустить с coverage
npm test -- --coverage
```

### Frontend

```bash
cd frontend

# Запустить тесты
npm test

# Запустить в watch режиме
npm test -- --watch
```

---

## 📝 Полезные Команды

### Backend

```bash
# Запуск в продакшене
npm start

# Запуск в режиме разработки с hot reload
npm run dev

# Линтинг кода
npm run lint

# Фиксирование ошибок линтинга
npm run lint:fix

# Миграция БД (когда будут созданы)
npm run migrate:up
npm run migrate:down
npm run seed
```

### Frontend

```bash
# Запуск в режиме разработки
npm start

# Сборка для продакшена
npm run build

# Запуск тестов
npm test

# Линтинг кода
npm run lint

# Фиксирование ошибок линтинга
npm run lint:fix
```

---

## 🔧 Настройка IDE (VS Code)

### Рекомендуемые расширения

1. **ESLint** - Линтинг JavaScript кода
2. **Prettier** - Форматирование кода
3. **Thunder Client** или **REST Client** - Тестирование API
4. **PostgreSQL** - Управление БД
5. **ES7+ React/Redux/React-Native snippets** - Snippets для React

### Настройка VS Code

`.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": ["javascript", "javascriptreact"]
}
```

---

## 🐛 Troubleshooting

### Ошибка: "Port 5000 already in use"

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Или используйте другой порт
PORT=5001 npm run dev
```

### Ошибка: "Cannot connect to database"

1. Проверьте, запущен ли PostgreSQL
2. Проверьте переменные DB_* в .env
3. Создайте базу данных: `createdb imagehost_db`

### Ошибка: "Redis connection refused"

1. Запустите Redis (если используется)
2. Проверьте REDIS_HOST и REDIS_PORT в .env
3. Или отключите Redis и используйте in-memory cache

### Frontend не подключается к API

1. Проверьте, запущен ли backend
2. Проверьте REACT_APP_API_URL в .env
3. Проверьте CORS конфигурацию в backend
4. Откройте DevTools (F12) → Console для ошибок

---

## 📚 Полезные Ресурсы

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Authentication](https://jwt.io/)
- [REST API Best Practices](https://restfulapi.net/)

---

**Версия:** 1.0  
**Дата обновления:** 2025-11-29
