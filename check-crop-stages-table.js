const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: console.log
});

async function checkCropStagesTable() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database successfully\n');

    // Check crop_stages table structure
    const [columns] = await sequelize.query('DESCRIBE crop_stages');
    console.log('Crop Stages table columns:');
    columns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type})`);
    });

    // Check if there are any crop stages
    const [stages] = await sequelize.query('SELECT * FROM crop_stages LIMIT 5');
    console.log('\nExisting crop stages:');
    console.log(stages);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkCropStagesTable();
