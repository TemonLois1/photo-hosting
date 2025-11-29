# ✅ Контрольный список: Проверка БД

Используйте этот список для проверки, что все компоненты БД работают корректно.

---

## 1️⃣ Локальная установка PostgreSQL

- [ ] PostgreSQL установлена (версия 13+)
  ```powershell
  psql --version
  # Ожидаемый результат: psql (PostgreSQL) 13.x
  ```

- [ ] PostgreSQL запущена
  ```powershell
  # Windows: Check Services
  # Или: pg_isready -h localhost -p 5432
  # Ожидаемый результат: accepting connections
  ```

- [ ] БД imagehost_db создана
  ```powershell
  psql -U postgres -l | findstr imagehost_db
  # Ожидаемый результат: imagehost_db список БД
  ```

---

## 2️⃣ Backend конфигурация

- [ ] Файл `backend/.env` существует и заполнен
  ```bash
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=imagehost_db
  DB_USER=postgres
  DB_PASSWORD=<ваш_пароль>
  JWT_SECRET=<любое значение>
  ```

- [ ] Зависимости установлены
  ```powershell
  cd backend
  npm list sequelize pg
  # Ожидаемый результат: оба пакета есть
  ```

---

## 3️⃣ Модели и конфигурация

- [ ] Конфигурация БД существует
  ```bash
  ls backend/src/config/database.js
  # Ожидаемый результат: файл существует
  ```

- [ ] Все 7 моделей созданы
  ```bash
  ls backend/src/models/
  # Ожидаемый результат:
  # User.js, Post.js, Comment.js, Tag.js, Album.js, Vote.js, Follow.js, index.js
  ```

- [ ] Все 7 миграций созданы
  ```bash
  ls backend/src/migrations/
  # Ожидаемый результат: 001_*.js по 007_*.js
  ```

---

## 4️⃣ Server запуск

- [ ] Сервер запускается без ошибок
  ```powershell
  cd backend
  npm start

  # Ожидаемые логи:
  # ✅ Database connection established
  # ✅ Database models synchronized
  # 🚀 Server is running!
  # 📍 Listening on port 5000
  # 🗄️ Database: Connected & Synchronized
  ```

- [ ] Health check работает
  ```bash
  curl http://localhost:5000/health
  # Ожидаемый результат: JSON с status: OK
  ```

---

## 5️⃣ БД таблицы

- [ ] Все таблицы созданы
  ```bash
  psql -U postgres -d imagehost_db -c "\dt"
  
  # Ожидаемый результат (~7 таблиц):
  # Users, Posts, Comments, Tags, Albums, Votes, Follows
  ```

- [ ] Структура Users таблицы корректна
  ```bash
  psql -U postgres -d imagehost_db -c "\d Users"
  
  # Ожидаемые колонки:
  # id (UUID), username, email, password, profileImage, bio, isVerified
  # createdAt, updatedAt
  ```

- [ ] Структура Posts таблицы корректна
  ```bash
  psql -U postgres -d imagehost_db -c "\d Posts"
  
  # Ожидаемые колонки:
  # id (UUID), userId (FK), title, description, imageUrl, thumbnail
  # views, upvotes, downvotes, isPublic, createdAt, updatedAt
  ```

---

## 6️⃣ Services и Controllers

- [ ] AuthService существует и экспортируется
  ```bash
  # backend/src/services/AuthService.js должен содержать методы:
  # - register()
  # - login()
  # - getUserById()
  # - getUserProfile()
  # - updateProfile()
  # - refreshToken()
  ```

- [ ] AuthController существует
  ```bash
  # backend/src/controllers/AuthController.js должен содержать методы:
  # - register()
  # - login()
  # - logout()
  # - refresh()
  # - getCurrentUser()
  # - getUserProfile()
  # - updateProfile()
  ```

---

## 7️⃣ Основные операции БД

### Создание пользователя
```powershell
# Через API (когда контроллер подключен):
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Или напрямую в БД:
psql -U postgres -d imagehost_db
INSERT INTO "Users" (id, username, email, password) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'testuser', 'test@example.com', 'hashed_password');
```

### Проверка данных
```bash
psql -U postgres -d imagehost_db

SELECT COUNT(*) FROM "Users";        # Должно быть >= 1
SELECT COUNT(*) FROM "Posts";        # Может быть 0
SELECT * FROM "Users" LIMIT 1;       # Показать пользователя
```

### Удаление тестовых данных
```bash
psql -U postgres -d imagehost_db
DELETE FROM "Users" WHERE username = 'testuser';
```

---

## 8️⃣ Индексы

