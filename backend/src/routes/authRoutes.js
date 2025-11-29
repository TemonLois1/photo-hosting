// src/routes/authRoutes.js - Маршруты аутентификации

const express = require('express');
const AuthController = require('../controllers/AuthController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Регистрация нового пользователя
 * @access  Public
 */
router.post('/register', AuthController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Вход пользователя
 * @access  Public
 */
router.post('/login', AuthController.login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Обновление токена
 * @access  Public
 */
router.post('/refresh', AuthController.refresh);

/**
 * @route   POST /api/auth/logout
 * @desc    Выход пользователя
 * @access  Private
 */
router.post('/logout', authMiddleware, AuthController.logout);

module.exports = router;
