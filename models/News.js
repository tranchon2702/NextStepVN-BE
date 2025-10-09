const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 300
  },
  // Hình ảnh chính (hiển thị bên ngoài)
  mainImage: {
    type: String,
    required: false,
    default: ''
  },
  // Các hình ảnh phụ (hiển thị trong details dưới dạng slide)
  additionalImages: {
    type: [{
      url: {
        type: String,
        required: true
      },
      alt: {
        type: String,
        default: ''
      },
      order: {
        type: Number,
        default: 0
      }
    }],
    default: []
  },
  // Giữ lại field image cũ để backward compatibility
  image: {
    type: String,
    required: false
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  onHome: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: String,
    default: "Saigon 3 Jean"
  }
}, {
  timestamps: true
});

newsSchema.pre('save', async function(next) {
  try {
    // Generate slug from title when creating or when title changed
    if (this.title && (!this.slug || this.isModified('title'))) {
      // Remove Vietnamese diacritics and normalize to ASCII
      let normalized = this.title
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // strip diacritics
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');

      let baseSlug = normalized
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Fallback if still empty (e.g., title has only symbols)
      if (!baseSlug || baseSlug.length === 0) {
        baseSlug = `news-${Date.now()}`;
      }

      // Ensure uniqueness by appending incremental suffix if needed
      let uniqueSlug = baseSlug;
      let counter = 2;
      const NewsModel = this.constructor; // model
      // Exclude current document when updating
      // Try base, then -2, -3, ... until free
      while (await NewsModel.exists({ slug: uniqueSlug, _id: { $ne: this._id } })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter += 1;
      }

      this.slug = uniqueSlug;
    }

    // Create excerpt if not provided
    if (this.content && !this.excerpt) {
      this.excerpt = this.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
    }

    next();
  } catch (err) {
    next(err);
  }
});
  
  module.exports = mongoose.model('News', newsSchema);