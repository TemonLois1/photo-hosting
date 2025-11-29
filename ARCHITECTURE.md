# 📐 Архитектура Фотохостинга (Web-версия, стиль Imgur)

## Обзор Системы

Веб-приложение для фотохостинга с высокой масштабируемостью, представляющее собой современное SPA (Single Page Application) с мощным backend-ом.

---

## I. 🏗️ Общая Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                        CDN (Cloudflare)                      │
│         Кэширование изображений & ускорение доставки        │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼──────────┐       ┌─────────▼──────────┐
│  React SPA       │       │   Static Assets    │
│  (Frontend)      │       │  (CSS, JS, HTML)   │
└────────┬─────────┘       └────────────────────┘
         │
         │ HTTPS / REST / WebSocket
         │
┌────────▼──────────────────────────────────────┐
│          API Gateway / Load Balancer           │
│        (Nginx / AWS ALB)                       │
└────────┬───────────────────────────────────────┘
         │
┌────────▼──────────────────────────────────────┐
│      Node.js + Express (Backend Servers)      │
│  ┌──────────────────────────────────────────┐ │
│  │ Routes → Controllers → Services → DB     │ │
│  │                                          │ │
│  │ • Auth Service                           │ │
│  │ • Posts Service                          │ │
│  │ • Comments Service                       │ │
│  │ • User Service                           │ │
│  │ • Image Processing Service               │ │
│  │ • Storage Service (S3 Integration)       │ │
│  │ • Cache Service (Redis)                  │ │
│  └──────────────────────────────────────────┘ │
└────────┬───────────────────────────────────────┘
         │
         ├─────────────────────────┬──────────────────────┐
         │                         │                      │
    ┌────▼─────┐          ┌───────▼────┐       ┌────────▼───┐
    │PostgreSQL│          │   Redis    │       │   AWS S3   │
    │Database  │          │   Cache    │       │   Storage  │
    └──────────┘          └────────────┘       └────────────┘
         │
         ├─ User Accounts
         ├─ Posts Metadata
         ├─ Comments
         ├─ Votes/Ratings
         └─ Tags & Categories
```

---

## II. 🔌 Backend Architecture (Node.js + Express)

### A. Слои Приложения

#### 1. **API Routes Layer** (`/src/routes`)
- Определение всех HTTP endpoints
- Валидация входных параметров
- Связь с контроллерами

Структура:
```
routes/
├── authRoutes.js       # /api/auth/* endpoints
├── postsRoutes.js      # /api/posts/* endpoints
├── commentsRoutes.js   # /api/comments/* endpoints
├── usersRoutes.js      # /api/users/* endpoints
└── uploadRoutes.js     # /api/upload/* endpoints
```

#### 2. **Controllers Layer** (`/src/controllers`)
- Обработка бизнес-логики запросов
- Формирование ответов
- Обработка ошибок

Структура:
```
controllers/
├── authController.js
├── postsController.js
├── commentsController.js
├── usersController.js
└── uploadController.js
```

#### 3. **Services Layer** (`/src/services`)
- Основная бизнес-логика
- Интеграция с БД
- Работа с внешними API

Структура:
```
services/
├── authService.js          # JWT, OAuth, Sessions
├── postsService.js         # CRUD для постов
├── commentsService.js      # Управление комментариями
├── usersService.js         # Профили, настройки
├── imageService.js         # Sharp.js обработка
├── storageService.js       # S3 интеграция
├── cacheService.js         # Redis кэширование
└── emailService.js         # Отправка писем
```

#### 4. **Models Layer** (`/src/models`)
- Определение структур данных
- Валидация на уровне БД (Sequelize ORM или TypeORM)

Структура:
```
models/
├── User.js
├── Post.js
├── Comment.js
├── Vote.js
├── Album.js
└── Tag.js
```

#### 5. **Middleware Layer** (`/src/middleware`)
- Аутентификация
- Авторизация
- Обработка ошибок
- CORS, Rate Limiting

Структура:
```
middleware/
├── authMiddleware.js       # JWT верификация
├── errorHandler.js
├── rateLimiter.js          # Защита от abuse
├── corsMiddleware.js
├── requestLogger.js
└── validationMiddleware.js
```

#### 6. **Config Layer** (`/src/config`)
- Настройки приложения
- Подключение к БД
- Переменные окружения

Структура:
```
config/
├── database.js             # PostgreSQL подключение
├── redis.js                # Redis подключение
├── s3.js                   # AWS S3 конфиг
├── cloudflare.js           # CDN конфиг
└── environment.js          # Переменные окружения
```

### B. Основной Файл Приложения

```javascript
// src/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

