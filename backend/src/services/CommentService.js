// src/services/CommentService.js

const { Comment, User } = require('../models');
const { AppError } = require('../middleware/errorHandler');

class CommentService {
  /**
   * Create a new comment
   * @param {string} userId 
   * @param {Object} data 
   * @returns {Promise<Comment>}
   */
  async createComment(userId, { postId, text }) {
    const comment = await Comment.create({
      userId,
      postId,
      text
    });

    // Fetch with author info to return complete object
    return await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profileImage']
        }
      ]
    });
  }

  /**
   * Get comments for a post
   * @param {string} postId 
   * @param {Object} options 
   * @returns {Promise<Object>}
   */
  async getPostComments(postId, { limit = 50, offset = 0 }) {
    const { count, rows } = await Comment.findAndCountAll({
      where: { postId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profileImage']
        }
      ],
      order: [['createdAt', 'ASC']], // Oldest first usually for comments
      limit,
      offset
    });

    return {
      comments: rows,
      total: count
    };
  }

  /**
   * Delete a comment
   * @param {string} commentId 
   * @param {string} userId 
   */
  async deleteComment(commentId, userId) {
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.userId !== userId) {
      throw new AppError('You are not authorized to delete this comment', 403);
    }

    await comment.destroy();
    return true;
  }
}

module.exports = new CommentService();
