// src/middleware/authMiddleware.js - Аутентификация и авторизация

const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');
const env = require('../config/environment');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Требуется авторизация. Предоставьте JWT токен.'
        }
      });
    }

    // Верифицируем токен
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Токен истёк. Пожалуйста, обновите токен.'
        }
      });
    }

    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Невалидный токен'
      }
    });
  }
};

// Опциональная аутентификация (для публичных маршрутов)
const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      req.user = decoded;
    }
  } catch (err) {
    // Игнорируем ошибки для опциональной аутентификации
  }

  next();
};

module.exports = { authMiddleware, optionalAuth };
