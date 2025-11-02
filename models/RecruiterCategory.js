const mongoose = require('mongoose');

const recruiterCategorySchema = new mongoose.Schema({
  // ID định danh (auto, mechanical, construction, etc.)
  categoryId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  // Tên category (tiếng Việt)
  name: {
    type: String,
    required: true,
    trim: true
  },
  // Tên category (tiếng Nhật)
  nameJa: {
    type: String,
    trim: true,
    default: ''
  },
  // Mô tả ngắn (tiếng Việt)
  description: {
    type: String,
    required: true,
    trim: true
  },
  // Mô tả ngắn (tiếng Nhật)
  descriptionJa: {
    type: String,
    trim: true,
    default: ''
  },
  // Chi tiết (tiếng Việt)
  details: {
    type: String,
    required: true,
    trim: true
  },
  // Chi tiết (tiếng Nhật)
  detailsJa: {
    type: String,
    trim: true,
    default: ''
  },
  // Yêu cầu (tiếng Việt)
  requirements: {
    type: String,
    required: true,
    trim: true
  },
  // Yêu cầu (tiếng Nhật)
  requirementsJa: {
    type: String,
    trim: true,
    default: ''
  },
  // Màu sắc
  color: {
    type: String,
    default: '#dc2626'
  },
  // URL hình ảnh (đã upload)
  image: {
    type: String,
    required: true
  },
  // Thứ tự hiển thị
  order: {
    type: Number,
    default: 0
  },
  // Trạng thái active
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index
recruiterCategorySchema.index({ categoryId: 1 });
recruiterCategorySchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('RecruiterCategory', recruiterCategorySchema);

