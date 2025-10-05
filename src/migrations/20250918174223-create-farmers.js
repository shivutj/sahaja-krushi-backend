'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('farmers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      farmerId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'Auto-generated farmer ID like FARMER-2025-001'
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female', 'Other'),
        allowNull: true
      },
      aadharNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      contactNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      alternateContactNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Karnataka'
      },
      district: {
        type: Sequelize.STRING,
        allowNull: true
      },
      village: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pinCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      landSize: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Land size in acres'
      },
      cropsGrown: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of crops grown'
      },
      farmingType: {
        type: Sequelize.ENUM('Organic', 'Traditional', 'Hydroponic'),
        allowNull: true
      },
      waterSource: {
        type: Sequelize.ENUM('Borewell', 'Canal', 'Rain-fed'),
        allowNull: true
      },
      equipmentOwned: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of equipment owned'
      },
      experienceYears: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Farming experience in years'
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      accountNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ifscCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      accountHolderName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isKycDone: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      insuranceScheme: {
        type: Sequelize.STRING,
        allowNull: true
      },
      aadharCard: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'File path for Aadhar card document'
      },
      landProof: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'File path for land ownership proof'
      },
      bankPassbook: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'File path for bank passbook'
      },
      farmerIdCard: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'File path for farmer ID card'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      registrationDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      lastLoginDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('farmers');
  }
};
