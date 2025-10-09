const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "WELCOME TO SAIGON 3 JEAN"
  },
  subtitle: {
    type: String,
    default: ""
  },
  backgroundImage: {
    type: String,
    required: true
  },
  // Thêm trường mới để lưu các phiên bản hình ảnh
  backgroundImageVersions: {
    original: String,
    webp: String,
    thumbnail: String,
    medium: String
  },
  videoUrl: {
    type: String,
    default: ""
  },
  // Thêm trường mới để lưu thumbnail video
  videoThumbnail: {
    type: String,
    default: ""
  },
  aiBannerImage: {
    type: String,
    default: ""
  },
  aiBannerImageVersions: {
    original: String,
    webp: String,
    thumbnail: String,
    medium: String
  },
  aiBannerTitle: {
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

module.exports = mongoose.model('Hero', heroSchema);
