// src/services/PostService.js

const { Post, User, Tag, Vote } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

class PostService {
  /**
   * Create a new post
   * @param {string} userId - ID of the author
   * @param {Object} postData - Post data (title, description, imageUrl, etc.)
   * @returns {Promise<Post>}
   */
  async createPost(userId, postData) {
    const post = await Post.create({
      ...postData,
      userId
    });
    
    return post;
  }

  /**
   * Get a single post by ID
   * @param {string} postId 
   * @returns {Promise<Post>}
   */
  async getPost(postId) {
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profileImage']
        },
        {
          model: Tag,
          as: 'tags',
          through: { attributes: [] }
        }
      ]
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // Increment views asynchronously
    post.increment('views');

    return post;
  }

  /**
   * Get public posts (Feed)
   * @param {Object} filters - Filters (sort, limit, offset)
   * @returns {Promise<Object>} - { posts, total }
   */
  async getPublicPosts({ sort = 'recent', limit = 12, offset = 0 }) {
    let order = [['createdAt', 'DESC']];

    if (sort === 'popular') {
      order = [['upvotes', 'DESC']];
    } else if (sort === 'trending') {
      // Simple trending logic: views + upvotes
      order = [['views', 'DESC']];
    }

    const { count, rows } = await Post.findAndCountAll({
      where: { isPublic: true },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profileImage']
        }
      ],
      order,
      limit,
      offset,
      distinct: true
    });

    return {
      posts: rows,
      total: count
    };
  }

  /**
   * Get posts by a specific user
   * @param {string} username 
   * @param {Object} options 
   * @returns {Promise<Object>}
   */
  async getUserPosts(username, { limit = 12, offset = 0 }) {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { count, rows } = await Post.findAndCountAll({
      where: { userId: user.id, isPublic: true },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profileImage']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    return {
      posts: rows,
      total: count
    };
  }

  /**
   * Delete a post
   * @param {string} postId 
   * @param {string} userId 
   */
  async deletePost(postId, userId) {
    const post = await Post.findByPk(postId);
    
    if (!post) {
      throw new AppError('Post not found', 404);
    }

    if (post.userId !== userId) {
      throw new AppError('You are not authorized to delete this post', 403);
    }

    await post.destroy();
    return true;
  }
}

module.exports = new PostService();