const app = express();

// Security & Performance
app.use(helmet());
app.use(compression());
app.use(cors({ origin: process.env.FRONTEND_URL }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // 100 запросов на IP
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
  console.log('🚀 Server running on port 5000');
});
```

---

## III. 🌐 Frontend Architecture (React SPA)

### A. Структура Компонентов

```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.jsx           # Навигация, логотип
│   │   ├── Sidebar.jsx          # Боковое меню
│   │   └── Footer.jsx
│   ├── Gallery/
│   │   ├── ImageGrid.jsx        # Масонская сетка
│   │   ├── ImageCard.jsx        # Карточка поста
│   │   └── InfiniteScroll.jsx   # Бесконечная прокрутка
│   ├── Upload/
│   │   ├── UploadZone.jsx       # Drag & Drop зона
│   │   ├── ProgressBar.jsx      # Прогресс загрузки
│   │   └── UploadForm.jsx       # Форма метаданных
│   ├── Post/
│   │   ├── PostViewer.jsx       # Большой просмотр
│   │   ├── PostInfo.jsx         # Информация о посте
│   │   ├── InteractionPanel.jsx # Upvote/Downvote/Share
│   │   └── CommentsSection.jsx  # Раздел комментариев
│   ├── Editor/
│   │   ├── ImageEditor.jsx      # Canvas редактор
│   │   ├── MemeGenerator.jsx    # Генератор мемов
│   │   └── ToolPanel.jsx        # Инструменты
│   ├── User/
│   │   ├── ProfileCard.jsx      # Карточка профиля
│   │   ├── ProfileTabs.jsx      # Табы профиля
│   │   └── UserStats.jsx        # Статистика
│   └── Common/
│       ├── Modal.jsx
│       ├── Button.jsx
│       ├── Spinner.jsx
│       └── Toast.jsx
│
├── pages/
│   ├── Home.jsx                # Домашняя страница / Лента
│   ├── Upload.jsx              # Загрузка
│   ├── Post.jsx                # Страница поста
│   ├── Profile.jsx             # Профиль пользователя
│   ├── Collections.jsx         # Коллекции/Альбомы
│   ├── Search.jsx              # Поиск
│   └── NotFound.jsx
│
├── hooks/
│   ├── useAuth.js              # Аутентификация
│   ├── usePost.js              # Работа с постами
│   ├── useInfiniteScroll.js    # Бесконечная прокрутка
│   ├── useLocalStorage.js      # Local storage
│   └── useFetch.js             # Fetch с кэшем
│
├── utils/
│   ├── api.js                  # API клиент
│   ├── imageProcessor.js       # Обработка изображений (Canvas)
│   ├── validators.js           # Валидация
│   ├── formatters.js           # Форматирование данных
│   ├── shareUtils.js           # Генерация ссылок для шеринга
│   └── constants.js
│
├── styles/
│   ├── globals.css             # Глобальные стили
│   ├── variables.css           # CSS переменные
│   ├── responsive.css          # Медиа-запросы
│   └── animations.css          # Анимации
│
├── context/
│   ├── AuthContext.js
│   ├── ThemeContext.js         # Light/Dark mode
│   └── NotificationContext.js
│
├── App.jsx                     # Корневой компонент
└── index.js                    # Точка входа
```

### B. Маршруты React Router

```javascript
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/user/:username" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## IV. 🗄️ База Данных (PostgreSQL)

