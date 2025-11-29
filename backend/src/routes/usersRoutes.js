// src/routes/usersRoutes.js - Маршруты пользователей

const express = require('express');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/users/:username
 * @desc    Получить профиль пользователя
 * @access  Public
 */
router.get('/:username', optionalAuth, async (req, res) => {
  // TODO: Реализовать получение профиля
  res.status(200).json({
    success: true,
    message: 'Получение профиля - функция в разработке'
  });
});

/**
 * @route   GET /api/users/:username/posts
 * @desc    Получить посты пользователя
 * @access  Public
 */
router.get('/:username/posts', optionalAuth, async (req, res) => {
  // TODO: Реализовать получение постов пользователя
  res.status(200).json({
    success: true,
    message: 'Получение постов пользователя - функция в разработке',
    data: []
  });
});

/**
 * @route   PUT /api/users/:id
 * @desc    Обновить профиль пользователя
 * @access  Private
 */
router.put('/:id', authMiddleware, async (req, res) => {
  // TODO: Реализовать обновление профиля
  res.status(200).json({
    success: true,
    message: 'Обновление профиля - функция в разработке'
  });
});

/**
 * @route   POST /api/users/:id/follow
 * @desc    Подписаться на пользователя
 * @access  Private
 */
router.post('/:id/follow', authMiddleware, async (req, res) => {
  // TODO: Реализовать подписку
  res.status(200).json({
    success: true,
    message: 'Подписка - функция в разработке'
  });
});

/**
 * @route   DELETE /api/users/:id/follow
 * @desc    Отписаться от пользователя
 * @access  Private
 */
router.delete('/:id/follow', authMiddleware, async (req, res) => {
  // TODO: Реализовать отписку
  res.status(200).json({
    success: true,
    message: 'Отписка - функция в разработке'
  });
});

module.exports = router;
