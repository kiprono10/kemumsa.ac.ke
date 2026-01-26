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
    type: Object,
    default: {
      building: null,
      room: null,
      location: null
    }
  },
  officeHours: {
    type: Object,
    default: {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null
    }
  },
  responseTime: {
    type: String,
    default: 'Within 24 hours'
  },
  address: {
    type: Object,
    default: {
      street: null,
      city: null,
      state: null,
      country: null
    }
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
  },
  additionalInfo: String
}, { timestamps: true });

module.exports = mongoose.model('Communication', communicationSchema);
