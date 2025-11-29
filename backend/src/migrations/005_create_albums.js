'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Albums', {
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
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      coverImage: {
        type: Sequelize.STRING(1024),
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      postCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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

    // Индексы для оптимизации запросов
    await queryInterface.addIndex('Albums', ['userId']);
    await queryInterface.addIndex('Albums', ['isPublic']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Albums');
  }
};
