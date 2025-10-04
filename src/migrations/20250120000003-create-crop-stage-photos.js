'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('crop_stage_photos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cropStageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'crop_stages',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      photoPath: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      photoDescription: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      uploadedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('crop_stage_photos');
  }
};
