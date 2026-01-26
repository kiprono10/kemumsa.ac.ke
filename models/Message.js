const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: Object,
    default: {
      name: null,
      email: null,
      phone: null,
      memberId: null
    }
  },
  subject: String,
  message: String,
  category: {
    type: String,
    enum: ['membership', 'events', 'academic', 'partnership', 'general', 'feedback', 'other'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['new', 'viewed', 'replied'],
    default: 'new'
  },
  folder: {
    type: String,
    enum: ['inbox', 'viewed'],
    default: 'inbox'
  },
  adminReply: {
    type: Object,
    default: {
      message: null,
      repliedAt: null,
      repliedBy: null
    }
  },
  newsletter: {
    type: Boolean,
    default: false
  },
  viewedAt: Date,
  deletedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
