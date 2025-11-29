// src/middleware/errorHandler.js - Обработчик ошибок

const logger = require('../utils/logger');

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  // Logging
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    statusCode
  });

  // Default error response
  if (!res.headersSent) {
    res.status(statusCode).json({
      success: false,
      error: {
        code: err.code || 'SERVER_ERROR',
        message: message || 'Внутренняя ошибка сервера',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      }
    });
  }
};

module.exports = errorHandler;
module.exports.AppError = AppError;
