const mongoose = require('mongoose');

// Product Feature Schema
const ProductFeatureSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true,
    default: 'fas fa-star'
  },
  text: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Application Content Schema
const ApplicationContentSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String,
    required: true
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: function() {
        return this.parent().heading;
      }
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  image: {
    type: String
  },
  imageAlt: {
    type: String,
    default: function() {
      return this.heading;
    }
  }
}, { _id: false });

// Product Application Schema
const ProductApplicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: ApplicationContentSchema,
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: true });

// Product Gallery Image Schema
const ProductImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: true });

// Main Product Schema
const ProductSchema = new mongoose.Schema({
  // Basic product information
  name: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Main product image
  mainImage: {
    type: String,
    required: true
  },
  mainImageAlt: {
    type: String,
    default: function() {
      return `${this.name} Products`;
    }
  },
  
  // Gallery images for carousel
  galleryImages: [ProductImageSchema],
  
  // Product features list
  features: [ProductFeatureSchema],
  
  // Product applications (accordion sections)
  applications: [ProductApplicationSchema],
  
  // Carousel settings
  carouselSettings: {
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    },
    showIndicators: {
      type: Boolean,
      default: true
    },
    showControls: {
      type: Boolean,
      default: false
    }
  },
  
  // Display settings
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // SEO
  seo: {
    metaTitle: {
      type: String,
      default: function() {
        return `${this.name} - Saigon 3 Jean`;
      }
    },
    metaDescription: {
      type: String,
      default: function() {
        return this.description;
      }
    },
    keywords: {
      type: [String],
      default: []
    }
  }
}, {
  timestamps: true,
  collection: 'products'
});

// Indexes for better performance
ProductSchema.index({ slug: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ order: 1 });
ProductSchema.index({ isFeatured: 1 });

// Pre-save middleware to generate slug
ProductSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

// Virtual for getting sorted gallery images
ProductSchema.virtual('sortedGalleryImages').get(function() {
  return this.galleryImages
    .filter(img => img.isActive)
    .sort((a, b) => a.order - b.order);
});

// Virtual for getting sorted features
ProductSchema.virtual('sortedFeatures').get(function() {
  return this.features.sort((a, b) => a.order - b.order);
});

// Virtual for getting sorted applications
ProductSchema.virtual('sortedApplications').get(function() {
  return this.applications
    .filter(app => app.isActive)
    .sort((a, b) => a.order - b.order);
});

// Instance methods
ProductSchema.methods.addGalleryImage = function(imageData) {
  this.galleryImages.push(imageData);
  return this.save();
};

ProductSchema.methods.updateGalleryImage = function(imageId, updateData) {
  const image = this.galleryImages.id(imageId);
  if (image) {
    Object.assign(image, updateData);
    return this.save();
  }
  throw new Error('Gallery image not found');
};

ProductSchema.methods.deleteGalleryImage = function(imageId) {
  this.galleryImages.pull({ _id: imageId });
  return this.save();
};

ProductSchema.methods.addFeature = function(featureData) {
  this.features.push(featureData);
  return this.save();
};

ProductSchema.methods.updateFeature = function(featureId, updateData) {
  const feature = this.features.id(featureId);
  if (feature) {
    Object.assign(feature, updateData);
    return this.save();
  }
  throw new Error('Feature not found');
};

ProductSchema.methods.deleteFeature = function(featureId) {
  this.features.pull({ _id: featureId });
  return this.save();
};

ProductSchema.methods.addApplication = function(applicationData) {
  this.applications.push(applicationData);
  return this.save();
};

ProductSchema.methods.updateApplication = function(applicationId, updateData) {
  const application = this.applications.id(applicationId);
  if (application) {
    Object.assign(application, updateData);
    return this.save();
  }
  throw new Error('Application not found');
};

ProductSchema.methods.deleteApplication = function(applicationId) {
  this.applications.pull({ _id: applicationId });
  return this.save();
};

// Static methods
ProductSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug, isActive: true });
};

ProductSchema.statics.getFeaturedProducts = function() {
  return this.find({ isActive: true, isFeatured: true }).sort({ order: 1 });
};

ProductSchema.statics.getActiveProducts = function() {
  return this.find({ isActive: true }).sort({ order: 1 });
};

// Export model
module.exports = mongoose.model('Product', ProductSchema);