// src/routes/authRoutes.js - Маршруты аутентификации

const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Регистрация нового пользователя
 * @access  Public
 */
router.post('/register', async (req, res) => {
  // TODO: Реализовать регистрацию
  res.status(201).json({
    success: true,
    message: 'Регистрация - функция в разработке'
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Вход пользователя
 * @access  Public
 */
router.post('/login', async (req, res) => {
  // TODO: Реализовать вход
  res.status(200).json({
    success: true,
    message: 'Вход - функция в разработке'
  });
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Обновление токена
 * @access  Public
 */
router.post('/refresh', async (req, res) => {
  // TODO: Реализовать обновление токена
  res.status(200).json({
    success: true,
    message: 'Обновление токена - функция в разработке'
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Выход пользователя
 * @access  Private
 */
router.post('/logout', authMiddleware, async (req, res) => {
  // TODO: Реализовать выход
  res.status(200).json({
    success: true,
    message: 'Выход - функция в разработке'
  });
});

module.exports = router;
