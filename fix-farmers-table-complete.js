const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: console.log
});

async function fixFarmersTable() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database successfully');

    // Drop all foreign key constraints that reference farmers table
    try {
      await sequelize.query('ALTER TABLE crop_reports DROP FOREIGN KEY crop_reports_ibfk_1');
      console.log('Dropped crop_reports foreign key constraint');
    } catch (e) {
      console.log('crop_reports foreign key constraint not found or already dropped');
    }

    try {
      await sequelize.query('ALTER TABLE queries DROP FOREIGN KEY queries_ibfk_1');
      console.log('Dropped queries foreign key constraint');
    } catch (e) {
      console.log('queries foreign key constraint not found or already dropped');
    }

    // Drop the farmers table
    await sequelize.query('DROP TABLE IF EXISTS farmers');
    console.log('Dropped farmers table');

    // Recreate farmers table with correct schema
    await sequelize.query(`
      CREATE TABLE farmers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        farmerId VARCHAR(255) NOT NULL UNIQUE COMMENT 'Auto-generated farmer ID like FARMER-2025-001',
        fullName VARCHAR(255),
        dateOfBirth DATE NOT NULL,
        gender ENUM('Male', 'Female', 'Other'),
        aadharNumber VARCHAR(255) UNIQUE,
        contactNumber VARCHAR(255) NOT NULL UNIQUE,
        alternateContactNumber VARCHAR(255),
        email VARCHAR(255),
        address TEXT,
        state VARCHAR(255) DEFAULT 'Karnataka',
        district VARCHAR(255),
        village VARCHAR(255),
        pinCode VARCHAR(255),
        landSize DECIMAL(10,2) COMMENT 'Land size in acres',
        cropsGrown JSON COMMENT 'Array of crops grown',
        farmingType ENUM('Organic', 'Traditional', 'Hydroponic'),
        waterSource ENUM('Borewell', 'Canal', 'Rain-fed'),
        equipmentOwned JSON COMMENT 'Array of equipment owned',
        experienceYears INT COMMENT 'Farming experience in years',
        bankName VARCHAR(255),
        accountNumber VARCHAR(255),
        ifscCode VARCHAR(255),
        accountHolderName VARCHAR(255),
        isKycDone BOOLEAN NOT NULL DEFAULT FALSE,
        insuranceScheme VARCHAR(255),
        aadharCard VARCHAR(255) COMMENT 'File path for Aadhar card document',
        landProof VARCHAR(255) COMMENT 'File path for land ownership proof',
        bankPassbook VARCHAR(255) COMMENT 'File path for bank passbook',
        farmerIdCard VARCHAR(255) COMMENT 'File path for farmer ID card',
        isActive BOOLEAN DEFAULT TRUE,
        registrationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastLoginDate DATETIME,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )
    `);
    console.log('Created farmers table with correct schema');

    // Recreate foreign key constraints
    try {
      await sequelize.query(`
        ALTER TABLE crop_reports 
        ADD CONSTRAINT crop_reports_ibfk_1 
        FOREIGN KEY (farmerId) REFERENCES farmers(farmerId)
      `);
      console.log('Recreated crop_reports foreign key constraint');
    } catch (e) {
      console.log('Could not recreate crop_reports foreign key constraint:', e.message);
    }

    try {
      await sequelize.query(`
        ALTER TABLE queries 
        ADD CONSTRAINT queries_ibfk_1 
        FOREIGN KEY (farmerId) REFERENCES farmers(farmerId)
      `);
      console.log('Recreated queries foreign key constraint');
    } catch (e) {
      console.log('Could not recreate queries foreign key constraint:', e.message);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

fixFarmersTable();
