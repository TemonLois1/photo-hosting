// src/utils/logger.js - Логирование

const fs = require('fs');
const path = require('path');
const env = require('../config/environment');

// Убедимся, что папка логов существует
const logsDir = path.dirname(env.LOG_FILE);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const logger = {
  log: (level, message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${JSON.stringify(message)}\n`;

    // Console output
    console.log(logMessage);

    // File output
    if (levels[level] <= levels[env.LOG_LEVEL]) {
      fs.appendFileSync(env.LOG_FILE, logMessage);
    }
  },

  error: (message) => logger.log('error', message),
  warn: (message) => logger.log('warn', message),
  info: (message) => logger.log('info', message),
  debug: (message) => logger.log('debug', message)
};

module.exports = logger;
