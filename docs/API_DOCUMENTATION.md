# 📚 API Documentation - ImageHost (Фотохостинг)

## Базовая Информация

**Base URL:** `https://api.imagehost.com/api`  
**Version:** v1  
**Authentication:** JWT Bearer Token  
**Response Format:** JSON  
**Rate Limit:** 100 requests/15 minutes per IP

---

## 🔐 Аутентификация

### POST /auth/register
Регистрация нового пользователя

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "avatar_url": null,
    "created_at": "2025-11-29T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400 Bad Request` - Валидация не пройдена
- `409 Conflict` - Email или username уже используются

---

### POST /auth/login
Вход пользователя

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `401 Unauthorized` - Неверные пароль или email
- `404 Not Found` - Пользователь не найден

---

### POST /auth/refresh
Обновление access токена

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### POST /auth/logout
Выход пользователя

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 📸 Посты (Posts)

### GET /posts
Получить ленту постов с пагинацией

**Query Parameters:**
- `page` (number, default: 1) - Номер страницы
- `limit` (number, default: 20, max: 100) - Постов на странице
- `sort` (string, default: 'created_at') - Сортировка: 'created_at', 'views', 'votes'
- `timeframe` (string) - Фильтр по времени: 'today', 'week', 'month', 'all'
- `tag` (string) - Фильтр по тегу
- `search` (string) - Поиск по названию/описанию

**Example Request:**
```
GET /posts?page=1&limit=20&sort=votes&timeframe=today
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Amazing Sunset",
      "description": "Beautiful sunset at the beach",
      "image_url": "https://cdn.imagehost.com/originals/1/1/sunset.jpg",
      "thumbnail_url": "https://cdn.imagehost.com/thumbnails/1/1/sunset_thumb.jpg",
      "user": {
        "id": 1,
        "username": "john_doe",
        "avatar_url": "https://cdn.imagehost.com/avatars/1/avatar.jpg"
      },
      "views_count": 1250,
      "votes_count": 342,
      "user_vote": 1,
      "comments_count": 45,
      "tags": ["nature", "sunset", "photography"],
      "is_public": true,
      "created_at": "2025-11-29T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5000,
    "pages": 250
  }
}
```

---

### GET /posts/:id
Получить информацию о конкретном посте

**Example Request:**
```
GET /posts/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Amazing Sunset",
    "description": "Beautiful sunset at the beach",
    "image_url": "https://cdn.imagehost.com/originals/1/1/sunset.jpg",
    "image_width": 1920,
    "image_height": 1080,
    "file_size": 2048576,
    "user": {
      "id": 1,
      "username": "john_doe",
      "avatar_url": "https://cdn.imagehost.com/avatars/1/avatar.jpg",
      "followers_count": 5000
    },
    "views_count": 1250,
    "votes_count": 342,
    "user_vote": 1,
    "comments_count": 45,
    "tags": ["nature", "sunset", "photography"],
    "is_public": true,
    "created_at": "2025-11-29T10:00:00Z",
    "updated_at": "2025-11-29T12:00:00Z"
  }
}
```

**Errors:**
- `404 Not Found` - Пост не найден

---

### POST /posts
Создать новый пост

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "title": "Amazing Sunset",
  "description": "Beautiful sunset at the beach",
  "image_url": "https://cdn.imagehost.com/originals/1/1/sunset.jpg",
  "tags": ["nature", "sunset"],
  "is_public": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Amazing Sunset",
    "description": "Beautiful sunset at the beach",
    "image_url": "https://cdn.imagehost.com/originals/1/1/sunset.jpg",
    "tags": ["nature", "sunset"],
    "is_public": true,
    "created_at": "2025-11-29T10:00:00Z"
  }
}
```

**Errors:**
- `401 Unauthorized` - Пользователь не авторизован
- `400 Bad Request` - Невалидные данные

---

### PUT /posts/:id
Обновить пост

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "tags": ["nature", "landscape"],
  "is_public": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Title",
    "description": "Updated description",
    "tags": ["nature", "landscape"],
    "is_public": true,
    "updated_at": "2025-11-29T11:00:00Z"
  }
}
```

**Errors:**
- `401 Unauthorized` - Пользователь не авторизован
- `403 Forbidden` - Не владелец поста
- `404 Not Found` - Пост не найден

---

### DELETE /posts/:id
Удалить пост

**Headers:** `Authorization: Bearer {token}`

**Response (204 No Content):** (Успешное удаление)

**Errors:**
- `401 Unauthorized` - Пользователь не авторизован
- `403 Forbidden` - Не владелец поста
- `404 Not Found` - Пост не найден

---

## 👍 Голосование (Votes)

