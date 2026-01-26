const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ClassLeader = sequelize.define('ClassLeader', {
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
      trim: true,
      comment: 'Year 1 Representative, Class Secretary'
    },
    yearOfStudy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 6
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      lowercase: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      trim: true
    },
    bio: {
      type: DataTypes.TEXT,
      trim: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      trim: true
    },
    socialAccounts: {
      type: DataTypes.JSON,
      defaultValue: {
        facebook: null,
        twitter: null,
        instagram: null,
        linkedin: null
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: true,
    indexes: [
      { fields: ['yearOfStudy', 'isActive'] },
      { fields: ['email'] }
    ]
  });

  return ClassLeader;
};
