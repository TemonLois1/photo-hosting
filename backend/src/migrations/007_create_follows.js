'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Follows', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      followerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      followingId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
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

    // Уникальное ограничение: пользователь не может подписаться на одного пользователя дважды
    await queryInterface.addConstraint('Follows', {
      fields: ['followerId', 'followingId'],
      type: 'unique',
      name: 'unique_follow_pair'
    });

    // Ограничение: пользователь не может подписаться на себя
    await queryInterface.addConstraint('Follows', {
      fields: ['followerId'],
      type: 'check',
      where: {
        followerId: Sequelize.where(
          Sequelize.col('followerId'),
          Sequelize.Op.ne,
          Sequelize.col('followingId')
        )
      },
      name: 'check_no_self_follow'
    });

    // Индексы для оптимизации запросов
    await queryInterface.addIndex('Follows', ['followerId']);
    await queryInterface.addIndex('Follows', ['followingId']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Follows');
  }
};
