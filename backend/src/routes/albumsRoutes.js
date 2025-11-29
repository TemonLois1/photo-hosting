// src/routes/albumsRoutes.js - Маршруты альбомов

const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/albums
 * @desc    Получить мои альбомы
 * @access  Private
 */
router.get('/', authMiddleware, async (req, res) => {
  // TODO: Реализовать получение альбомов
  res.status(200).json({
    success: true,
    message: 'Получение альбомов - функция в разработке',
    data: []
  });
});

/**
 * @route   POST /api/albums
 * @desc    Создать альбом
 * @access  Private
 */
router.post('/', authMiddleware, async (req, res) => {
  // TODO: Реализовать создание альбома
  res.status(201).json({
    success: true,
    message: 'Создание альбома - функция в разработке'
  });
});

/**
 * @route   POST /api/albums/:id/posts
 * @desc    Добавить пост в альбом
 * @access  Private
 */
router.post('/:id/posts', authMiddleware, async (req, res) => {
  // TODO: Реализовать добавление поста
  res.status(200).json({
    success: true,
    message: 'Добавление поста в альбом - функция в разработке'
  });
});

/**
 * @route   DELETE /api/albums/:id/posts/:postId
 * @desc    Удалить пост из альбома
 * @access  Private
 */
router.delete('/:id/posts/:postId', authMiddleware, async (req, res) => {
  // TODO: Реализовать удаление поста
  res.status(204).send();
});

module.exports = router;
