// src/middleware/requestLogger.js - Логирование HTTP запросов

const logger = require('../utils/logger');

/**
 * Middleware для логирования всех входящих HTTP запросов
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Логируем запрос
  logger.info(`${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Логируем ответ после его отправки
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;

    if (status >= 400) {
      logger.warn(`${req.method} ${req.path} - ${status}`, {
        method: req.method,
        path: req.path,
        status,
        duration: `${duration}ms`,
      });
    } else {
      logger.info(`${req.method} ${req.path} - ${status}`, {
        method: req.method,
        path: req.path,
        status,
        duration: `${duration}ms`,
      });
    }
  });

  next();
};

module.exports = requestLogger;
