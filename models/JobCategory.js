const mongoose = require('mongoose');

const jobCategorySchema = new mongoose.Schema({
  // ID định danh (cơ-khí, ô-tô, điện-điện-tử, it, xây-dựng)
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
  // URL hình ảnh (đã upload)
  image: {
    type: String,
    required: true
  },
  // Màu sắc
  color: {
    type: String,
    default: '#dc2626'
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
jobCategorySchema.index({ categoryId: 1 });
jobCategorySchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('JobCategory', jobCategorySchema);


