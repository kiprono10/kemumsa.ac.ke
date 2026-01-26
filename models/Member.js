const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  yearOfStudy: {
    type: Number,
    min: 1,
    max: 6
  },
  department: {
    type: String,
    trim: true
  },
  studentId: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,
    trim: true
  },
  profileVisible: {
    type: Boolean,
    default: true
  },
  newsletter: {
    type: Boolean,
    default: false
  },
  interests: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['online', 'away', 'offline'],
    default: 'offline'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  joinedDate: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for frequently queried fields to improve performance
memberSchema.index({ profileVisible: 1, isActive: 1 });
memberSchema.index({ isActive: 1 });
memberSchema.index({ yearOfStudy: 1 });
// Note: email already has a unique index from the schema definition

module.exports = mongoose.model('Member', memberSchema);
