// models/Automation.js
const mongoose = require('mongoose');

// Automation Content Item Schema (nested content for each automation item)
const AutomationContentItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
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
}, { 
  _id: true,
  timestamps: true 
});

// Automation Item Schema
const AutomationItemSchema = new mongoose.Schema({
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
  contentItems: [AutomationContentItemSchema], // Added nested content items
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  _id: true,
  timestamps: true 
});

// Main Automation Schema
const AutomationSchema = new mongoose.Schema({
  // Page information
  pageTitle: {
    type: String,
    default: 'AUTOMATION'
  },
  pageDescription: {
    type: String,
    default: 'Advanced automation systems driving efficiency and precision in our manufacturing processes'
  },
  
  // Automation items (synced slider)
  automationItems: [AutomationItemSchema],
  
  // Slider settings
  sliderSettings: {
    autoplay: {
      type: Boolean,
      default: false
    },
    autoplaySpeed: {
      type: Number,
      default: 3000
    },
    showArrows: {
      type: Boolean,
      default: true
    },
    showDots: {
      type: Boolean,
      default: true
    },
    infinite: {
      type: Boolean,
      default: true
    },
    slidesToShow: {
      desktop: {
        type: Number,
        default: 3
      },
      tablet: {
        type: Number,
        default: 2
      },
      mobile: {
        type: Number,
        default: 1
      }
    }
  },
  
  // SEO and meta information
  seo: {
    metaTitle: {
      type: String,
      default: 'Automation - Saigon 3 Jean'
    },
    metaDescription: {
      type: String,
      default: 'Discover Saigon 3 Jean advanced automation systems: automatic chemical quantification, continuous monitoring, and data analysis for sustainable denim manufacturing.'
    },
    keywords: {
      type: [String],
      default: ['automation', 'manufacturing', 'technology', 'chemical quantification', 'monitoring']
    }
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'automation'
});

// Indexes for better performance
AutomationSchema.index({ isActive: 1 });
AutomationSchema.index({ 'automationItems.order': 1 });
AutomationSchema.index({ 'automationItems.isActive': 1 });
AutomationSchema.index({ 'automationItems.contentItems.order': 1 });

// Virtual for getting sorted active items
AutomationSchema.virtual('sortedItems').get(function() {
  return this.automationItems
    .filter(item => item.isActive)
    .sort((a, b) => a.order - b.order)
    .map(item => {
      const itemObj = item.toObject();
      // Sort and filter content items
      if (item.contentItems && item.contentItems.length > 0) {
        itemObj.contentItems = item.contentItems
          .filter(contentItem => contentItem.isActive)
          .sort((a, b) => a.order - b.order);
      } else {
        // If no content items, create a default one from the main item's description
        itemObj.contentItems = [{
          _id: item._id,
          title: item.title,
          description: item.description,
          order: 0,
          isActive: true
        }];
      }
      return itemObj;
    });
});

// Instance methods
AutomationSchema.methods.addItem = function(itemData) {
  this.automationItems.push(itemData);
  return this.save();
};

AutomationSchema.methods.updateItem = function(itemId, updateData) {
  const item = this.automationItems.id(itemId);
  if (item) {
    Object.assign(item, updateData);
    return this.save();
  }
  throw new Error('Automation item not found');
};

AutomationSchema.methods.deleteItem = function(itemId) {
  this.automationItems.pull({ _id: itemId });
  return this.save();
};

AutomationSchema.methods.toggleItemStatus = function(itemId) {
  const item = this.automationItems.id(itemId);
  if (item) {
    item.isActive = !item.isActive;
    return this.save();
  }
  throw new Error('Automation item not found');
};

AutomationSchema.methods.reorderItems = function(itemIds) {
  itemIds.forEach((itemId, index) => {
    const item = this.automationItems.id(itemId);
    if (item) {
      item.order = index + 1;
    }
  });
  return this.save();
};

// Content item methods
AutomationSchema.methods.addContentItem = function(itemId, contentItemData) {
  const item = this.automationItems.id(itemId);
  if (item) {
    if (!item.contentItems) {
      item.contentItems = [];
    }
    item.contentItems.push(contentItemData);
    return this.save();
  }
  throw new Error('Automation item not found');
};

AutomationSchema.methods.updateContentItem = function(itemId, contentItemId, updateData) {
  const item = this.automationItems.id(itemId);
  if (item) {
    const contentItem = item.contentItems.id(contentItemId);
    if (contentItem) {
      Object.assign(contentItem, updateData);
      return this.save();
    }
    throw new Error('Content item not found');
  }
  throw new Error('Automation item not found');
};

AutomationSchema.methods.deleteContentItem = function(itemId, contentItemId) {
  const item = this.automationItems.id(itemId);
  if (item) {
    item.contentItems.pull({ _id: contentItemId });
    return this.save();
  }
  throw new Error('Automation item not found');
};

AutomationSchema.methods.toggleContentItemStatus = function(itemId, contentItemId) {
  const item = this.automationItems.id(itemId);
  if (item) {
    const contentItem = item.contentItems.id(contentItemId);
    if (contentItem) {
      contentItem.isActive = !contentItem.isActive;
      return this.save();
    }
    throw new Error('Content item not found');
  }
  throw new Error('Automation item not found');
};

AutomationSchema.methods.reorderContentItems = function(itemId, contentItemIds) {
  const item = this.automationItems.id(itemId);
  if (item) {
    contentItemIds.forEach((contentItemId, index) => {
      const contentItem = item.contentItems.id(contentItemId);
      if (contentItem) {
        contentItem.order = index + 1;
      }
    });
    return this.save();
  }
  throw new Error('Automation item not found');
};

// Export model
module.exports = mongoose.model('Automation', AutomationSchema);