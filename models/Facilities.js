const mongoose = require('mongoose');

// Key Metrics Schema
const KeyMetricSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true,
    default: 'fas fa-chart-bar'
  },
  value: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

// Facility Feature Schema  
const FacilityFeatureSchema = new mongoose.Schema({
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
      return this.title + ' Facilities';
    }
  },
  images: [{
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
    }
  }],
  order: {
    type: Number,
    default: 0
  },
  layout: {
    type: String,
    enum: ['left', 'right'],
    default: 'left'
  }
}, { _id: true });

// Main Facilities Schema
const FacilitiesSchema = new mongoose.Schema({
  // Page title and description
  pageTitle: {
    type: String,
    default: 'FACILITIES'
  },
  pageDescription: {
    type: String,
    default: 'Discover our state-of-the-art manufacturing facilities and capabilities'
  },
  
  // Key metrics section
  keyMetrics: [KeyMetricSchema],
  
  // Facility features section
  facilityFeatures: [FacilityFeatureSchema],
  
  // SEO and meta information
  seo: {
    metaTitle: {
      type: String,
      default: 'Facilities - Saigon 3 Jean'
    },
    metaDescription: {
      type: String,
      default: 'Explore Saigon 3 Jean modern facilities, advanced technology, and talented workforce driving sustainable denim manufacturing excellence.'
    },
    keywords: {
      type: [String],
      default: ['facilities', 'manufacturing', 'denim', 'sustainable', 'technology']
    }
  },
  
  // Status and tracking
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'facilities'
});

// Indexes for better performance
FacilitiesSchema.index({ isActive: 1 });
FacilitiesSchema.index({ 'keyMetrics.order': 1 });
FacilitiesSchema.index({ 'facilityFeatures.order': 1 });

// Virtual for getting sorted metrics
FacilitiesSchema.virtual('sortedMetrics').get(function() {
  return this.keyMetrics.sort((a, b) => a.order - b.order);
});

// Virtual for getting sorted features
FacilitiesSchema.virtual('sortedFeatures').get(function() {
  return this.facilityFeatures.sort((a, b) => a.order - b.order).map(feature => {
    const featureObj = feature.toObject();
    if (feature.images && feature.images.length > 0) {
      featureObj.images = feature.images.sort((a, b) => a.order - b.order);
    }
    return featureObj;
  });
});

// Instance method to add new metric
FacilitiesSchema.methods.addMetric = function(metricData) {
  this.keyMetrics.push(metricData);
  return this.save();
};

// Instance method to add new feature
FacilitiesSchema.methods.addFeature = function(featureData) {
  this.facilityFeatures.push(featureData);
  return this.save();
};

// Instance method to update metric by ID
FacilitiesSchema.methods.updateMetric = function(metricId, updateData) {
  const metric = this.keyMetrics.id(metricId);
  if (metric) {
    Object.assign(metric, updateData);
    return this.save();
  }
  throw new Error('Metric not found');
};

// Instance method to update feature by ID
FacilitiesSchema.methods.updateFeature = function(featureId, updateData) {
  const feature = this.facilityFeatures.id(featureId);
  if (feature) {
    Object.assign(feature, updateData);
    return this.save();
  }
  throw new Error('Feature not found');
};

// Instance method to delete metric
FacilitiesSchema.methods.deleteMetric = function(metricId) {
  this.keyMetrics.pull({ _id: metricId });
  return this.save();
};

// Instance method to delete feature
FacilitiesSchema.methods.deleteFeature = function(featureId) {
  console.log(`Attempting to delete feature with ID: ${featureId}`);
  console.log(`Type of featureId: ${typeof featureId}`);
  
  // Check if the feature exists
  const feature = this.facilityFeatures.id(featureId);
  console.log('Feature found:', feature ? 'yes' : 'no');
  
  if (!feature) {
    throw new Error(`Feature with ID ${featureId} not found`);
  }

  // Try multiple approaches to pull the item by ID
  try {
    this.facilityFeatures.pull({ _id: featureId });
    console.log(`After pull by _id: ${this.facilityFeatures.length} features remaining`);
  } catch (err) {
    console.error('Error pulling by _id:', err);
    // Alternative approach: filter out the feature with this ID
    this.facilityFeatures = this.facilityFeatures.filter(
      feat => feat._id.toString() !== featureId
    );
    console.log(`After filter: ${this.facilityFeatures.length} features remaining`);
  }
  
  // Save changes
  return this.save();
};

// Export model
module.exports = mongoose.model('Facilities', FacilitiesSchema);