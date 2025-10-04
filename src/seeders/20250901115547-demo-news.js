'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('News', [
      {
        title: 'Organic Farming Initiative',
        content: 'Farmers are now adopting organic practices to improve soil health and crop yield.',
        documentUrl: 'https://example.com/documents/organic-farming.pdf',
        documentName: 'organic-farming.pdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'New Government Scheme for Farmers',
        content: 'A new subsidy scheme has been launched to support small and marginal farmers.',
        documentUrl: 'https://example.com/documents/government-scheme.pdf',
        documentName: 'government-scheme.pdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Technology in Agriculture',
        content: 'The use of drones and IoT devices is revolutionizing modern agriculture.',
        documentUrl: 'https://example.com/documents/agri-tech.pdf',
        documentName: 'agri-tech.pdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('News', null, {});
  }
};
