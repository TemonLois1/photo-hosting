// src/controllers/PostController.js

const postService = require('../services/PostService');

class PostController {
  /**
   * Get public feed of posts
   */
  async getFeed(req, res, next) {
    try {
      const { sort, limit, offset } = req.query;
      
      const result = await postService.getPublicPosts({
        sort,
        limit: parseInt(limit) || 12,
        offset: parseInt(offset) || 0
      });

      res.status(200).json({
        success: true,
        data: result.posts,
        meta: {
          total: result.total,
          limit: parseInt(limit) || 12,
          offset: parseInt(offset) || 0
        }
      });
    } catch (error) {
      // Fallback for when DB is not connected (Development only)
      if (error.name === 'SequelizeConnectionError' || error.name === 'SequelizeConnectionRefusedError') {
        console.warn('Database connection failed, returning mock data');
        return res.status(200).json({
          success: true,
          data: [], // Return empty array or mock data
          message: 'Database unavailable, showing empty feed'
        });
      }
      next(error);
    }
  }

  /**
   * Get single post by ID
   */
  async getPost(req, res, next) {
    try {
      const { id } = req.params;
      const post = await postService.getPost(id);

      res.status(200).json({
        success: true,
        data: post
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new post
   */
  async createPost(req, res, next) {
    try {
      const userId = req.user.id;
      const postData = req.body;

      const post = await postService.createPost(userId, postData);

      res.status(201).json({
        success: true,
        data: post
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a post
   */
  async deletePost(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await postService.deletePost(id, userId);

      res.status(200).json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostController();
