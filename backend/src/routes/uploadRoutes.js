// src/routes/uploadRoutes.js - Маршруты загрузки

const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/upload
 * @desc    Загрузить изображение
 * @access  Private
 */
router.post('/', authMiddleware, async (req, res) => {
  // TODO: Реализовать загрузку
  res.status(201).json({
    success: true,
    message: 'Загрузка - функция в разработке'
  });
});

/**
 * @route   POST /api/upload/process
 * @desc    Обработать изображение (редактирование)
 * @access  Private
 */
router.post('/process', authMiddleware, async (req, res) => {
  // TODO: Реализовать обработку
  res.status(200).json({
    success: true,
    message: 'Обработка изображения - функция в разработке'
  });
});

module.exports = router;
