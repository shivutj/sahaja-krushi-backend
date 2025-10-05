const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: console.log
});

async function checkCropReportsTable() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database successfully\n');

    // Check crop_reports table structure
    const [columns] = await sequelize.query('DESCRIBE crop_reports');
    console.log('Crop Reports table columns:');
    columns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type})`);
    });

    // Check if there are any crop reports
    const [reports] = await sequelize.query('SELECT * FROM crop_reports LIMIT 5');
    console.log('\nExisting crop reports:');
    console.log(reports);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkCropReportsTable();
