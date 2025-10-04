const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('SUPER_ADMIN', 'ADMIN'),
      allowNull: false,
      defaultValue: 'ADMIN'
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[6-9]\d{9}$/i
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[1-9][0-9]{5}$/i
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'India'
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
      allowNull: true
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  return User;
};
