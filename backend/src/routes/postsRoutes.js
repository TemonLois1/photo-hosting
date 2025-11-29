// src/routes/postsRoutes.js - Маршруты постов

const express = require('express');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');
const postController = require('../controllers/PostController');
const commentController = require('../controllers/CommentController');

const router = express.Router();

/**
 * @route   GET /api/posts
 * @desc    Получить ленту постов с пагинацией
 * @access  Public
 */
router.get('/', optionalAuth, postController.getFeed);

/**
 * @route   GET /api/posts/:id
 * @desc    Получить конкретный пост
 * @access  Public
 */
router.get('/:id', optionalAuth, postController.getPost);

/**
 * @route   GET /api/posts/:postId/comments
 * @desc    Получить комментарии к посту
 * @access  Public
 */
router.get('/:postId/comments', optionalAuth, commentController.getPostComments);

/**
 * @route   POST /api/posts
 * @desc    Создать новый пост
 * @access  Private
 */
router.post('/', authMiddleware, postController.createPost);

/**
 * @route   PUT /api/posts/:id
 * @desc    Обновить пост
 * @access  Private
 */
router.put('/:id', authMiddleware, async (req, res) => {
  // TODO: Реализовать обновление поста
  res.status(200).json({
    success: true,
    message: 'Обновление поста - функция в разработке'
  });
});

/**
 * @route   DELETE /api/posts/:id
 * @desc    Удалить пост
 * @access  Private
 */
router.delete('/:id', authMiddleware, postController.deletePost);

/**
 * @route   POST /api/posts/:id/upvote
 * @desc    Поставить лайк
 * @access  Private
 */
router.post('/:id/upvote', authMiddleware, async (req, res) => {
  // TODO: Реализовать лайк
  res.status(200).json({
    success: true,
    message: 'Лайк - функция в разработке'
  });
});

/**
 * @route   POST /api/posts/:id/downvote
 * @desc    Поставить дизлайк
 * @access  Private
 */
router.post('/:id/downvote', authMiddleware, async (req, res) => {
  // TODO: Реализовать дизлайк
  res.status(200).json({
    success: true,
    message: 'Дизлайк - функция в разработке'
  });
});

/**
 * @route   DELETE /api/posts/:id/vote
 * @desc    Отменить голос
 * @access  Private
 */
router.delete('/:id/vote', authMiddleware, async (req, res) => {
  // TODO: Реализовать отмену голоса
  res.status(200).json({
    success: true,
    message: 'Отмена голоса - функция в разработке'
  });
});

module.exports = router;
