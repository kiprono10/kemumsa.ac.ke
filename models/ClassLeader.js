const mongoose = require('mongoose');

const ClassLeaderSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    position: {
        type: String,
        required: [true, 'Position is required'],
        trim: true,
        example: 'Year 1 Representative, Class Secretary'
    },
    yearOfStudy: {
        type: Number,
        required: [true, 'Year of study is required'],
        min: 1,
        max: 6
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 500
    },
    imageUrl: {
        type: String,
        trim: true
    },
    socialAccounts: {
        facebook: {
            type: String,
            trim: true
        },
        twitter: {
            type: String,
            trim: true
        },
        instagram: {
            type: String,
            trim: true
        },
        linkedin: {
            type: String,
            trim: true
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for faster queries
ClassLeaderSchema.index({ yearOfStudy: 1, isActive: 1 });
ClassLeaderSchema.index({ email: 1 });

module.exports = mongoose.model('ClassLeader', ClassLeaderSchema);
