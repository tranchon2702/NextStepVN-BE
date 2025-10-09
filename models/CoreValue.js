const mongoose = require('mongoose');

const coreValueSchema = new mongoose.Schema({
  values: [{
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: "fas fa-star"
    },
    order: {
      type: Number,
      required: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CoreValue', coreValueSchema);
