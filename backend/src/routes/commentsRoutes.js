// src/routes/commentsRoutes.js - Маршруты комментариев

const express = require('express');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/comments
 * @desc    Создать комментарий
 * @access  Private
 */
router.post('/', authMiddleware, async (req, res) => {
  // TODO: Реализовать создание комментария
  res.status(201).json({
    success: true,
    message: 'Создание комментария - функция в разработке'
  });
});

/**
 * @route   PUT /api/comments/:id
 * @desc    Обновить комментарий
 * @access  Private
 */
router.put('/:id', authMiddleware, async (req, res) => {
  // TODO: Реализовать обновление комментария
  res.status(200).json({
    success: true,
    message: 'Обновление комментария - функция в разработке'
  });
});

/**
 * @route   DELETE /api/comments/:id
 * @desc    Удалить комментарий
 * @access  Private
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  // TODO: Реализовать удаление комментария
  res.status(204).send();
});

module.exports = router;
