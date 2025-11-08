const mongoose = require('mongoose');
const Kuroshiro = require('kuroshiro').default;
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');

// Initialize Kuroshiro for Japanese to Romaji conversion
let kuroshiro = null;
(async () => {
  try {
    kuroshiro = new Kuroshiro();
    await kuroshiro.init(new KuromojiAnalyzer());
  } catch (error) {
    console.error('Failed to initialize Kuroshiro:', error);
  }
})();

// Helper function to convert Japanese to Romaji
async function japaneseToRomaji(text) {
  if (!kuroshiro || !text) return '';
  try {
    const romaji = await kuroshiro.convert(text, { to: 'romaji', mode: 'spaced' });
    return romaji.toLowerCase().trim();
  } catch (error) {
    console.error('Failed to convert Japanese to Romaji:', error);
    return '';
  }
}

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  titleJa: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  contentJa: {
    type: String
  },
  excerpt: {
    type: String,
    maxlength: 300
  },
  excerptJa: {
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
  slugJa: {
    type: String,
    unique: true,
    sparse: true, // Cho phép null/undefined
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
    default: "Next Step Vietnam"
  },
  // SEO fields
  seo: {
    metaTitle: {
      type: String,
      trim: true,
      default: function() {
        return this.title || '';
      }
    },
    metaDescription: {
      type: String,
      trim: true,
      default: function() {
        return this.excerpt || (this.content ? this.content.replace(/<[^>]*>/g, '').substring(0, 160) : '');
      }
    },
    metaKeywords: {
      type: [String],
      default: []
    },
    ogImage: {
      type: String,
      trim: true,
      default: function() {
        return this.mainImage || this.image || '';
      }
    }
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
    
    // Generate slugJa from titleJa if available
    if (this.titleJa && (!this.slugJa || this.isModified('titleJa'))) {
      let baseSlugJa = '';
      
      // Try to convert Japanese to Romaji for better SEO
      if (kuroshiro) {
        try {
          const romaji = await japaneseToRomaji(this.titleJa);
          if (romaji && romaji.length > 0) {
            // Convert romaji to slug format
            baseSlugJa = romaji
              .replace(/[^\w\s-]/g, '') // Remove special characters
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-+|-+$/g, '')
              .trim();
          }
        } catch (error) {
          console.error('Error converting Japanese to Romaji:', error);
        }
      }
      
      // Fallback: if romaji conversion failed or empty, try to extract ASCII characters
      if (!baseSlugJa || baseSlugJa.length === 0) {
        let normalized = this.titleJa
          .toLowerCase()
          .trim();
        
        baseSlugJa = normalized
          .replace(/[^\w\s-]/g, '') // Remove all non-ASCII characters
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '')
          .trim();
      }
      
      // Final fallback if still empty
      if (!baseSlugJa || baseSlugJa.length === 0) {
        // Use a simple format: news-ja-{timestamp}
        baseSlugJa = `news-ja-${Date.now()}`;
      }
      
      // Ensure uniqueness
      let uniqueSlugJa = baseSlugJa;
      let counter = 2;
      const NewsModel = this.constructor;
      while (await NewsModel.exists({ slugJa: uniqueSlugJa, _id: { $ne: this._id } })) {
        uniqueSlugJa = `${baseSlugJa}-${counter}`;
        counter += 1;
      }
      
      this.slugJa = uniqueSlugJa;
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