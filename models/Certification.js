const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  certifications: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    image: {
      type: String,
      required: true
    },
    category: {
      type: String
    },
    issuedDate: {
      type: Date,
      default: Date.now
    },
    validUntil: {
      type: Date
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Certification', certificationSchema);
