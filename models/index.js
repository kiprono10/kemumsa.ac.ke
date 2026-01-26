const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/kemumsa', {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Import models
const Member = require('./Member')(sequelize);
const Event = require('./Event')(sequelize);
const Executive = require('./Executive')(sequelize);
const ClassLeader = require('./ClassLeader')(sequelize);
const Resource = require('./Resource')(sequelize);
const Message = require('./Message')(sequelize);
const Communication = require('./Communication')(sequelize);
const Admin = require('./Admin')(sequelize);

// Define associations
// Add any model associations here if needed
// Example: Member.hasMany(Message, { foreignKey: 'memberId' });

// Sync database
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('Database synchronized successfully');
  } catch (err) {
    console.error('Error synchronizing database:', err.message);
  }
};

// Export models and utilities
module.exports = {
  sequelize,
  Member,
  Event,
  Executive,
  ClassLeader,
  Resource,
  Message,
  Communication,
  Admin,
  syncDatabase
};
