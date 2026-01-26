const mongoose = require('mongoose');

const classLeaderSchema = new mongoose.Schema({
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
  position: {
    type: String,
    required: true,
    trim: true
  },
  yearOfStudy: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
    index: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: /.+\@.+\..+/,
    index: true
  },
  phone: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  socialAccounts: {
    type: Object,
    default: {
      facebook: null,
      twitter: null,
      instagram: null,
      linkedin: null
    }
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, { timestamps: true });

classLeaderSchema.index({ yearOfStudy: 1, isActive: 1 });

module.exports = mongoose.model('ClassLeader', classLeaderSchema);
