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
    default: "" // Cho phép tạo hero mới mà chưa có ảnh
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
  },
  order: {
    type: Number,
    default: 0
  },
  buttonLink: {
    type: String,
    default: ""
  },
  // CTA fields to map banner -> program/url
  ctaType: {
    type: String,
    enum: ['program', 'url', 'none'],
    default: 'none'
  },
  ctaLabel: {
    type: String,
    default: ''
  },
  ctaSlug: {
    type: String,
    default: ''
  },
  ctaUrl: {
    type: String,
    default: ''
  },
  ctaTheme: {
    type: String,
    enum: ['red', 'dark', 'light'],
    default: 'red'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hero', heroSchema);
