const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  ceoName: {
    type: String,
    required: true,
    default: "CEO"
  },
  ceoImage: {
    type: String,
    required: true,
    default: "/uploads/images/overview-page/CEO.jpg"
  },
  ceoImageVersions: {
    type: Object,
    default: {}
  },
  backgroundImage: {
    type: String,
    default: ""
  },
  backgroundImageVersions: {
    type: Object,
    default: {}
  },
  content: [{
    paragraph: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['header', 'normal', 'highlight', 'ceo', 'ceoTitle'],
      default: 'normal',
      required: true
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

module.exports = mongoose.model('Message', messageSchema);