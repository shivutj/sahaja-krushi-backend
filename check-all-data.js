const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: console.log
});

async function checkAllData() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database successfully\n');

    // Get all table names
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('📊 Available Tables:');
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`${index + 1}. ${tableName}`);
    });

    console.log('\n' + '='.repeat(50) + '\n');

    // Check each table for data
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`\n📋 Table: ${tableName}`);
      console.log('-'.repeat(30));
      
      try {
        const [data] = await sequelize.query(`SELECT * FROM ${tableName} LIMIT 10`);
        if (data.length === 0) {
          console.log('   No data found');
        } else {
          console.log(`   Found ${data.length} records:`);
          data.forEach((record, index) => {
            console.log(`   ${index + 1}.`, JSON.stringify(record, null, 2));
          });
        }
      } catch (error) {
        console.log(`   Error reading table: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkAllData();
