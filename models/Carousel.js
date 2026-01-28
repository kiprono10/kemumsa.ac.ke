const mongoose = require('mongoose');

const carouselSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  imageType: {
    type: String,
    enum: ['student', 'event', 'activity', 'achievement'],
    default: 'event'
  },
  active: {
    type: Boolean,
    default: true,
    index: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: String,
    trim: true
  },
  aspectRatio: {
    type: String,
    enum: ['3:4', '4:3', '1:1', '9:16', '16:9'],
    default: '16:9'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for efficient queries
carouselSchema.index({ active: 1, displayOrder: 1 });

module.exports = mongoose.model('Carousel', carouselSchema);
