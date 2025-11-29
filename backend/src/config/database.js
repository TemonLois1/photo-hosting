// src/config/database.js - Конфигурация базы данных

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Determine if we should use SQLite (fallback for local dev without Docker)
const useSqlite = process.env.DB_DIALECT === 'sqlite' || !process.env.DB_HOST;

const sequelize = useSqlite
  ? new Sequelize({
      dialect: 'sqlite',
      storage: './database.sqlite',
      logging: process.env.NODE_ENV === 'development' ? console.log : false
    })
  : new Sequelize(
      process.env.DB_NAME || 'photo_hosting',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 10,
          min: 2,
          acquire: 30000,
          idle: 10000,
        },
        retry: {
          max: 3,
          delay: 5000
        }
      }
    );

let isConnected = false;

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });
    isConnected = true;
    console.log('✅ Database connected successfully');
    return sequelize;
  } catch (err) {
    isConnected = false;
    console.warn('⚠️  Database connection failed:', err.message);
    console.warn('⚠️  Server will run without database. Some features may be unavailable.');
    return null;
  }
};

const getSequelize = () => sequelize;
const isDbConnected = () => isConnected;

module.exports = sequelize;
module.exports.initializeDatabase = initializeDatabase;
module.exports.getSequelize = getSequelize;
module.exports.isDbConnected = isDbConnected;
