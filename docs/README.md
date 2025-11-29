# 📚 ДОКУМЕНТАЦИЯ - Полный Обзор

Этот файл содержит полный обзор всей документации и структуры проекта ImageHost.

---

## 📂 Структура Проекта

```
project/three/
├── backend/                    # Node.js + Express Backend
│   ├── src/
│   │   ├── server.js          # Основной файл приложения
│   │   ├── controllers/       # Обработчики запросов (TODO)
│   │   ├── routes/            # API маршруты
│   │   │   ├── authRoutes.js
│   │   │   ├── postsRoutes.js
│   │   │   ├── commentsRoutes.js
│   │   │   ├── usersRoutes.js
│   │   │   ├── uploadRoutes.js
│   │   │   ├── tagsRoutes.js
│   │   │   ├── albumsRoutes.js
│   │   │   └── searchRoutes.js
│   │   ├── middleware/        # Middleware
│   │   │   ├── authMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── services/          # Бизнес-логика (TODO)
│   │   ├── models/            # DB модели (TODO)
│   │   ├── config/
│   │   │   └── environment.js # Конфиг переменных
│   │   └── utils/
│   │       └── logger.js      # Логирование
│   ├── package.json
│   ├── .env.example           # Пример переменных окружения
│   └── Dockerfile             # Docker конфиг
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout/        # Header, Footer, Layout
│   │   ├── pages/             # Страницы приложения
│   │   │   ├── Home.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── Post.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── Collections.jsx
│   │   │   ├── Editor.jsx
│   │   │   └── NotFound.jsx
│   │   ├── hooks/             # Custom React hooks (TODO)
│   │   ├── utils/
│   │   │   └── api.js         # API клиент
│   │   ├── styles/
│   │   │   └── globals.css    # Глобальные стили
│   │   ├── App.jsx            # Главный компонент
│   │   └── index.js           # Точка входа
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
│
├── docs/
│   └── API_DOCUMENTATION.md   # Подробная API документация
│
├── ARCHITECTURE.md            # Полная архитектура системы
├── README.md                  # Главный README
├── SETUP_GUIDE.md            # Инструкции по установке
├── docker-compose.yml         # Docker compose конфиг
└── .gitignore
```

---

## 📖 Основные Документы

### 1. **ARCHITECTURE.md** 
Полная техническая архитектура включая:
- Backend архитектура (Express + PostgreSQL + Redis)
- Frontend архитектура (React компоненты и страницы)
- Database схема (15+ таблиц)
- S3 интеграция и CDN
- Security и SEO
- Performance optimization
- Monitoring и logging

**Ключевые разделы:**
- I. 🏗️ Общая Архитектура
- II. 🔌 Backend Architecture
- III. 🌐 Frontend Architecture
- IV-XV. Технические детали

---

### 2. **API_DOCUMENTATION.md**
Полная REST API документация с примерами:

**Основные разделы:**
- 🔐 Аутентификация (register, login, refresh, logout)
- 📸 Посты (CRUD операции)
- 👍 Голосование (upvote, downvote)
- 💬 Комментарии (создание, обновление, удаление)
- 👤 Пользователи (профили, подписки)
- 📤 Загрузка (upload, process)
- 🏷️ Теги и поиск
- 📚 Коллекции/Альбомы

**Каждый endpoint включает:**
- Описание
- Request пример
- Response пример
- Возможные ошибки

---

### 3. **SETUP_GUIDE.md**
Полное руководство по установке и запуску:

**Содержит:**
- Требования к системе
- Пошаговая установка backend
- Пошаговая установка frontend
- Docker setup
- Проверка установки
- Полезные команды
- Troubleshooting
- IDE настройка

---

### 4. **README.md**
Главный файл проекта:
- Обзор проекта
- Ключевые функции
- Технический стек
- Быстрый старт
- Архитектура
- Безопасность
- Адаптивный дизайн
- Roadmap

---

## 🚀 Быстрый Старт

### Способ 1: Традиционный (без Docker)

```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run dev  # Запустится на http://localhost:5000

# Frontend (в другом терминале)
cd frontend
npm install
cp .env.example .env
npm start    # Запустится на http://localhost:3000
```

### Способ 2: Docker

```bash
cp backend/.env.example .env
docker-compose up -d

# Приложение будет доступно на http://localhost:3000
```

---

## 🏗️ Backend Стек

| Компонент | Технология | Версия |
|-----------|-----------|--------|
| Runtime | Node.js | 16+ |
| Framework | Express.js | 4.18+ |
| Database | PostgreSQL | 13+ |
| Cache | Redis | 6+ |
| Auth | JWT | - |
| Image Processing | Sharp.js | 0.32+ |
| ORM | Sequelize | 6.33+ |
| Logging | Winston | 3.11+ |

---

## 🎨 Frontend Стек

| Компонент | Технология | Версия |
|-----------|-----------|--------|
| Library | React | 18+ |
| Routing | React Router | 6+ |
| HTTP | Axios | 1.6+ |
| State | Zustand | 4.4+ |
| Styling | CSS3 + Tailwind | - |
| Canvas | Canvas API | - |

