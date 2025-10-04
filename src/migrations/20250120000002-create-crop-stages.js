'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('crop_stages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cropReportId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'crop_reports',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      stageName: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      stageOrder: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      stageDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      isCompleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('crop_stages');
  }
};
