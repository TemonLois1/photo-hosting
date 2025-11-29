# 🗄️ База Данных - PostgreSQL & Sequelize

## Структура БД

### Таблицы и модели

#### 1. **Users** - Пользователи
- **Поля:**
  - `id` (UUID, Primary Key)
  - `username` (String, Unique, 3-50 символов)
  - `email` (String, Unique, валидный email)
  - `password` (String, хешируется bcryptjs)
  - `profileImage` (String, URL аватара)
  - `bio` (Text, описание профиля)
  - `isVerified` (Boolean, подтверждение email)
  - `createdAt`, `updatedAt` (Timestamps)

- **Безопасность:** Пароли автоматически хешируются при создании и обновлении
- **Метод:** `validatePassword(password)` для проверки пароля

#### 2. **Posts** - Посты/Галереи
- **Поля:**
  - `id` (UUID, Primary Key)
  - `userId` (FK → Users, Cascade Delete)
  - `title` (String)
  - `description` (Text)
  - `imageUrl` (String, обязательное)
  - `thumbnail` (String, миниатюра)
  - `views` (Integer, счетчик просмотров)
  - `upvotes`, `downvotes` (Integer, счетчики голосов)
  - `isPublic` (Boolean, приватность)
  - `createdAt`, `updatedAt` (Timestamps)

- **Индексы:** userId, createdAt, isPublic (для быстрого поиска)

#### 3. **Comments** - Комментарии
- **Поля:**
  - `id` (UUID, Primary Key)
  - `postId` (FK → Posts, Cascade Delete)
  - `userId` (FK → Users, Cascade Delete)
  - `text` (Text, обязательно)
  - `upvotes` (Integer, рейтинг комментария)
  - `createdAt`, `updatedAt` (Timestamps)

- **Индексы:** postId, userId, createdAt

#### 4. **Tags** - Теги/Категории
- **Поля:**
  - `id` (UUID, Primary Key)
  - `name` (String, Unique)
  - `slug` (String, Unique, для URL)
  - `postCount` (Integer, счетчик постов)
  - `createdAt`, `updatedAt` (Timestamps)

- **Использование:** Категоризация постов, популярность тегов

#### 5. **Albums** - Альбомы/Коллекции
- **Поля:**
  - `id` (UUID, Primary Key)
  - `userId` (FK → Users, Cascade Delete)
  - `name` (String)
  - `description` (Text)
  - `coverImage` (String)
  - `isPublic` (Boolean)
  - `postCount` (Integer)
  - `createdAt`, `updatedAt` (Timestamps)

- **Назначение:** Группировка постов в коллекции

#### 6. **Votes** - Голосования (Like/Unlike)
- **Поля:**
  - `id` (UUID, Primary Key)
  - `userId` (FK → Users, Cascade Delete)
  - `postId` (FK → Posts, Cascade Delete, Optional)
  - `commentId` (FK → Comments, Cascade Delete, Optional)
  - `type` (ENUM: 'upvote', 'downvote')
  - `createdAt`, `updatedAt` (Timestamps)

- **Уникальность:** Один пользователь = один голос за пост/комментарий
- **Индексы:** userId, postId, commentId

#### 7. **Follows** - Подписки
- **Поля:**
  - `id` (UUID, Primary Key)
  - `followerId` (FK → Users, Cascade Delete)
  - `followingId` (FK → Users, Cascade Delete)
  - `createdAt`, `updatedAt` (Timestamps)

- **Уникальность:** Пользователь не может подписаться на одного пользователя дважды
- **Самоссылка:** Оба внешних ключа указывают на таблицу Users
- **Ограничение:** Пользователь не может подписаться на себя
- **Социальная сеть:** Позволяет отслеживать, кто следит за кем

## Связи между таблицами

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

Vote:
  - МОЖЕТ быть привязан к Post ИЛИ Comment
  - Уникален на комбинацию (userId, postId, commentId)
```

## Настройка БД

### 1. Локальная PostgreSQL

```bash
# Windows (с использованием PostgreSQL installer)
# 1. Установить PostgreSQL с https://www.postgresql.org/download/windows/
# 2. Запомнить пароль для пользователя 'postgres'
# 3. Создать БД:

# Через pgAdmin (GUI) или командную строку:
createdb -U postgres imagehost_db

# Или через psql:
psql -U postgres
CREATE DATABASE imagehost_db;
\q
```

### 2. Конфигурация .env

```bash
cp backend/.env.example backend/.env

# Отредактировать backend/.env:
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=imagehost_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

### 3. Инициализация БД

```bash
cd backend

# Установка зависимостей
npm install

# Запуск сервера (автоматически синхронизирует модели)
npm start

# Логи покажут:
# ✅ Database connection established
# ✅ Database models synchronized
```

## Миграции

Миграции находятся в `backend/src/migrations/`:

