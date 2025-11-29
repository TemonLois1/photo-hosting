'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Votes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      postId: {
        type: Sequelize.UUID,
        references: {
          model: 'Posts',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      commentId: {
        type: Sequelize.UUID,
        references: {
          model: 'Comments',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      type: {
        type: Sequelize.ENUM('upvote', 'downvote'),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });

    // Уникальное ограничение: пользователь может голосовать только один раз за пост или комментарий
    await queryInterface.addConstraint('Votes', {
      fields: ['userId', 'postId', 'commentId'],
      type: 'unique',
      name: 'unique_user_vote'
    });

    // Индексы для оптимизации запросов
    await queryInterface.addIndex('Votes', ['userId']);
    await queryInterface.addIndex('Votes', ['postId']);
    await queryInterface.addIndex('Votes', ['commentId']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Votes');
  }
};
