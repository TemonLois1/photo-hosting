// src/models/index.js - Инициализация и связи моделей

const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Tag = require('./Tag');
const Album = require('./Album');
const Vote = require('./Vote');
const Follow = require('./Follow');

// ========== ASSOCIATIONS ==========

// User - Post (One to Many)
User.hasMany(Post, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
Post.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author',
});

// User - Comment (One to Many)
User.hasMany(Comment, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
Comment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author',
});

// Post - Comment (One to Many)
Post.hasMany(Comment, {
  foreignKey: 'postId',
  onDelete: 'CASCADE',
});
Comment.belongsTo(Post, {
  foreignKey: 'postId',
});

// User - Album (One to Many)
User.hasMany(Album, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
Album.belongsTo(User, {
  foreignKey: 'userId',
  as: 'owner',
});

// User - Vote (One to Many)
User.hasMany(Vote, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
Vote.belongsTo(User, {
  foreignKey: 'userId',
});

// User - Follow (One to Many) - Follower
User.hasMany(Follow, {
  foreignKey: 'followerId',
  onDelete: 'CASCADE',
  as: 'followers',
});

// User - Follow (One to Many) - Following
User.hasMany(Follow, {
  foreignKey: 'followingId',
  onDelete: 'CASCADE',
  as: 'following',
});

Follow.belongsTo(User, {
  foreignKey: 'followerId',
  as: 'follower',
});

Follow.belongsTo(User, {
  foreignKey: 'followingId',
  as: 'followedUser',
});

// Post - Vote (One to Many)
Post.hasMany(Vote, {
  foreignKey: 'postId',
  onDelete: 'CASCADE',
});
Vote.belongsTo(Post, {
  foreignKey: 'postId',
});

// Comment - Vote (One to Many)
Comment.hasMany(Vote, {
  foreignKey: 'commentId',
  onDelete: 'CASCADE',
});
Vote.belongsTo(Comment, {
  foreignKey: 'commentId',
});

module.exports = {
  User,
  Post,
  Comment,
  Tag,
  Album,
  Vote,
  Follow,
};
