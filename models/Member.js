const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Member = sequelize.define('Member', {
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
        min: 1,
        max: 6
      }
    },
    department: {
      type: DataTypes.STRING,
      trim: true
    },
    studentId: {
      type: DataTypes.STRING,
      trim: true
    },
    password: {
      type: DataTypes.STRING,
      trim: true
    },
    profilePicture: {
      type: DataTypes.STRING,
      trim: true
    },
    profileVisible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    newsletter: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    interests: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    status: {
      type: DataTypes.ENUM('online', 'away', 'offline'),
      defaultValue: 'offline'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    joinedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: true,
    indexes: [
      { fields: ['profileVisible', 'isActive'] },
      { fields: ['isActive'] },
      { fields: ['yearOfStudy'] }
    ]
  });

  return Member;
};
