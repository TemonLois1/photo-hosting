// src/routes/tagsRoutes.js - Маршруты тегов

const express = require('express');
const { optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/tags
 * @desc    Получить популярные теги
 * @access  Public
 */
router.get('/', optionalAuth, async (req, res) => {
  // TODO: Реализовать получение тегов
  res.status(200).json({
    success: true,
    message: 'Получение тегов - функция в разработке',
    data: []
  });
});

/**
 * @route   GET /api/tags/:name
 * @desc    Получить посты с определенным тегом
 * @access  Public
 */
router.get('/:name', optionalAuth, async (req, res) => {
  // TODO: Реализовать получение постов по тегу
  res.status(200).json({
    success: true,
    message: 'Получение постов по тегу - функция в разработке',
    data: []
  });
});

module.exports = router;
