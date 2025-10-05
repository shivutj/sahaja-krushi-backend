const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: console.log
});

async function checkNewsTable() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database successfully\n');

    // Check News table structure
    const [columns] = await sequelize.query('DESCRIBE News');
    console.log('News table columns:');
    columns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type})`);
    });

    // Check if there are any news items
    const [news] = await sequelize.query('SELECT * FROM News LIMIT 5');
    console.log('\nExisting news items:');
    console.log(news);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkNewsTable();