### POST /posts/:id/upvote
Поставить лайк (upvote)

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "post_id": 1,
    "vote_type": "upvote",
    "votes_count": 343
  }
}
```

**Errors:**
- `401 Unauthorized` - Пользователь не авторизован
- `404 Not Found` - Пост не найден

---

### POST /posts/:id/downvote
Поставить дизлайк (downvote)

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "post_id": 1,
    "vote_type": "downvote",
    "votes_count": 341
  }
}
```

---

### DELETE /posts/:id/vote
Отменить голос

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "post_id": 1,
    "votes_count": 342
  }
}
```

---

## 💬 Комментарии (Comments)

### GET /posts/:postId/comments
Получить комментарии к посту

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `sort` (string, default: 'recent') - 'recent', 'oldest', 'top'

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "post_id": 1,
      "user": {
        "id": 2,
        "username": "jane_doe",
        "avatar_url": "https://cdn.imagehost.com/avatars/2/avatar.jpg"
      },
      "content": "Amazing photo! Love the colors!",
      "votes_count": 12,
      "user_vote": 1,
      "replies_count": 3,
      "created_at": "2025-11-29T10:30:00Z",
      "replies": [
        {
          "id": 2,
          "parent_comment_id": 1,
          "user": {
            "id": 1,
            "username": "john_doe",
            "avatar_url": "https://cdn.imagehost.com/avatars/1/avatar.jpg"
          },
          "content": "Thanks! Taken with my new camera",
          "votes_count": 5,
          "created_at": "2025-11-29T10:45:00Z"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

---

### POST /comments
Создать комментарий

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "post_id": 1,
  "parent_comment_id": null,
  "content": "Amazing photo! Love the colors!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "post_id": 1,
    "user": {
      "id": 2,
      "username": "jane_doe",
      "avatar_url": "https://cdn.imagehost.com/avatars/2/avatar.jpg"
    },
    "content": "Amazing photo! Love the colors!",
    "created_at": "2025-11-29T10:30:00Z"
  }
}
```

---

### PUT /comments/:id
Обновить комментарий

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "content": "Updated comment text"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "content": "Updated comment text",
    "updated_at": "2025-11-29T11:00:00Z"
  }
}
```

---

### DELETE /comments/:id
Удалить комментарий

**Headers:** `Authorization: Bearer {token}`

**Response (204 No Content):** (Успешное удаление)

---

## 👤 Пользователи (Users)

### GET /users/:username
Получить профиль пользователя

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "avatar_url": "https://cdn.imagehost.com/avatars/1/avatar.jpg",
    "bio": "Photography enthusiast",
    "followers_count": 5000,
    "following_count": 342,
    "posts_count": 156,
    "is_following": false,
    "created_at": "2025-11-29T10:00:00Z"
  }
}
```

---

### GET /users/:username/posts
Получить посты пользователя

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `sort` (string, default: 'created_at')

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Amazing Sunset",
      "thumbnail_url": "https://cdn.imagehost.com/thumbnails/1/1/sunset_thumb.jpg",
      "views_count": 1250,
      "votes_count": 342,
      "created_at": "2025-11-29T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156
  }
}
```

---

### PUT /users/:id
Обновить профиль пользователя

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "bio": "Updated bio",
  "avatar_url": "https://cdn.imagehost.com/avatars/1/avatar.jpg"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "bio": "Updated bio",
    "avatar_url": "https://cdn.imagehost.com/avatars/1/avatar.jpg",
    "updated_at": "2025-11-29T11:00:00Z"
  }
}
```

---

### POST /users/:id/follow
Подписаться на пользователя

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "is_following": true,
    "followers_count": 5001
  }
}
```

---

### DELETE /users/:id/follow
Отписаться от пользователя

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "is_following": false,
    "followers_count": 5000
  }
}
```

---

## 📤 Загрузка (Upload)

### POST /upload
Загрузить изображение

