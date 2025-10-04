'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    
    await queryInterface.bulkInsert('users', [{
      username: 'superadmin',
      email: 'superadmin@sahajakrushi.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      firstName: 'Super',
      lastName: 'Admin',
      phone: '9876543210',
      address: 'Admin Office, Sahaja Krushi Headquarters',
      district: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
