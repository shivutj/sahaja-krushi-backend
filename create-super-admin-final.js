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

    // Insert super admin user with all required fields
    await sequelize.query(`
      INSERT INTO users (username, email, password, role, firstName, lastName, phone, address, district, state, postalCode, country, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, {
      replacements: [
        'superadmin',
        'superadmin@sahajakrushi.com',
        hashedPassword,
        'SUPER_ADMIN',
        'Super',
        'Admin',
        '9876543210',
        'Admin Office, Sahaja Krushi Headquarters',
        'Bangalore',
        'Karnataka',
        '560001',
        'India',
        true,
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
