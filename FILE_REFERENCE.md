# 🗂️ Справочник файлов: Где что находится

## 🗄️ База данных

### Конфигурация
- **database.js** → `backend/src/config/database.js` (44 строк)
  - Sequelize инициализация
  - Connection pool настройки
  - Auto-authentication

### Модели (7 файлов)
```
backend/src/models/
├── User.js          - Пользователи (bcrypt хеширование)
├── Post.js          - Посты и галереи
├── Comment.js       - Комментарии
├── Tag.js           - Теги и категории
├── Album.js         - Коллекции фото
├── Vote.js          - Лайки и дизлайки
├── Follow.js        - Подписки (социальная сеть)
└── index.js         - ВСЕ АССОЦИАЦИИ ЗДЕСЬ (важно!)
```

### Миграции (7 файлов)
```
backend/src/migrations/
├── 001_create_users.js     - Users table
├── 002_create_posts.js     - Posts table
├── 003_create_comments.js  - Comments table
├── 004_create_tags.js      - Tags table
├── 005_create_albums.js    - Albums table
├── 006_create_votes.js     - Votes table (unique constraint)
└── 007_create_follows.js   - Follows table (check constraint)
```

---

## 🎛️ Бизнес логика

### Services (сервисы для операций с БД)
```
backend/src/services/
├── AuthService.js   - register, login, getUserProfile, etc.
├── (PostService)    - [TODO] CRUD для постов
├── (CommentService) - [TODO] CRUD для комментариев
├── (VoteService)    - [TODO] управление лайками
├── (FollowService)  - [TODO] управление подписками
└── (AlbumService)   - [TODO] управление альбомами
```

### Controllers (обработка HTTP запросов)
```
backend/src/controllers/
├── AuthController.js    - register, login, logout, refresh
├── (PostController)     - [TODO] HTTP endpoints для постов
├── (CommentController)  - [TODO] HTTP endpoints для комментариев
├── (VoteController)     - [TODO] HTTP endpoints для лайков
├── (FollowController)   - [TODO] HTTP endpoints для подписок
└── (AlbumController)    - [TODO] HTTP endpoints для альбомов
```

### Routes (API маршруты)
```
backend/src/routes/
├── authRoutes.js     - ОБНОВИТЬ (подключить AuthController)
├── postsRoutes.js    - ОБНОВИТЬ (добавить PostController)
├── commentsRoutes.js - ОБНОВИТЬ (добавить CommentController)
├── uploadRoutes.js   - (неизменено)
├── usersRoutes.js    - ОБНОВИТЬ (профили, поиск)
├── tagsRoutes.js     - ОБНОВИТЬ (теги, категории)
├── albumsRoutes.js   - ОБНОВИТЬ (коллекции)
└── searchRoutes.js   - (неизменено)
```

### Middleware
```
backend/src/middleware/
├── authMiddleware.js   - ОБНОВЛЕНА для работы с БД
├── errorHandler.js     - обработка ошибок
├── requestLogger.js    - логирование запросов
└── (остальное неизменено)
```

---

## 📖 Документация

### Для разработчиков
```
QUICKSTART_DB.md              - 30 сек быстрый старт
NEXT_STEPS.md                 - План следующих 3 фаз
DATABASE_CHECKLIST.md         - 60+ пункты проверки
STAGE4_DATABASE_COMPLETE.md   - Итоговый отчет этапа
docs/DATABASE.md              - 5000+ строк полной документации
```

### Для развертывания
```
docs/DATABASE_DEPLOYMENT.md   - Пошаговые инструкции
docs/DATABASE_STATUS.md       - Статус и метрики
DATABASE_COMPLETION_REPORT.md - Все что сделано
```

---

## ⚙️ Конфигурация

### Переменные окружения
```
backend/.env.example
├── NODE_ENV=development
├── PORT=5000
├── DB_HOST=localhost
├── DB_PORT=5432
├── DB_NAME=imagehost_db
├── DB_USER=postgres
├── DB_PASSWORD=your_password
├── JWT_SECRET=your_secret
└── (остальные переменные)
```

### Server файл
```
backend/src/server.js
- ОБНОВЛЕН с инициализацией БД
- ОБНОВЛЕН с graceful shutdown
- Экспортирует app для использования
```

---

## 🗄️ БД структура

### Отношения между таблицами
```
User (1) ──┬──> (M) Post
           ├──> (M) Comment
           ├──> (M) Album
           ├──> (M) Vote
           ├──> (M) Follow (как follower)
           └──> (M) Follow (как following)

Post (1) ──┬──> (M) Comment
           └──> (M) Vote

Comment (1) └──> (M) Vote

Vote: может быть привязан к Post ИЛИ Comment
Follow: self-referential, no self-follow
```

### Индексы (15+)
```
Users:    [none by default, added in migrations]
Posts:    userId, createdAt, isPublic
Comments: postId, userId, createdAt
Tags:     slug
Albums:   userId, isPublic
Votes:    userId, postId, commentId
Follows:  followerId, followingId
```

