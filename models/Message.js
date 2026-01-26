const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    sender: {
      type: DataTypes.JSON,
      defaultValue: {
        name: null,
        email: null,
        phone: null,
        memberId: null
      }
    },
    subject: DataTypes.STRING,
    message: DataTypes.TEXT,
    category: {
      type: DataTypes.ENUM('membership', 'events', 'academic', 'partnership', 'general', 'feedback', 'other'),
      defaultValue: 'general'
    },
    status: {
      type: DataTypes.ENUM('new', 'viewed', 'replied'),
      defaultValue: 'new'
    },
    folder: {
      type: DataTypes.ENUM('inbox', 'viewed'),
      defaultValue: 'inbox'
    },
    adminReply: {
      type: DataTypes.JSON,
      defaultValue: {
        message: null,
        repliedAt: null,
        repliedBy: null
      }
    },
    newsletter: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    viewedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: true
  });

  return Message;
};
