const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Farmer = sequelize.define('Farmer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    farmerId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Auto-generated farmer ID like FARMER-2025-001'
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
      allowNull: true
    },
    aadharNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      // Validation handled on frontend; no regex validation here
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // Validation handled on frontend
    },
    alternateContactNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Karnataka'
    },
    district: {
      type: DataTypes.STRING,
      allowNull: true
    },
    village: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pinCode: {
      type: DataTypes.STRING,
      allowNull: true,
      // Validation handled on frontend
    },
    landSize: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Land size in acres'
    },
    cropsGrown: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array of crops grown'
    },
    farmingType: {
      type: DataTypes.ENUM('Organic', 'Traditional', 'Hydroponic'),
      allowNull: true
    },
    waterSource: {
      type: DataTypes.ENUM('Borewell', 'Canal', 'Rain-fed'),
      allowNull: true
    },
    equipmentOwned: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array of equipment owned'
    },
    experienceYears: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Farming experience in years'
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ifscCode: {
      type: DataTypes.STRING,
      allowNull: true,
      // Validation handled on frontend
    },
    accountHolderName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isKycDone: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    insuranceScheme: {
      type: DataTypes.STRING,
      allowNull: true
    },
    aadharCard: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'File path for Aadhar card document'
    },
    landProof: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'File path for land ownership proof'
    },
    bankPassbook: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'File path for bank passbook'
    },
    farmerIdCard: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'File path for farmer ID card'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    registrationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    lastLoginDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'farmers',
    timestamps: true,
    hooks: {
      // Generate farmerId before validation so notNull constraint passes
      beforeValidate: async (farmer) => {
        if (!farmer.farmerId) {
          const year = new Date().getFullYear();
          const count = await sequelize.models.Farmer.count();
          const farmerId = `FARMER-${year}-${String(count + 1).padStart(3, '0')}`;
          farmer.farmerId = farmerId;
        }
      }
    }
  });

  return Farmer;
};
