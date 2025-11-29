// src/controllers/CommentController.js

const commentService = require('../services/CommentService');

class CommentController {
  /**
   * Create a comment
   */
  async createComment(req, res, next) {
    try {
      const userId = req.user.id;
      const { postId, text } = req.body;

      const comment = await commentService.createComment(userId, { postId, text });

      res.status(201).json({
        success: true,
        data: comment
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get comments for a post
   * Note: This might be called via /posts/:id/comments or /comments?postId=...
   */
  async getPostComments(req, res, next) {
    try {
      const { postId } = req.params; // Assuming route is /posts/:postId/comments
      // Or if it's a query param: const { postId } = req.query;
      
      // Let's support both for flexibility, but usually it's a sub-resource
      const targetPostId = postId || req.query.postId;

      if (!targetPostId) {
        return res.status(400).json({
          success: false,
          message: 'Post ID is required'
        });
      }

      const { limit, offset } = req.query;

      const result = await commentService.getPostComments(targetPostId, {
        limit: parseInt(limit) || 50,
        offset: parseInt(offset) || 0
      });

      res.status(200).json({
        success: true,
        data: result.comments,
        meta: {
          total: result.total
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await commentService.deleteComment(id, userId);

      res.status(200).json({
        success: true,
        message: 'Comment deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CommentController();
