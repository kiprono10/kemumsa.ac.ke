const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/
    },
    phone: {
        type: String,
        required: true
    },
    office: {
        building: String,
        room: String,
        location: String
    },
    officeHours: {
        monday: String,
        tuesday: String,
        wednesday: String,
        thursday: String,
        friday: String,
        saturday: String,
        sunday: String
    },
    responseTime: {
        type: String,
        default: 'Within 24 hours'
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String
    },
    socialMedia: {
        facebook: String,
        twitter: String,
        instagram: String,
        linkedin: String,
        whatsapp: String
    },
    additionalInfo: String,
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Communication', communicationSchema);
