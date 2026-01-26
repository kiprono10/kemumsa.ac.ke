const mongoose = require('mongoose');

const executiveSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: /.+\@.+\..+/
  },
  phone: {
    type: String,
    trim: true
  },
  yearOfStudy: {
    type: Number,
    min: 4,
    max: 6
  },
  isActive: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  socialMedia: {
    type: Object,
    default: {
      facebook: null,
      twitter: null,
      instagram: null,
      linkedin: null,
      whatsapp: null
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Executive', executiveSchema);
