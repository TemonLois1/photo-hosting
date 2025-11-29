// src/routes/commentsRoutes.js - Маршруты комментариев

const express = require('express');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');
const commentController = require('../controllers/CommentController');

const router = express.Router();

/**
 * @route   GET /api/comments
 * @desc    Получить комментарии (обычно по postId)
 * @access  Public
 */
router.get('/', optionalAuth, commentController.getPostComments);

/**
 * @route   POST /api/comments
 * @desc    Создать комментарий
 * @access  Private
 */
router.post('/', authMiddleware, commentController.createComment);

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
router.delete('/:id', authMiddleware, commentController.deleteComment);

module.exports = router;
