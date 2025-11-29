# 🎯 Что дальше? План разработки

После успешного развертывания БД (PostgreSQL + Sequelize), вот пошаговый план для завершения backend'а:

---

## 📋 Фаза 1: Controllers & Services (2-3 дня)

### ✅ Что уже готово
- 7 Sequelize моделей
- 7 миграций БД
- Конфигурация Sequelize
- Server.js с инициализацией БД
- Middleware для аутентификации (уже существует)

### 🔄 Что нужно сделать

#### 1. AuthService (ГОТОВ ✅)
- **Файл:** `backend/src/services/AuthService.js`
- **Функции:** register, login, getUserById, getUserProfile, updateProfile, refreshToken
- **Статус:** ✅ Готово для использования

#### 2. AuthController (ГОТОВ ✅)
- **Файл:** `backend/src/controllers/AuthController.js`
- **Методы:** register, login, logout, refresh, getCurrentUser, getUserProfile, updateProfile
- **Статус:** ✅ Готово для использования

#### 3. Остальные Services
```javascript
// PostService
- createPost(userId, postData)
- getPost(postId)
- getUserPosts(userId)
- getPublicPosts(filters, pagination)
- updatePost(postId, userId, data)
- deletePost(postId, userId)
- incrementViews(postId)

// CommentService
- createComment(postId, userId, text)
- getPostComments(postId, pagination)
- updateComment(commentId, userId, text)
- deleteComment(commentId, userId)

// VoteService
- toggleVote(userId, postId/commentId, type)
- getVoteCount(postId/commentId)
- getUserVote(userId, postId/commentId)

// FollowService
- followUser(followerId, followingId)
- unfollowUser(followerId, followingId)
- getFollowers(userId, pagination)
- getFollowing(userId, pagination)
- isFollowing(followerId, followingId)

// AlbumService
- createAlbum(userId, albumData)
- getUserAlbums(userId)
- updateAlbum(albumId, userId, data)
- deleteAlbum(albumId, userId)
```

#### 4. Остальные Controllers
```javascript
// PostController - POST, GET, PUT, DELETE для постов
// CommentController - CRUD для комментариев
// UserController - профили, поиск, рекомендации
// VoteController - переключение лайков/дизлайков
// FollowController - подписка/отписка
// AlbumController - управление альбомами
```

---

## 📋 Фаза 2: API Routes (1 день)

Обновить маршруты в `backend/src/routes/`:

```javascript
// authRoutes.js - обновить
POST   /auth/register        - Регистрация
POST   /auth/login           - Вход
POST   /auth/logout          - Выход
POST   /auth/refresh         - Обновить токен
GET    /auth/me              - Текущий пользователь
GET    /auth/profile/:id     - Профиль пользователя
PUT    /auth/profile         - Обновить профиль

// postsRoutes.js
GET    /posts                - Все посты
POST   /posts                - Создать пост (требует auth)
GET    /posts/:id            - Получить пост
PUT    /posts/:id            - Обновить пост (owner only)
DELETE /posts/:id            - Удалить пост (owner only)

// commentsRoutes.js
POST   /comments             - Создать комментарий
GET    /posts/:postId/comments - Получить комментарии поста
PUT    /comments/:id         - Обновить комментарий
DELETE /comments/:id         - Удалить комментарий

// votesRoutes.js (новый)
POST   /votes                - Лайкнуть/дизлайкнуть
DELETE /votes/:id            - Удалить голос

// followRoutes.js (новый)
POST   /follow/:userId       - Подписаться
DELETE /follow/:userId       - Отписаться
GET    /followers/:userId    - Получить подписчиков
GET    /following/:userId    - Получить подписки
```

---

## 📋 Фаза 3: Валидация & Обработка ошибок (1 день)

### Установить пакеты
```bash
npm install joi express-validator
```