### Схема Таблиц

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  followers_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Posts Table
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  title VARCHAR(255),
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  original_filename VARCHAR(255),
  image_width INT,
  image_height INT,
  file_size INT,
  is_public BOOLEAN DEFAULT TRUE,
  views_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Comments Table
```sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INT REFERENCES posts(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id),
  parent_comment_id INT REFERENCES comments(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Votes Table
```sql
CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  post_id INT REFERENCES posts(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id),
  vote_type ENUM('upvote', 'downvote') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id)
);
```

#### Albums Table
```sql
CREATE TABLE albums (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE album_posts (
  id SERIAL PRIMARY KEY,
  album_id INT REFERENCES albums(id) ON DELETE CASCADE,
  post_id INT REFERENCES posts(id) ON DELETE CASCADE
);
```

#### Tags Table
```sql
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  posts_count INT DEFAULT 0
);

CREATE TABLE post_tags (
  id SERIAL PRIMARY KEY,
  post_id INT REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INT REFERENCES tags(id)
);
```

---

## V. 💾 Хранилище Медиа (AWS S3 + CDN)

### S3 Структура Папок

```
imgur-clone-bucket/
├── originals/           # Исходные загруженные файлы
│   └── {userId}/{postId}/{filename}
├── thumbnails/          # Миниатюры (350x350)
│   └── {userId}/{postId}/{filename}_thumb.jpg
├── medium/              # Средний размер (800x800)
│   └── {userId}/{postId}/{filename}_medium.jpg
├── avatars/             # Аватары пользователей
│   └── {userId}/avatar.jpg
└── cache/               # Временные файлы для обработки
    └── {userId}/{tempId}.jpg
```

### CDN Интеграция (Cloudflare)

```
Правила Кэширования:
- originals/ → 24 часа
- thumbnails/ → 7 дней
- medium/ → 7 дней
- avatars/ → 30 дней

Оптимизация:
- Image Optimization включена
- Auto WebP conversion
- Browser cache TTL: 1 час
```

---

## VI. 🔐 Security & Authentication

### JWT-based Authentication Flow

```
1. User Login
   POST /api/auth/login
   { email, password } → JWT token + Refresh token

2. Protected Routes
   Headers: Authorization: Bearer {JWT_TOKEN}
   Middleware проверяет токен → Next или 401

3. Token Refresh
   POST /api/auth/refresh
   { refresh_token } → New access token

4. Logout
   POST /api/auth/logout → Invalidate tokens
```

### Rate Limiting & CSRF Protection

- IP-based rate limiting: 100 запросов/15 минут
- Simple Captcha на анонимной загрузке
- CSRF tokens для форм
- HTTP-only cookies для токенов

---

## VII. 🎨 Frontend User Experience

### A. Домашняя Страница / Лента

**Компоненты:**
- `ImageGrid` (Masonry layout с Infinite Scroll)
- `ImageCard` (Hover эффекты, быстрый просмотр)
- `FilterBar` (Popular, Fresh, Random + Time filters)
- `SearchBar` (Поиск по тегам, названиям)

**Функционал:**
```javascript
// Пример: Infinite Scroll с ленивой загрузкой
const [posts, setPosts] = useState([]);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

useEffect(() => {
  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
      loadMorePosts();
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [page]);

async function loadMorePosts() {
  const response = await fetch(`/api/posts?page=${page}&limit=20`);
  const newPosts = await response.json();
  setPosts([...posts, ...newPosts]);
  setPage(page + 1);
}
```

### B. Upload Interface

**Компоненты:**
- `UploadZone` (Drag & drop)
- `ProgressBar` (Статус загрузки)
- `UploadForm` (Метаданные)

**Функционал:**
```javascript
// Drag & Drop обработка
const handleDrop = (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  uploadFiles(files);
};

// Загрузка с прогрессом
async function uploadFiles(files) {
  for (const file of files) {
    const formData = new FormData();
    formData.append('file', file);
    
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (e) => {
      const percentComplete = (e.loaded / e.total) * 100;
      updateProgress(percentComplete);
    });
    
    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  }
}
```

### C. Post Viewer

**Layout:**
```
┌────────────────────────────────────┐
│         Image/GIF/Video            │
│                                    │
│  Large display with lazy loading   │
└────────────────────────────────────┘
          │
          ├─────────────────────────┐
          │                         │
    ┌─────▼──────┐        ┌────────▼────────┐
    │Post Info   │        │Interaction      │
    │• Title     │        │Panel             │
    │• Author    │        │• Upvote/Downvote│
    │• Date      │        │• Share/Embed    │
    │• Votes     │        │• Save to Album  │
    └────────────┘        └─────────────────┘
          │
          └─────────────────────────┐
                                    │
                          ┌─────────▼──────────┐
                          │ Comments Section   │
                          │ • Nested threading │
                          │ • Sorting options  │
                          │ • Add comment      │
                          └────────────────────┘
