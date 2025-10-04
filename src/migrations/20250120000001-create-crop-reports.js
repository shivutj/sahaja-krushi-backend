'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('crop_reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      farmerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'farmers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cropName: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      cropType: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      areaHectares: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      plantingDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      expectedHarvestDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'completed', 'abandoned'),
        defaultValue: 'active',
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
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
    await queryInterface.dropTable('crop_reports');
  }
};
