const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: console.log
});

async function fixCropStagePhotosTable() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database successfully');

    // Add missing columns to crop_stage_photos table
    await sequelize.query(`
      ALTER TABLE crop_stage_photos 
      ADD COLUMN photoDescription TEXT NULL,
      ADD COLUMN uploadedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    `);
    console.log('Added missing columns to crop_stage_photos table');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

fixCropStagePhotosTable();
