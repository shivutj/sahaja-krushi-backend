module.exports = (sequelize, DataTypes) => {
  const CropReport = sequelize.define('CropReport', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    farmerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'farmers',
        key: 'id'
      }
    },
    cropName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cropType: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    areaHectares: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    plantingDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    expectedHarvestDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'abandoned'),
      defaultValue: 'active',
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'crop_reports',
    timestamps: true,
  });

  CropReport.associate = (models) => {
    CropReport.belongsTo(models.Farmer, {
      foreignKey: 'farmerId',
      as: 'farmer',
    });
    
    CropReport.hasMany(models.CropStage, {
      foreignKey: 'cropReportId',
      as: 'stages',
    });
  };

  return CropReport;
};
