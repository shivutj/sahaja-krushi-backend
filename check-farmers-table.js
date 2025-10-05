const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: console.log
});

async function checkFarmersTable() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database successfully');

    // Check table structure
    const [columns] = await sequelize.query('DESCRIBE farmers');
    console.log('Farmers table columns:');
    columns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type})`);
    });

    // Check if there are any farmers
    const [farmers] = await sequelize.query('SELECT * FROM farmers LIMIT 5');
    console.log('\nExisting farmers:');
    console.log(farmers);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkFarmersTable();