---

## 💾 Запуск и проверка

### Локальный запуск
```powershell
cd backend
npm install
npm start

# Ожидаемые логи:
# ✅ Database connection established
# ✅ Database models synchronized
# 🚀 Server is running!
# 🗄️ Database: Connected & Synchronized
```

### Проверка БД
```bash
# Список таблиц
psql -U postgres -d imagehost_db -c "\dt"

# Структура Users таблицы
psql -U postgres -d imagehost_db -c "\d Users"

# Количество записей
psql -U postgres -d imagehost_db -c "SELECT COUNT(*) FROM Users;"

# Просмотр данных
psql -U postgres -d imagehost_db -c "SELECT * FROM Users LIMIT 5;"
```

---

## 📋 Примеры использования

### Регистрация пользователя
```javascript
// Service
const user = await AuthService.register({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'password123'
});

// Или напрямую с моделью
const user = await User.create({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'password123'  // Автоматически захеширован!
});
```

### Получить пост с автором
```javascript
const post = await Post.findByPk(postId, {
  include: { association: 'author' }
});

console.log(post.author.username);  // Имя автора
```

### Создать комментарий
```javascript
const comment = await Comment.create({
  postId: postId,
  userId: userId,
  text: 'Great photo!'
});
```

### Лайкнуть пост
```javascript
await Vote.create({
  userId: userId,
  postId: postId,
  type: 'upvote'
});
```

### Подписаться на пользователя
```javascript
await Follow.create({
  followerId: currentUserId,
  followingId: targetUserId
});
```

---

## 🔍 Где найти нужное

**Нужно добавить новую модель?**
→ Смотри `backend/src/models/User.js` (пример)

**Нужно создать миграцию?**
→ Смотри `backend/src/migrations/001_create_users.js` (пример)

**Нужно написать Service?**
→ Смотри `backend/src/services/AuthService.js` (пример)

**Нужно написать Controller?**
→ Смотри `backend/src/controllers/AuthController.js` (пример)

**Нужны примеры запросов?**
→ Смотри `docs/DATABASE.md` (раздел "Примеры использования")

**Нужны инструкции развертывания?**
→ Смотри `docs/DATABASE_DEPLOYMENT.md`

**Нужна помощь с troubleshooting?**
→ Смотри `DATABASE_CHECKLIST.md` (раздел "Troubleshooting")

**Нужно понять что дальше?**
→ Смотри `NEXT_STEPS.md`

---

## 📊 Статус каждого компонента

```
✅ ГОТОВО (можно использовать)
├── Database конфигурация
├── 7 Моделей
├── 10+ Отношений
├── 7 Миграций
├── Server интеграция
├── AuthService
├── AuthController
└── Документация

⏳ В РАЗРАБОТКЕ (TODO)
├── PostService & Controller
├── CommentService & Controller
├── VoteService & Controller
├── FollowService & Controller
├── AlbumService & Controller
├── API Routes обновление
├── Валидация
└── Тесты

⏸️ ПЛАНИРУЕТСЯ (будущее)
├── GraphQL API
├── Кеширование (Redis)
├── Full-text search
└── Оптимизация
```

---

## 🔗 Быстрые ссылки

**Главные файлы для понимания:**
- 📖 `docs/DATABASE.md` - Полная документация (НАЧНИТЕ ОТСЮДА)
- 🚀 `QUICKSTART_DB.md` - Быстрый старт (15 минут)
- 🎯 `NEXT_STEPS.md` - Что дальше (план)
- ✅ `DATABASE_CHECKLIST.md` - Проверка (валидация)

**Файлы кода:**
- 🗄️ `backend/src/models/` - ВСЕ модели
- 🔄 `backend/src/services/AuthService.js` - Пример Service
- 🎛️ `backend/src/controllers/AuthController.js` - Пример Controller
- ⚙️ `backend/src/config/database.js` - Конфигурация БД

**Для локального запуска:**
1. `QUICKSTART_DB.md` → скопируй команды
2. `backend/.env.example` → скопируй в .env
3. `npm install && npm start` → запусти

**Для Render.com:**
1. `docs/DATABASE_DEPLOYMENT.md` → следуй шагам
2. Создай PostgreSQL на Render
3. Обновить env vars
4. Deploy

---

## 💡 Советы

**Совет 1:** Всегда проверяй `models/index.js` - там все отношения!

**Совет 2:** Bcrypt автоматически работает - не нужно хешировать вручную!

**Совет 3:** Используй `.findByPk()` для быстрого поиска по ID

**Совет 4:** Используй `.include` для загрузки связанных данных

**Совет 5:** Cascade delete работает автоматически - удаление User удалит его Posts

---

**Всё готово! Начни с `QUICKSTART_DB.md` или `docs/DATABASE.md` 🚀**
