# 🚀 Быстрый старт БД - Для разработчиков

## 30 секунд до запуска

### Локально (Windows)

```powershell
# 1. Установить PostgreSQL (если еще не установлена)
# https://www.postgresql.org/download/windows/

# 2. Создать БД
psql -U postgres -c "CREATE DATABASE imagehost_db;"

# 3. Перейти в backend
cd d:\project\three\backend

# 4. Скопировать .env и заполнить DB_PASSWORD
copy .env.example .env
# Отредактировать: DB_PASSWORD=postgres_password

# 5. Установить и запустить
npm install
npm start

# ✅ Должно сработать!
```

---

## На Render.com

```
1. Создать PostgreSQL на Render (5 минут)
2. Скопировать Internal Database URL
3. Разбить на компоненты и установить в Render Backend env vars
4. Deploy backend
5. ✅ Done!
```

---

## Основные команды

```powershell
# Подключиться к локальной БД
psql -U postgres -d imagehost_db

# Просмотреть таблицы
\dt

# Просмотреть структуру таблицы
\d "Users"

# SQL запросы
SELECT COUNT(*) FROM "Users";

# Выход
\q

# Сбросить БД (осторожно!)
dropdb -U postgres imagehost_db
createdb -U postgres imagehost_db
```

---

## Основные модели Sequelize

### User
```javascript
const user = await User.create({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'password123'  // Автоматически хеширован!
});

// Проверить пароль
const isValid = await user.validatePassword('password123');

// Получить все посты пользователя
const user = await User.findByPk(userId, {
  include: { association: 'posts' }
});
```

### Post
```javascript
// Создать пост
const post = await Post.create({
  userId: userId,
  title: 'My photo',
  description: 'Beautiful sunset',
  imageUrl: 'https://...',
  isPublic: true
});

// Получить пост с автором и комментариями
const post = await Post.findByPk(postId, {
  include: ['author', 'comments']
});

// Увеличить просмотры
await post.increment('views');
```

### Comment
```javascript
// Добавить комментарий
const comment = await Comment.create({
  postId: postId,
  userId: userId,
  text: 'Great photo!'
});

// Получить все комментарии поста
const comments = await Comment.findAll({
  where: { postId: postId },
  include: { association: 'author' },
  order: [['createdAt', 'DESC']]
});
```

### Vote (Like/Unlike)
```javascript
// Лайкнуть пост
await Vote.create({
  userId: userId,
  postId: postId,
  type: 'upvote'  // или 'downvote'
});

// Удалить голос
await Vote.destroy({
  where: { userId: userId, postId: postId }
});

// Подсчитать голоса
const upvoteCount = await Vote.count({
  where: { postId: postId, type: 'upvote' }
});
```

### Follow (Подписка)
```javascript
// Подписаться
await Follow.create({
  followerId: currentUserId,
  followingId: targetUserId
});

// Получить подписчиков
const followers = await Follow.findAll({
  where: { followingId: userId },
  include: { association: 'follower' }
});

// Получить подписки
const following = await Follow.findAll({
  where: { followerId: userId },
  include: { association: 'following' }
});
```

---

## Полезные паттерны

### Получить все данные пользователя
```javascript
const user = await User.findByPk(userId, {
  include: ['posts', 'comments', 'followers', 'following', 'albums']
});
```

### Популярные посты
```javascript
const popular = await Post.findAll({
  where: { isPublic: true },
  order: [['upvotes', 'DESC']],
  limit: 10
});
```

### Недавние посты с авторами
```javascript
const recent = await Post.findAll({
  order: [['createdAt', 'DESC']],
  limit: 20,
  include: { association: 'author', attributes: ['id', 'username', 'profileImage'] }
});
```

### Фильтр + Пагинация
```javascript
const page = 1;
const pageSize = 20;

const posts = await Post.findAndCountAll({
  where: { isPublic: true },
  order: [['createdAt', 'DESC']],
  limit: pageSize,
  offset: (page - 1) * pageSize
});

console.log(`Showing ${posts.rows.length} of ${posts.count} posts`);
```

---

## Troubleshooting

| Проблема | Решение |
|----------|---------|
| `ECONNREFUSED` | PostgreSQL не запущена → `pg_ctlcluster 13 main start` |
| `database does not exist` | `createdb -U postgres imagehost_db` |
| `Sequelize models not syncing` | Проверить логи сервера, убедиться в .env данных |
| `password hash mismatch` | Используется validatePassword(), не сравнивать напрямую |
| `Foreign key constraint violation` | Пользователь/пост не существует перед созданием связи |

---

## Переменные окружения

```bash
# Требуется заполнить в .env для работы БД
DB_HOST=localhost
DB_PORT=5432
DB_NAME=imagehost_db
DB_USER=postgres
DB_PASSWORD=your_password
NODE_ENV=development
```

---

## Файлы проекта

```
backend/
├── src/
│   ├── config/database.js           ← Конфигурация Sequelize
│   ├── models/
│   │   ├── User.js                  ← Пользователи
│   │   ├── Post.js                  ← Посты
│   │   ├── Comment.js               ← Комментарии
│   │   ├── Tag.js                   ← Теги
│   │   ├── Album.js                 ← Альбомы
│   │   ├── Vote.js                  ← Голоса
│   │   ├── Follow.js                ← Подписки
│   │   └── index.js                 ← Ассоциации
│   ├── migrations/
│   │   ├── 001_create_users.js
│   │   ├── 002_create_posts.js
│   │   ├── 003_create_comments.js
│   │   ├── 004_create_tags.js
│   │   ├── 005_create_albums.js
│   │   ├── 006_create_votes.js
│   │   └── 007_create_follows.js
│   └── server.js                    ← Инициализация БД
├── .env.example                     ← Template конфигурации
└── package.json                     ← Зависимости

docs/
├── DATABASE.md                      ← Полная документация
├── DATABASE_DEPLOYMENT.md           ← Инструкции развертывания
└── DATABASE_STATUS.md               ← Этот файл
```

---

## Следующие шаги

1. **Controllers** - Создать CRUD операции
   ```javascript
   // backend/src/controllers/PostController.js
   exports.createPost = async (req, res) => {
     const post = await Post.create(req.body);
     res.json(post);
   };
   ```

2. **Services** - Бизнес-логика
   ```javascript
   // backend/src/services/PostService.js
   exports.getPopularPosts = async () => {
     return await Post.findAll({
       order: [['upvotes', 'DESC']],
       limit: 10
     });
   };
   ```

3. **Routes** - Подключить контроллеры
   ```javascript
   router.post('/', PostController.createPost);
   router.get('/:id', PostController.getPost);
   ```

---

**Нужна помощь?** Смотри `docs/DATABASE.md` для полной документации!