- [ ] Индексы созданы
  ```bash
  psql -U postgres -d imagehost_db -c "\di"
  
  # Ожидаемые индексы:
  # - Users: email_idx, username_idx (if manually created)
  # - Posts: userId, createdAt, isPublic
  # - Comments: postId, userId, createdAt
  # - Tags: slug
  # - Albums: userId, isPublic
  # - Votes: userId, postId, commentId
  # - Follows: followerId, followingId
  ```

---

## 9️⃣ Ограничения БД

- [ ] Уникальные ограничения
  ```bash
  psql -U postgres -d imagehost_db -c "\d Users"
  
  # Должны быть Unique Indexes на:
  # - email
  # - username
  ```

- [ ] Foreign Key ограничения
  ```bash
  psql -U postgres -d imagehost_db -c "\d Posts"
  
  # Должен быть:
  # userId -> Users.id (CASCADE DELETE)
  ```

---

## 🔟 Документация

- [ ] DATABASE.md существует и содержит информацию о моделях
- [ ] DATABASE_DEPLOYMENT.md содержит инструкции локального развертывания
- [ ] QUICKSTART_DB.md содержит быстрый старт
- [ ] NEXT_STEPS.md содержит план дальнейшей разработки

---

## 1️⃣1️⃣ Troubleshooting

### Ошибка: "ECONNREFUSED 127.0.0.1:5432"
```
Решение:
1. Проверить PostgreSQL запущена: pg_isready
2. Проверить .env переменные DB_HOST, DB_PORT
3. Перезагрузить PostgreSQL сервис
```

### Ошибка: "database imagehost_db does not exist"
```
Решение:
1. Создать БД: createdb -U postgres imagehost_db
2. Перезапустить сервер npm start
```

### Ошибка: "Models not syncing"
```
Решение:
1. Проверить логи сервера
2. Убедиться все модели импортированы в models/index.js
3. Проверить database.js конфигурация
```

### Ошибка: "password authentication failed"
```
Решение:
1. Проверить DB_PASSWORD в .env
2. Убедиться пароль совпадает с PostgreSQL пользователем
3. Переустановить пароль пользователя postgres
```

---

## 1️⃣2️⃣ Performance проверка

- [ ] Запросы быстрые
  ```bash
  # На локальной БД все запросы должны быть < 10ms
  time psql -U postgres -d imagehost_db -c "SELECT * FROM Users;"
  ```

- [ ] Pool соединений работает
  ```bash
  # Из database.js логов должно быть видно подключение пула
  # Pool created with 10 max, 2 min connections
  ```

---

## 1️⃣3️⃣ Security проверка

- [ ] Пароли хешируются
  ```bash
  psql -U postgres -d imagehost_db
  SELECT password FROM "Users" LIMIT 1;
  # Результат должен выглядеть как $2b$10$... (bcrypt формат)
  ```

- [ ] UUID используются
  ```bash
  psql -U postgres -d imagehost_db
  SELECT id FROM "Users" LIMIT 1;
  # Результат должен быть UUID, не число
  ```

---

## 1️⃣4️⃣ Render.com deployment (когда будете деплоить)

- [ ] PostgreSQL БД создана на Render
- [ ] Backend env vars обновлены:
  - DB_HOST (из Internal Database URL)
  - DB_PORT (обычно 5432)
  - DB_NAME (imagehost_db)
  - DB_USER (postgres)
  - DB_PASSWORD (из URL)
- [ ] Backend перезагружен (Manual Deploy)
- [ ] Логи показывают "Database synchronized"

---

## 1️⃣5️⃣ API endpoints проверка (когда контроллеры готовы)

```bash
# Регистрация
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET /api/auth/me

# Профиль
GET /api/auth/profile/:userId
PUT /api/auth/profile

# Посты
GET /api/posts
POST /api/posts
GET /api/posts/:id
PUT /api/posts/:id
DELETE /api/posts/:id

# Комментарии
POST /api/comments
GET /api/posts/:id/comments

# Лайки
POST /api/votes
DELETE /api/votes/:id

# Подписки
POST /api/follow/:userId
DELETE /api/follow/:userId
GET /api/followers/:userId
GET /api/following/:userId
```

---

## ✅ Финальная проверка

Если ВСЕ пункты отмечены ✅:

- ✅ БД полностью функциональна
- ✅ Модели синхронизированы
- ✅ Таблицы созданы
- ✅ Индексы работают
- ✅ Ограничения действуют
- ✅ Сервер готов к работе
- ✅ **Готово к реализации Controllers!**

---

## 📊 Статус чеклиста

```
Секции:         15
Пункты:         60+
Ожидаемое:      100%
Время проверки: ~15 минут

Если всё ✅ → БД полностью готова!
```

---

**Начните с пункта 1 и идите последовательно. При проблемах смотрите Troubleshooting!**

Если остались вопросы → смотри `docs/DATABASE.md`