### Создать валидаторы
```javascript
// backend/src/validators/authValidator.js
- validateRegister()
- validateLogin()
- validateUpdateProfile()

// backend/src/validators/postValidator.js
- validateCreatePost()
- validateUpdatePost()

// backend/src/validators/commentValidator.js
- validateCreateComment()
```

### Обновить errorHandler
- Обработка валидационных ошибок
- Обработка БД ошибок
- Обработка JWT ошибок

---

## 📋 Фаза 4: Тестирование (2 дня)

### Unit тесты (Jest)
```bash
npm install --save-dev jest supertest
```

### Тест-примеры
```javascript
// backend/tests/auth.test.js
- Test registration success/failure
- Test login success/failure
- Test token refresh

// backend/tests/post.test.js
- Test create post
- Test get posts
- Test update/delete post

// backend/tests/integration.test.js
- Full user journey test
```

### Запуск тестов
```bash
npm run test
npm run test:coverage
```

---

## 🎬 Быстрый старт: Подключите AuthService

### Шаг 1: Обновить authRoutes.js

```javascript
// backend/src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authenticate } = require('../middleware/authMiddleware');

// Публичные маршруты
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);

// Защищенные маршруты
router.post('/logout', authenticate, AuthController.logout);
router.get('/me', authenticate, AuthController.getCurrentUser);
router.get('/profile/:userId', AuthController.getUserProfile);
router.put('/profile', authenticate, AuthController.updateProfile);
router.post('/verify-email', AuthController.verifyEmail);

module.exports = router;
```

### Шаг 2: Протестировать в Postman

```bash
# 1. Регистрация
POST http://localhost:5000/api/auth/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

# 2. Вход
POST http://localhost:5000/api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}

# 3. Получить профиль
GET http://localhost:5000/api/auth/profile/{userId}

# 4. Получить текущего пользователя (требует token)
GET http://localhost:5000/api/auth/me
Headers: Authorization: Bearer {accessToken}
```

---

## 📊 Рекомендуемый порядок реализации

```
Неделя 1:
├─ День 1-2: PostService & PostController
├─ День 3: CommentService & CommentController
├─ День 4: VoteService & VoteController (лайки)
└─ День 5: FollowService & FollowController

Неделя 2:
├─ День 1-2: Валидация и обработка ошибок
├─ День 3-4: Все API routes обновлены и тестированы
└─ День 5: Backend готов для frontend'а

Неделя 3:
├─ Day 1-2: Написать unit тесты
├─ Day 3: Integration тесты
└─ Day 4-5: Deploy на Render + frontend интеграция
```

---

## 🔗 Интеграция с Frontend

После того, как Controllers готовы:

```javascript
// frontend/src/utils/api.js уже готов к использованию

// Пример использования
import api from './utils/api';

// Регистрация
await api.post('/auth/register', {
  username: 'john',
  email: 'john@example.com',
  password: 'password123'
});

// Вход
const response = await api.post('/auth/login', {
  email: 'john@example.com',
  password: 'password123'
});

// Сохранить токен в localStorage
localStorage.setItem('accessToken', response.data.tokens.accessToken);

// Все последующие запросы будут использовать токен автоматически
const profile = await api.get('/auth/me');
```

---

## 📚 Полезные ресурсы

- **Sequelize Docs:** https://sequelize.org/
- **Express Best Practices:** https://expressjs.com/
- **JWT Guide:** https://jwt.io/introduction
- **REST API Design:** https://restfulapi.net/

---

## 🎯 Метрики успеха

✅ Завершено
- Модели БД (7/7)
- Миграции (7/7)
- AuthService (1/1)
- AuthController (1/1)

⏳ В процессе
- [ ] Остальные Services (5)
- [ ] Остальные Controllers (5)
- [ ] API Routes (полное обновление)
- [ ] Валидация
- [ ] Тесты

📈 Следующие 2 недели
- Реализовать все Services и Controllers
- Полная интеграция с Frontend
- Развернуть на Render с PostgreSQL
- 🚀 Production ready!

---

**Начнем с PostService на следующем этапе! 💪**