```

### D. Image Editor (Canvas-based)

```javascript
// Canvas API для редактирования
const canvas = canvasRef.current;
const ctx = canvas.getContext('2d');

function crop(x, y, width, height) {
  const imageData = ctx.getImageData(x, y, width, height);
  canvas.width = width;
  canvas.height = height;
  ctx.putImageData(imageData, 0, 0);
}

function rotate(degrees) {
  const rad = (degrees * Math.PI) / 180;
  const newWidth = Math.abs(canvas.width * Math.cos(rad)) + Math.abs(canvas.height * Math.sin(rad));
  const newHeight = Math.abs(canvas.width * Math.sin(rad)) + Math.abs(canvas.height * Math.cos(rad));
  
  // Rotation logic
}

function addWatermark(text) {
  ctx.font = '20px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText(text, 10, canvas.height - 10);
}
```

---

## VIII. 🔄 API Endpoints (RESTful)

### Authentication
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/refresh` - Обновить токен
- `POST /api/auth/logout` - Выход

### Posts
- `GET /api/posts` - Получить ленту (с pagination)
- `GET /api/posts/:id` - Получить пост
- `POST /api/posts` - Создать пост
- `PUT /api/posts/:id` - Обновить пост
- `DELETE /api/posts/:id` - Удалить пост
- `GET /api/posts/:id/votes` - Получить голоса

### Comments
- `POST /api/comments` - Создать комментарий
- `GET /api/posts/:id/comments` - Получить комментарии
- `PUT /api/comments/:id` - Обновить комментарий
- `DELETE /api/comments/:id` - Удалить комментарий

### Users
- `GET /api/users/:username` - Профиль пользователя
- `PUT /api/users/:id` - Обновить профиль
- `GET /api/users/:id/posts` - Посты пользователя
- `POST /api/users/:id/follow` - Подписаться
- `GET /api/users/:id/followers` - Подписчики

### Upload
- `POST /api/upload` - Загрузить изображение
- `POST /api/upload/process` - Обработать изображение
- `POST /api/upload/optimize` - Оптимизировать размер

### Votes
- `POST /api/posts/:id/upvote` - Лайк
- `POST /api/posts/:id/downvote` - Дизлайк
- `DELETE /api/posts/:id/vote` - Отменить голос

### Collections/Albums
- `GET /api/albums` - Мои альбомы
- `POST /api/albums` - Создать альбом
- `POST /api/albums/:id/posts` - Добавить пост в альбом
- `DELETE /api/albums/:id/posts/:postId` - Удалить из альбома

---

## IX. 🚀 Performance Optimization

### Frontend
1. **Code Splitting** - Загрузка компонентов по требованию
2. **Image Lazy Loading** - Использование Intersection Observer
3. **Caching** - Service Workers, Local Storage
4. **Compression** - GZIP, WebP
5. **Minification** - JS, CSS минификация

### Backend
1. **Database Indexing** - Индексы на часто используемых полях
2. **Query Optimization** - N+1 queries solution
3. **Caching Layer** - Redis для популярных постов
4. **CDN** - Cloudflare для доставки статики
5. **Compression** - GZIP на сервере

### Database
```sql
-- Индексы для оптимизации
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_votes_post_id ON votes(post_id);
CREATE INDEX idx_posts_is_public ON posts(is_public);
```

