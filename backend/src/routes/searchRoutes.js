// src/routes/searchRoutes.js - Маршруты поиска

const express = require('express');
const { optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/search
 * @desc    Глобальный поиск
 * @access  Public
 */
router.get('/', optionalAuth, async (req, res) => {
  // TODO: Реализовать поиск
  res.status(200).json({
    success: true,
    message: 'Поиск - функция в разработке',
    data: {
      posts: [],
      users: [],
      tags: []
    }
  });
});

module.exports = router;
