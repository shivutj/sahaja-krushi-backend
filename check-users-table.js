const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: console.log
});

async function checkUsersTable() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database successfully');

    // Check table structure
    const [columns] = await sequelize.query('DESCRIBE users');
    console.log('Users table columns:');
    columns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type})`);
    });

    // Check if there are any users
    const [users] = await sequelize.query('SELECT * FROM users LIMIT 5');
    console.log('\nExisting users:');
    console.log(users);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkUsersTable();