---

## X. 📊 SEO Optimization

### Meta Tags Implementation
```html
<!-- Dynamic meta tags для каждого поста -->
<head>
  <title>{post.title} - ImageHost</title>
  <meta name="description" content="{post.description}" />
  <meta property="og:title" content="{post.title}" />
  <meta property="og:image" content="{post.image_url}" />
  <meta property="og:description" content="{post.description}" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:image" content="{post.image_url}" />
</head>
```

### Server-Side Rendering (Optional)
- Next.js для SSR/SSG версии
- Улучшенная индексируемость
- Быстрая первая загрузка

---

## XI. 🔒 Security Best Practices

1. **HTTPS только** - Шифрование всех данных
2. **CSRF Protection** - Tokens на формах
3. **XSS Prevention** - Санитизация HTML
4. **SQL Injection Prevention** - Parameterized queries
5. **Rate Limiting** - DDoS защита
6. **Input Validation** - На фронтенде и бэкенде
7. **Authentication** - JWT + Refresh tokens
8. **Authorization** - Role-based access control
9. **CORS** - Белый лист доменов
10. **Logging & Monitoring** - Аудит действий

---

## XII. 🔄 Deployment Architecture

### Production Deployment
```
┌──────────────────────┐
│   GitHub Actions     │ (CI/CD Pipeline)
│  (Testing, Build)    │
└──────────┬───────────┘
           │
    ┌──────▼──────┐
    │  Docker     │
    │  Images     │
    └──────┬──────┘
           │
    ┌──────▼────────────────────────┐
    │   AWS/DigitalOcean/Heroku     │
    │  ┌─────────────────────────┐  │
    │  │  Docker Containers      │  │
    │  │  (Load Balanced)        │  │
    │  │  • Frontend             │  │
    │  │  • Backend (x3)         │  │
    │  │  • Nginx Reverse Proxy  │  │
    │  └─────────────────────────┘  │
    │  ┌─────────────────────────┐  │
    │  │  Managed Services       │  │
    │  │  • PostgreSQL RDS       │  │
    │  │  • Redis Cluster        │  │
    │  │  • S3 Storage           │  │
    │  │  • CloudFront CDN       │  │
    │  └─────────────────────────┘  │
    └─────────────────────────────────┘
```

---

## XIII. 📈 Monitoring & Analytics

### Key Metrics
- **Performance** - Page Load Time, FCP, LCP
- **Availability** - Uptime, Error Rate
- **User Behavior** - Session duration, bounce rate
- **Infrastructure** - CPU, Memory, Disk usage
- **Database** - Query performance, connection pool

### Tools
- Sentry - Error tracking
- Datadog - Monitoring
- Google Analytics - User analytics
- New Relic - APM

---

## XIV. 📱 Responsive Design

### Breakpoints
```css
/* Mobile first approach */
$mobile: 320px;      /* Default */
$tablet: 768px;
$desktop: 1024px;
$wide: 1440px;

@media (min-width: $tablet) { /* Tablet and up */ }
@media (min-width: $desktop) { /* Desktop and up */ }
@media (min-width: $wide) { /* Wide screens */ }
```

### Adaptive Grid
```css
.image-grid {
  display: grid;
  gap: 1rem;
  
  /* Mobile: 1 column */
  grid-template-columns: 1fr;
  
  @media (min-width: 768px) {
    /* Tablet: 2 columns */
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    /* Desktop: 3 columns */
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1440px) {
    /* Wide: 4 columns */
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## XV. ⚙️ Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18+, React Router, Axios, Canvas API |
| **Styling** | CSS3, Tailwind CSS, SCSS |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL, Sequelize ORM |
| **Cache** | Redis |
| **Storage** | AWS S3 |
| **CDN** | Cloudflare |
| **Image Processing** | Sharp.js |
| **Authentication** | JWT, OAuth 2.0 |
| **Deployment** | Docker, GitHub Actions |
| **Monitoring** | Sentry, Datadog |

---

**Версия:** 1.0
**Дата:** 2025-11-29
**Статус:** Архитектурный документ в разработке
