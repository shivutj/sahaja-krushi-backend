module.exports = (sequelize, DataTypes) => {
  const CropStage = sequelize.define('CropStage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cropReportId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'crop_reports',
        key: 'id'
      }
    },
    stageName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    stageOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    stageDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  }, {
    tableName: 'crop_stages',
    timestamps: true,
  });

  CropStage.associate = (models) => {
    CropStage.belongsTo(models.CropReport, {
      foreignKey: 'cropReportId',
      as: 'cropReport',
    });
    
    CropStage.hasMany(models.CropStagePhoto, {
      foreignKey: 'cropStageId',
      as: 'photos',
    });
  };

  return CropStage;
};
