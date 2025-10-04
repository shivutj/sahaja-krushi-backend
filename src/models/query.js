module.exports = (sequelize, DataTypes) => {
  const Query = sequelize.define('Query', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    audioPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    videoPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('open', 'answered', 'closed', 'escalated'),
      defaultValue: 'open',
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    escalatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'queries',
    timestamps: true,
  });

  Query.associate = (models) => {
    Query.belongsTo(models.Farmer, {
      foreignKey: {
        name: 'farmerId',
        allowNull: false,
      },
      targetKey: 'id',
      as: 'farmer',
    });
  };

  return Query;
};
