const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: console.log
});

async function fixNewsTable() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database successfully');

    // Add missing columns to News table
    await sequelize.query(`
      ALTER TABLE News 
      ADD COLUMN documentUrl VARCHAR(500) NULL,
      ADD COLUMN documentName VARCHAR(255) NULL
    `);
    console.log('Added missing columns to News table');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

fixNewsTable();
