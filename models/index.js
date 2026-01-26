const mongoose = require('mongoose');
const path = require('path');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kemumsa';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Import models
const Member = require('./Member');
const Event = require('./Event');
const Executive = require('./Executive');
const ClassLeader = require('./ClassLeader');
const Resource = require('./Resource');
const Message = require('./Message');
const Communication = require('./Communication');
const Admin = require('./Admin');

// Sync database (create collections if they don't exist)
const syncDatabase = async (options = {}) => {
  try {
    // MongoDB collections are created automatically when first document is inserted
    console.log('Database synchronized successfully');
  } catch (err) {
    console.error('Error synchronizing database:', err.message);
  }
};

// Export models and utilities
module.exports = {
  mongoose,
  connectDB,
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
