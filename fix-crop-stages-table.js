const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: console.log
});

async function fixCropStagesTable() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database successfully');

    // Add missing columns to crop_stages table
    await sequelize.query(`
      ALTER TABLE crop_stages 
      ADD COLUMN stageOrder INT NOT NULL DEFAULT 1,
      ADD COLUMN isCompleted BOOLEAN NOT NULL DEFAULT FALSE
    `);
    console.log('Added missing columns to crop_stages table');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

fixCropStagesTable();
