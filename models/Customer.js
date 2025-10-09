const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  categories: {
    denimWoven: [{
      name: {
        type: String,
        required: true
      },
      logo: {
        type: String,
        required: true
      },
      website: {
        type: String,
        default: ""
      },
      order: {
        type: Number,
        default: 0
      }
    }],
    knit: [{
      name: {
        type: String,
        required: true
      },
      logo: {
        type: String,
        required: true
      },
      website: {
        type: String,
        default: ""
      },
      order: {
        type: Number,
        default: 0
      }
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);