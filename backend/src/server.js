// src/server.js - Основной файл приложения

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();
require('express-async-errors');

// Импорт middleware и routes
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

// Импорт routes
const authRoutes = require('./routes/authRoutes');
const postsRoutes = require('./routes/postsRoutes');
const commentsRoutes = require('./routes/commentsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const tagsRoutes = require('./routes/tagsRoutes');
const albumsRoutes = require('./routes/albumsRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();

// ========== SECURITY & PERFORMANCE MIDDLEWARE ==========

// Helmet для безопасности HTTP заголовков
app.use(helmet());

// Compression для сжатия ответов
app.use(compression());

// CORS конфигурация
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ========== RATE LIMITING ==========

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // 100 запросов на IP
  message: 'Слишком много запросов с этого IP, пожалуйста попробуйте позже.'
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  max: 50, // 50 загрузок в час
  skipSuccessfulRequests: true
});

app.use('/api/', limiter);
app.use('/api/upload', uploadLimiter);

// ========== REQUEST LOGGING ==========

app.use(requestLogger);

// ========== HEALTH CHECK ==========

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ========== API ROUTES ==========

// Аутентификация
app.use('/api/auth', authRoutes);

// Посты
app.use('/api/posts', postsRoutes);

// Комментарии
app.use('/api/comments', commentsRoutes);

// Пользователи
app.use('/api/users', usersRoutes);

// Загрузка
app.use('/api/upload', uploadRoutes);

// Теги
app.use('/api/tags', tagsRoutes);

// Альбомы/Коллекции
app.use('/api/albums', albumsRoutes);

// Поиск
app.use('/api/search', searchRoutes);

// ========== 404 HANDLER ==========

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Маршрут ${req.method} ${req.originalUrl} не найден`
    }
  });
});

// ========== ERROR HANDLING MIDDLEWARE ==========

app.use(errorHandler);

// ========== SERVER STARTUP ==========

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  🚀 Server is running!
  📍 Listening on port ${PORT}
  🌍 Environment: ${process.env.NODE_ENV || 'development'}
  🔗 API URL: ${process.env.API_URL || `http://localhost:${PORT}`}
  `);
});

// ========== GRACEFUL SHUTDOWN ==========

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
