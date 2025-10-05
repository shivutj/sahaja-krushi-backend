const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: console.log
});

async function checkCropStagePhotosTable() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database successfully\n');

    // Check crop_stage_photos table structure
    const [columns] = await sequelize.query('DESCRIBE crop_stage_photos');
    console.log('Crop Stage Photos table columns:');
    columns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type})`);
    });

    // Check if there are any crop stage photos
    const [photos] = await sequelize.query('SELECT * FROM crop_stage_photos LIMIT 5');
    console.log('\nExisting crop stage photos:');
    console.log(photos);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkCropStagePhotosTable();
