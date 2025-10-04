module.exports = (sequelize, DataTypes) => {
  const CropStagePhoto = sequelize.define('CropStagePhoto', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cropStageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'crop_stages',
        key: 'id'
      }
    },
    photoPath: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    photoDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    uploadedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'crop_stage_photos',
    timestamps: false,
  });

  CropStagePhoto.associate = (models) => {
    CropStagePhoto.belongsTo(models.CropStage, {
      foreignKey: 'cropStageId',
      as: 'cropStage',
    });
  };

  return CropStagePhoto;
};
