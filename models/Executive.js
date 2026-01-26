const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Executive = sequelize.define('Executive', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      lowercase: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      trim: true
    },
    yearOfStudy: {
      type: DataTypes.INTEGER,
      validate: {
        min: 4,
        max: 6
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      trim: true
    },
    socialMedia: {
      type: DataTypes.JSON,
      defaultValue: {
        facebook: null,
        twitter: null,
        instagram: null,
        linkedin: null,
        whatsapp: null
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: true
  });

  return Executive;
};
