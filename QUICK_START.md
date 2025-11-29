# 🎯 Начало Работы - ImageHost

Добро пожаловать в проект ImageHost! Этот файл поможет вам быстро начать работу.

---

## ⚡ Самый Быстрый Старт (5 минут)

### 1. Убедитесь, что установлены требования

```bash
node --version  # должен быть 16+
npm --version   # должен быть 8+
```

### 2. Запустить Backend

```bash
cd backend
npm install
npm run dev
```

Сервер запустится на **http://localhost:5000**
Проверить: **http://localhost:5000/health**

### 3. Запустить Frontend (в новом терминале)

```bash
cd frontend
npm install
npm start
```

Приложение откроется на **http://localhost:3000**

---

## 🎓 Что Дальше?

### Прочитайте документацию в следующем порядке:

1. **[README.md](./README.md)** - Общий обзор проекта
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Полная архитектура
3. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Подробная установка
4. **[docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)** - API endpoints

---

## 📂 Структура Проекта

```
three/
├── backend/         # Express.js сервер
├── frontend/        # React приложение
├── docs/           # Документация
└── ARCHITECTURE.md # Полная архитектура
```

---

## 🛠️ Основные Файлы для Редактирования

### Backend (Node.js + Express)
- `backend/src/server.js` - Главный файл
- `backend/src/routes/` - API маршруты
- `backend/src/middleware/` - Middleware
- `backend/src/config/environment.js` - Конфиг

### Frontend (React)
- `frontend/src/App.jsx` - Главный компонент
- `frontend/src/pages/` - Страницы
- `frontend/src/components/` - Компоненты
- `frontend/src/utils/api.js` - API клиент

---

## 🚀 Основные API Routes

### ✅ Уже готовы к использованию:

**Аутентификация:**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

**Посты:**
- `GET /api/posts` - Получить ленту
- `POST /api/posts` - Создать пост
- `GET /api/posts/:id` - Получить пост
- `PUT /api/posts/:id` - Обновить
- `DELETE /api/posts/:id` - Удалить

**Пользователи:**
- `GET /api/users/:username` - Профиль
- `POST /api/users/:id/follow` - Подписаться

И еще 20+ endpoints... см. [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)

---

## 📝 Что Нужно Сделать

### Backend (TODO)

- [ ] Реализовать Auth сервис (JWT)
- [ ] Подключить PostgreSQL
- [ ] Создать модели Sequelize
- [ ] Реализовать Posts сервис
- [ ] Интегрировать AWS S3
- [ ] Настроить Redis кэширование
- [ ] Добавить email отправку
- [ ] Написать unit тесты

### Frontend (TODO)

- [ ] Создать компоненты для Gallery
- [ ] Реализовать Upload с Drag & Drop
- [ ] Создать Image Editor (Canvas)
- [ ] Реализовать Comments раздел
- [ ] Создать Profile страницу
- [ ] Добавить Search функцию
- [ ] Реализовать Infinite Scroll
- [ ] Dark/Light mode
- [ ] PWA поддержка
- [ ] Unit тесты

---

## 🔑 Ключевые Концепции

### Backend

```javascript
// Структура запроса
GET /api/posts?page=1&limit=20

// Структура ответа
{
  success: true,
  data: [...],
  pagination: { page, limit, total }
}

// Ошибки
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Error description"
  }
}
```

### Frontend

```javascript
// API клиент
import { api } from './utils/api';

// Использование
const posts = await api.getPosts({ page: 1, limit: 20 });
```

---

## 💾 Переменные Окружения

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=imagehost_db
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-secret-key
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🐛 Решение Проблем

### Backend не запускается?

```bash
# Проверьте, что Node установлен
node --version

# Переустановите зависимости
rm -rf node_modules package-lock.json
npm install

# Проверьте порт 5000 не занят
netstat -ano | findstr :5000
```

### Frontend не загружается?

```bash
# Очистите кэш
npm cache clean --force

# Переустановите зависимости
rm -rf node_modules
npm install

# Проверьте, запущен ли backend
curl http://localhost:5000/health
```

### Проблемы с БД?

```bash
# Убедитесь, что PostgreSQL запущен
# Создайте БД
createdb imagehost_db

# Или через psql
psql -U postgres
CREATE DATABASE imagehost_db;
```

---

## 📚 Рекомендуемые Расширения VS Code

1. **ES7+ React/Redux snippets** - Для быстрого написания React кода
2. **ESLint** - Проверка кода
3. **Prettier** - Форматирование кода
4. **REST Client** - Тестирование API
5. **Thunder Client** - Альтернатива для Postman
6. **GitLens** - Git интеграция

---

## 🎨 Примеры Кода

### Создание Post (Backend)

```javascript
// src/routes/postsRoutes.js
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, image_url } = req.body;
  
  // Валидация
  if (!title || !image_url) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Missing fields' }
    });
  }

  // Создание поста
  try {
    const post = await Post.create({
      user_id: req.user.id,
      title,
      description,
      image_url
    });

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
});
```

### Использование API (Frontend)

```javascript
// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await api.getPosts({ page: 1, limit: 20 });
        setPosts(response.data.data);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  return (
    <div>
      {loading ? <p>Loading...</p> : <p>Found {posts.length} posts</p>}
    </div>
  );
}

export default Home;
```

---

## 🚢 Развертывание (Будущее)

Проект готов к развертыванию на:
- **Heroku** - PaaS
- **AWS** - EC2 + RDS + S3
- **DigitalOcean** - Droplets + Spaces
- **Railway** - Простой PaaS
- **Docker** - Контейнеризация

---

## 📞 Вопросы и Поддержка

- 📖 Docs: [docs/README.md](./docs/README.md)
- 🏗️ Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)
- 🔌 API: [docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)
- ⚙️ Setup: [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## 🎯 Ближайшие Шаги

### День 1
- [ ] Прочитать документацию
- [ ] Запустить backend и frontend
- [ ] Проверить API endpoints через Postman/Thunder Client

### День 2-3
- [ ] Начать с Auth сервиса (login/register)
- [ ] Реализовать базовые CRUD операции для постов
- [ ] Подключить PostgreSQL

### День 4-5
- [ ] Добавить загрузку изображений
- [ ] Интегрировать AWS S3
- [ ] Реализовать кэширование Redis

### День 6+
- [ ] Advanced функции (комментарии, лайки, поиск)
- [ ] Фронтенд UI/UX
- [ ] Тестирование
- [ ] Развертывание

---

## 🎓 Обучающие Ресурсы

- [Express.js Docs](https://expressjs.com/)
- [React Official Docs](https://react.dev/)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [REST API Best Practices](https://restfulapi.net/)
- [JWT Introduction](https://jwt.io/introduction)

---

## ✨ Удачи!

Вы готовы начать разработку. Если у вас есть вопросы, обратитесь к документации или создайте issue в GitHub.

**Версия:** 1.0  
**Дата:** 2025-11-29  
**Статус:** 🚀 Ready to develop!
