const mongoose = require('mongoose');

// Feature Item Schema (for the circle layout features)
const FeatureItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  points: [{
    type: String,
    required: true,
    trim: true
  }],
  order: {
    type: Number, 
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  _id: true 
});

// Section Schema (for system and technology sections)
const SectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  imageAlt: {
    type: String,
    default: function() {
      return this.title;
    }
  },
  order: {
    type: Number,
    default: 0
  },
  stats: [{
    value: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  _id: true
});

// Main EcoFriendly Schema
const EcoFriendlySchema = new mongoose.Schema({
  // Hero section
  hero: {
    image: {
      type: String,
      default: '/uploads/images/home_banner-section3.png'
    },
    imageAlt: {
      type: String,
      default: 'Eco-friendly facilities'
    }
  },
  
  // Features section (circle layout)
  mainImage: {
    type: String,
    default: '/uploads/images/home_banner-section2.jpg'
  },
  mainImageAlt: {
    type: String,
    default: 'Eco-friendly operations'
  },
  features: [FeatureItemSchema],
  
  // System and technology sections
  sections: [SectionSchema],
  
  // Page settings
  pageTitle: {
    type: String,
    default: 'ECO FRIENDLY'
  },
  pageDescription: {
    type: String,
    default: 'Our sustainable production practices and eco-friendly technologies'
  },
  
  // SEO and meta information
  seo: {
    metaTitle: {
      type: String,
      default: 'Eco-Friendly - Saigon 3 Jean'
    },
    metaDescription: {
      type: String,
      default: 'Discover Saigon 3 Jean sustainable and eco-friendly production practices, including solar energy, water recycling, and green technologies.'
    },
    keywords: {
      type: [String],
      default: ['eco-friendly', 'sustainable', 'solar energy', 'water recycling', 'green manufacturing']
    }
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'ecoFriendly'
});

// Virtual for sorted features
EcoFriendlySchema.virtual('sortedFeatures').get(function() {
  return this.features
    .filter(feature => feature.isActive !== false)
    .sort((a, b) => a.order - b.order);
});

// Virtual for sorted sections
EcoFriendlySchema.virtual('sortedSections').get(function() {
  return this.sections
    .filter(section => section.isActive !== false)
    .sort((a, b) => a.order - b.order);
});

module.exports = mongoose.model('EcoFriendly', EcoFriendlySchema); 