const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: console.log
});

async function fixCropReportsTable() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database successfully');

    // Add missing columns to crop_reports table
    await sequelize.query(`
      ALTER TABLE crop_reports 
      ADD COLUMN cropType VARCHAR(100) NULL,
      ADD COLUMN areaHectares DECIMAL(10,2) NULL,
      ADD COLUMN description TEXT NULL
    `);
    console.log('Added missing columns to crop_reports table');

    // Update the status enum to match the model
    await sequelize.query(`
      ALTER TABLE crop_reports 
      MODIFY COLUMN status ENUM('active', 'completed', 'abandoned') NOT NULL DEFAULT 'active'
    `);
    console.log('Updated status enum in crop_reports table');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

fixCropReportsTable();
