const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: console.log
});

async function createSuperAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database successfully');

    // Check if super admin already exists
    const [existingUser] = await sequelize.query(
      "SELECT * FROM users WHERE email = 'superadmin@sahajakrushi.com'",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingUser) {
      console.log('Super admin already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('superadmin123', 10);

    // Insert super admin user with correct columns
    await sequelize.query(`
      INSERT INTO users (name, email, password, role, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `, {
      replacements: [
        'Super Admin',
        'superadmin@sahajakrushi.com',
        hashedPassword,
        'admin', // Using 'admin' since that's what the enum allows
        new Date(),
        new Date()
      ]
    });

    console.log('Super admin created successfully');
  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await sequelize.close();
  }
}

createSuperAdmin();
