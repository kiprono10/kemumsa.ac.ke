const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Communication = sequelize.define('Communication', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    office: {
      type: DataTypes.JSON,
      defaultValue: {
        building: null,
        room: null,
        location: null
      }
    },
    officeHours: {
      type: DataTypes.JSON,
      defaultValue: {
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null
      }
    },
    responseTime: {
      type: DataTypes.STRING,
      defaultValue: 'Within 24 hours'
    },
    address: {
      type: DataTypes.JSON,
      defaultValue: {
        street: null,
        city: null,
        state: null,
        country: null
      }
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
    additionalInfo: DataTypes.TEXT,
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: true
  });

  return Communication;
};