1. **001_create_users.js** - Таблица Users
2. **002_create_posts.js** - Таблица Posts
3. **003_create_comments.js** - Таблица Comments
4. **004_create_tags.js** - Таблица Tags
5. **005_create_albums.js** - Таблица Albums
6. **006_create_votes.js** - Таблица Votes (с уникальностью)
7. **007_create_follows.js** - Таблица Follows (с проверкой self-follow)

## Примеры использования Sequelize моделей

### Создание пользователя

```javascript
const { User } = require('./models');

const user = await User.create({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'securepassword123' // Автоматически захеширован!
});
```

### Поиск с отношениями

```javascript
// Получить пост с автором и комментариями
const post = await Post.findByPk(postId, {
  include: ['author', 'comments']
});

// Получить пользователя с его постами и подписчиками
const user = await User.findByPk(userId, {
  include: ['posts', 'followers', 'following']
});
```

### Подсчет голосов

```javascript
// Увеличить счетчик upvotes
const post = await Post.findByPk(postId);
await post.increment('upvotes');

// Или напрямую
await Post.update(
  { upvotes: Sequelize.literal('upvotes + 1') },
  { where: { id: postId } }
);
```

### Фильтрация

```javascript
// Получить только публичные посты
const publicPosts = await Post.findAll({
  where: { isPublic: true },
  order: [['createdAt', 'DESC']],
  limit: 20
});

// Получить популярные теги
const popularTags = await Tag.findAll({
  where: Sequelize.where(
    Sequelize.fn('COUNT', Sequelize.col('Posts.id')),
    Sequelize.Op.gte,
    10
  ),
  order: [['postCount', 'DESC']],
  limit: 10
});
```

## Производство (Render.com)

### Создание PostgreSQL БД на Render

1. Перейти на [render.com](https://render.com)
2. Создать новый PostgreSQL сервис
3. Выбрать регион (рекомендуется совпадает с backend)
4. Получить строку подключения
5. Установить переменные окружения в Render dashboard:

```
DB_HOST=<host из строки подключения>
DB_PORT=5432
DB_NAME=<database name>
DB_USER=<username>
DB_PASSWORD=<password>
```

6. Сервер автоматически синхронизирует модели при запуске

## Проверка и отладка

### Подключение к БД через psql

```bash
psql -U postgres -d imagehost_db -h localhost
```

### SQL запросы для проверки

```sql
-- Список всех таблиц
\dt

-- Структура таблицы Users
\d "Users"

-- Количество записей
SELECT COUNT(*) FROM "Users";
SELECT COUNT(*) FROM "Posts";

-- Просмотр данных
SELECT * FROM "Users" LIMIT 5;
SELECT p.title, u.username FROM "Posts" p JOIN "Users" u ON p."userId" = u.id;
```

## Оптимизация

### Добавленные индексы

- **Posts:** userId, createdAt, isPublic
- **Comments:** postId, userId, createdAt
- **Tags:** slug
- **Albums:** userId, isPublic
- **Votes:** userId, postId, commentId
- **Follows:** followerId, followingId

### Рекомендации

1. **Использовать индексы** при фильтрации по часто используемым полям
2. **Пакетные операции** - использовать `bulkCreate`, `bulkUpdate`
3. **Выборочная загрузка** - указывать нужные поля в `attributes`
4. **Пагинация** - использовать `offset` и `limit` для больших наборов
5. **Кеширование** - рассмотреть Redis для кеша популярных постов

## Troubleshooting

### Ошибка: "connect ECONNREFUSED 127.0.0.1:5432"

**Решение:** PostgreSQL не запущена
```bash
# Windows: проверить Service PostgreSQL в Services
# Linux: sudo systemctl start postgresql
# Mac: brew services start postgresql@13
```

### Ошибка: "database "imagehost_db" does not exist"

**Решение:** Создать БД
```bash
createdb -U postgres imagehost_db
```

### Ошибка: "password authentication failed for user "postgres""

**Решение:** Проверить пароль в .env и PostgreSQL конфиге

### Модели не синхронизированы после запуска сервера

**Решение:** Проверить логи сервера и убедиться:
- ✅ Сервер запущен без ошибок
- ✅ .env содержит правильные данные БД
- ✅ PostgreSQL запущена и доступна

## Следующие шаги

1. ✅ Создать моделей Sequelize (ГОТОВО)
2. ✅ Создать миграции (ГОТОВО)
3. ⏳ Создать Controllers для CRUD операций
4. ⏳ Создать Services для бизнес-логики
5. ⏳ Добавить валидацию и error handling
6. ⏳ Интегрировать с Frontend API
7. ⏳ Написать unit/integration тесты
8. ⏳ Настроить Redis для кеширования
9. ⏳ Оптимизировать запросы

---

**Документация:** [Sequelize Docs](https://sequelize.org/) | [PostgreSQL Docs](https://www.postgresql.org/docs/)
