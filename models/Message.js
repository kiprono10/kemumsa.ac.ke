const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        name: String,
        email: String,
        phone: String,
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member'
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
        message: String,
        repliedAt: Date,
        repliedBy: String
    },
    newsletter: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    viewedAt: Date,
    deletedAt: Date,
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