**Headers:**
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file` (file, required) - Изображение (JPEG, PNG, GIF, WebP)
- `title` (string, optional)
- `description` (string, optional)
- `tags` (array, optional)

**Example with cURL:**
```bash
curl -X POST https://api.imagehost.com/api/upload \
  -H "Authorization: Bearer {token}" \
  -F "file=@image.jpg" \
  -F "title=My Photo" \
  -F "description=A beautiful photo" \
  -F "tags=nature,photography"
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "original_filename": "image.jpg",
    "image_url": "https://cdn.imagehost.com/originals/1/1/image.jpg",
    "thumbnail_url": "https://cdn.imagehost.com/thumbnails/1/1/image_thumb.jpg",
    "medium_url": "https://cdn.imagehost.com/medium/1/1/image_medium.jpg",
    "image_width": 1920,
    "image_height": 1080,
    "file_size": 2048576,
    "upload_progress": 100
  }
}
```

**Errors:**
- `400 Bad Request` - Невалидный файл
- `413 Payload Too Large` - Файл слишком большой (макс: 50MB)
- `415 Unsupported Media Type` - Неподдерживаемый формат

---

### POST /upload/process
Обработать изображение (редактирование)

**Headers:**
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Request:**
```json
{
  "image_url": "https://cdn.imagehost.com/originals/1/1/image.jpg",
  "operations": [
    {
      "type": "crop",
      "x": 0,
      "y": 0,
      "width": 800,
      "height": 600
    },
    {
      "type": "rotate",
      "degrees": 90
    },
    {
      "type": "watermark",
      "text": "© 2025"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "processed_url": "https://cdn.imagehost.com/originals/1/1/image_processed.jpg",
    "width": 800,
    "height": 600
  }
}
```

---

## 📚 Коллекции/Альбомы (Collections)

### GET /albums
Получить мои альбомы

**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Vacation Photos",
      "description": "Photos from my summer vacation",
      "posts_count": 25,
      "thumbnail_url": "https://cdn.imagehost.com/thumbnails/1/1/vacation_thumb.jpg",
      "is_public": true,
      "created_at": "2025-11-29T10:00:00Z"
    }
  ]
}
```

---

### POST /albums
Создать альбом

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "title": "Vacation Photos",
  "description": "Photos from my summer vacation",
  "is_public": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Vacation Photos",
    "description": "Photos from my summer vacation",
    "is_public": true,
    "created_at": "2025-11-29T10:00:00Z"
  }
}
```

---

### POST /albums/:id/posts
Добавить пост в альбом

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "post_id": 1
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "album_id": 1,
    "post_id": 1,
    "posts_count": 26
  }
}
```

---

### DELETE /albums/:id/posts/:postId
Удалить пост из альбома

**Headers:** `Authorization: Bearer {token}`

**Response (204 No Content):** (Успешное удаление)

---

## 🏷️ Теги (Tags)

### GET /tags
Получить популярные теги

**Query Parameters:**
- `limit` (number, default: 50)
- `sort` (string, default: 'popular') - 'popular', 'recent'

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "nature",
      "posts_count": 5000,
      "popularity_score": 9.8
    },
    {
      "id": 2,
      "name": "photography",
      "posts_count": 4500,
      "popularity_score": 9.5
    }
  ]
}
```

---

### GET /tags/:name
Получить посты с определенным тегом

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Amazing Sunset",
      "thumbnail_url": "https://cdn.imagehost.com/thumbnails/1/1/sunset_thumb.jpg",
      "views_count": 1250,
      "votes_count": 342,
      "created_at": "2025-11-29T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5000
  }
}
```

---

## 🔍 Поиск (Search)

### GET /search
Глобальный поиск

**Query Parameters:**
- `q` (string, required) - Поисковый запрос
- `type` (string, default: 'all') - 'posts', 'users', 'tags', 'all'
- `page` (number, default: 1)
- `limit` (number, default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "Amazing Sunset",
        "thumbnail_url": "https://cdn.imagehost.com/thumbnails/1/1/sunset_thumb.jpg"
      }
    ],
    "users": [
      {
        "id": 1,
        "username": "john_doe",
        "avatar_url": "https://cdn.imagehost.com/avatars/1/avatar.jpg"
      }
    ],
    "tags": [
      {
        "name": "sunset",
        "posts_count": 1200
      }
    ]
  }
}
```

---

## ⚠️ Error Responses

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|------------|-------------|
| `VALIDATION_ERROR` | 400 | Ошибка валидации данных |
| `UNAUTHORIZED` | 401 | Требуется авторизация |
| `FORBIDDEN` | 403 | Нет доступа к ресурсу |
| `NOT_FOUND` | 404 | Ресурс не найден |
| `CONFLICT` | 409 | Конфликт (например, дублирование) |
| `RATE_LIMIT` | 429 | Превышен лимит запросов |
| `SERVER_ERROR` | 500 | Внутренняя ошибка сервера |

---

## 📝 Authentication Example

**1. Регистрация и получение токена:**
```bash
curl -X POST https://api.imagehost.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

**2. Использование токена в защищенных запросах:**
```bash
curl -X POST https://api.imagehost.com/api/posts \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Photo",
    "description": "A beautiful photo",
    "tags": ["nature"]
  }'
```

---

**API Версия:** 1.0  
**Последнее обновление:** 2025-11-29  
**Статус:** Стабильная версия