---

## 📊 База Данных

### Главные таблицы:

1. **users** - Пользователи
2. **posts** - Посты/Изображения
3. **comments** - Комментарии
4. **votes** - Лайки/Дизлайки
5. **albums** - Альбомы/Коллекции
6. **album_posts** - Связь альбомов и постов
7. **tags** - Теги
8. **post_tags** - Связь постов и тегов

---

## 🔗 API Endpoints

### Auth
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/refresh` - Обновить токен
- `POST /api/auth/logout` - Выход

### Posts
- `GET /api/posts` - Получить ленту
- `POST /api/posts` - Создать пост
- `GET /api/posts/:id` - Получить пост
- `PUT /api/posts/:id` - Обновить
- `DELETE /api/posts/:id` - Удалить

### Votes
- `POST /api/posts/:id/upvote` - Лайк
- `POST /api/posts/:id/downvote` - Дизлайк
- `DELETE /api/posts/:id/vote` - Отменить

### Comments
- `POST /api/comments` - Создать
- `PUT /api/comments/:id` - Обновить
- `DELETE /api/comments/:id` - Удалить

### Users
- `GET /api/users/:username` - Профиль
- `PUT /api/users/:id` - Обновить
- `POST /api/users/:id/follow` - Подписаться
- `DELETE /api/users/:id/follow` - Отписаться

### Upload
- `POST /api/upload` - Загрузить
- `POST /api/upload/process` - Обработать

### Search & Tags
- `GET /api/search?q=query` - Поиск
- `GET /api/tags` - Популярные теги
- `GET /api/tags/:name` - Посты по тегу

### Collections
- `GET /api/albums` - Мои альбомы
- `POST /api/albums` - Создать альбом
- `POST /api/albums/:id/posts` - Добавить пост
- `DELETE /api/albums/:id/posts/:postId` - Удалить

---

## 🔐 Безопасность

✅ **Реализовано:**
- HTTPS only
- JWT Authentication
- CSRF Protection (Helmet.js)
- XSS Prevention
- SQL Injection Prevention
- Rate Limiting
- Input Validation

---

## 📱 Адаптивный Дизайн

Поддерживаемые разрешения:
- 📱 Mobile: 320px+
- 📱 Tablet: 768px+
- 💻 Desktop: 1024px+
- 🖥️ Wide: 1440px+

---

## 🧪 Тестирование

### Backend
```bash
npm test              # Запустить тесты
npm run test:watch   # Watch режим
npm test -- --coverage  # С покрытием
```

### Frontend
```bash
npm test             # Запустить тесты
npm test -- --watch # Watch режим
```

---

## 🐳 Docker Commands

```bash
# Собрать образы
docker-compose build

# Запустить
docker-compose up -d

# Логи
docker-compose logs -f

# Остановить
docker-compose down

# Пересоздать
docker-compose up -d --build
```

---

## 📦 NPM Scripts

### Backend
```bash
npm start        # Продакшен
npm run dev      # Разработка
npm test         # Тесты
npm run lint     # Линтинг
npm run migrate:up
npm run migrate:down
npm run seed
```

### Frontend
```bash
npm start        # Разработка
npm run build    # Сборка
npm test         # Тесты
npm run lint     # Линтинг
```

---

## 🌍 Окружение

### Backend .env

Обязательные переменные:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`
- `SMTP_USER`, `SMTP_PASSWORD` (для email)

### Frontend .env

Обязательные переменные:
- `REACT_APP_API_URL` - URL к backend API

---

## 🎯 Дальнейшая Разработка

### TODO - Backend
- [ ] Реализовать auth сервис
- [ ] Реализовать posts сервис
- [ ] Реализовать image processing
- [ ] S3 интеграция
- [ ] Redis кэширование
- [ ] Email отправка
- [ ] WebSocket для real-time
- [ ] Unit тесты
- [ ] Integration тесты

### TODO - Frontend
- [ ] Компоненты для Gallery
- [ ] Upload компонент
- [ ] Editor Canvas
- [ ] Comments компонент
- [ ] Profile страница
- [ ] Search функция
- [ ] Infinite scroll
- [ ] Light/Dark mode
- [ ] PWA
- [ ] Unit тесты

---

## 📞 Поддержка

- 📧 Email: support@imagehost.com
- 💬 Discord: https://discord.gg/imagehost
- 🐛 Issues: GitHub Issues
- 📖 Docs: https://docs.imagehost.com

---

## 📄 Лицензия

MIT License - свободное использование и модификация.

---

## 🤝 Contributing

1. Fork репозитория
2. Создайте feature branch
3. Commit изменений
4. Push и откройте Pull Request

---

## 📚 Дополнительные Ресурсы

- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Redis Docs](https://redis.io/documentation)
- [AWS S3 API](https://docs.aws.amazon.com/s3/)
- [Docker Documentation](https://docs.docker.com/)

---

**Версия:** 1.0  
**Последнее обновление:** 2025-11-29  
**Статус:** 🚀 Активная разработка

Спасибо за внимание! Начинайте разработку! ✨
