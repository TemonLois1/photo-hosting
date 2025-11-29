// src/config/database.js - Конфигурация базы данных

const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize = null;
let isConnected = false;

const initializeDatabase = async () => {
  try {
    sequelize = new Sequelize(
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

    // Проверка подключения (с таймаутом)
    await Promise.race([
      sequelize.authenticate(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      )
    ]);
    
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

module.exports = { initializeDatabase, getSequelize, isDbConnected };
