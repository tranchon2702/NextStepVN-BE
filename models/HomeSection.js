const mongoose = require('mongoose');

const homeSectionSchema = new mongoose.Schema({
  sections: [{
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    mediaType: {
      type: String,
      enum: ['video', 'image'],
      required: true
    },
    mediaUrl: {
      type: String,
      required: true
    },
    buttonText: {
      type: String,
      default: "LEARN MORE"
    },
    buttonLink: {
      type: String,
      default: "#"
    },
    backgroundColor: {
      type: String,
      default: "#1e40af" // blue
    },
    order: {
      type: Number,
      required: true
    }
  }],
  factoryVideo: {
    type: String,
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HomeSection', homeSectionSchema);
