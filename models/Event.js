const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  organizer: {
    type: String,
    trim: true
  },
  maxAttendees: {
    type: Number,
    min: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPast: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    trim: true
  },
  media: [
    {
      type: String,
      trim: true
    }
  ],
  createdDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);
