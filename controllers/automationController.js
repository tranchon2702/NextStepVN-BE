const Automation = require('../models/Automation');
const multer = require('multer');
const path = require('path');
const { processUploadedImages } = require('../middleware/imageProcessor');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images/automation/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

class AutomationController {
  
  // ==================== GET ALL AUTOMATION DATA ====================
  
  async getAutomationData(req, res) {
    try {
      const automation = await Automation.findOne({ isActive: true });
      
      if (!automation) {
        return res.status(404).json({
          success: false,
          message: 'Automation data not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          pageTitle: automation.pageTitle,
          pageDescription: automation.pageDescription,
          automationItems: automation.sortedItems,
          sliderSettings: automation.sliderSettings,
          seo: automation.seo
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching automation data',
        error: error.message
      });
    }
  }

  // ==================== AUTOMATION ITEMS MANAGEMENT ====================
  
  async getAutomationItems(req, res) {
    try {
      const { includeInactive = false } = req.query;
      const automation = await Automation.findOne({ isActive: true });
      
      if (!automation) {
        return res.status(404).json({
          success: false,
          message: 'Automation data not found'
        });
      }
      
      let items = automation.automationItems;
      
      if (!includeInactive) {
        items = automation.sortedItems;
      } else {
        items = items.sort((a, b) => a.order - b.order);
      }
      
      res.status(200).json({
        success: true,
        data: items
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching automation items',
        error: error.message
      });
    }
  }

  async addAutomationItem(req, res) {
    try {
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      
      let { title, description, order, imageAlt, contentItems } = req.body;
      
      // Kiểm tra tiêu đề
      if (!title || title.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Tiêu đề là bắt buộc'
        });
      }
      
      // Kiểm tra ảnh
      const image = req.file ? `/uploads/images/automation/${req.file.filename}` : req.body.image;
      if (!image) {
        return res.status(400).json({
          success: false,
          message: 'Ảnh đại diện là bắt buộc'
        });
      }
      
      // Parse contentItems nếu là string (do gửi qua FormData)
      if (typeof contentItems === 'string') {
        try {
          console.log('Parsing contentItems string:', contentItems);
          contentItems = JSON.parse(contentItems);
          console.log('Parsed contentItems:', contentItems);
        } catch (e) {
          console.error('Error parsing contentItems:', e);
          contentItems = [];
        }
      }
      
      const automation = await Automation.findOne({ isActive: true });
      console.log('Found automation document:', automation ? automation._id : 'none');
      
      if (!automation) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy dữ liệu automation'
        });
      }
      
      const newItem = {
        title: title.trim(),
        description: description || title.trim(),
        image,
        imageAlt: imageAlt || title.trim(),
        order: order || (automation.automationItems?.length || 0) + 1,
        isActive: true,
        contentItems: Array.isArray(contentItems) && contentItems.length > 0 
          ? contentItems 
          : [{
              title: title.trim(),
              description: description || title.trim(),
              order: 0,
              isActive: true
            }]
      };
      
      console.log('Creating new item:', newItem);
      
      await automation.addItem(newItem);
      console.log('Item added successfully');
      
      res.status(201).json({
        success: true,
        message: 'Automation item added successfully',
        data: automation.sortedItems
      });
    } catch (error) {
      console.error('Error in addAutomationItem:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding automation item',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  async getAutomationItemById(req, res) {
    try {
      const { itemId } = req.params;
      
      const automation = await Automation.findOne({ isActive: true });
      const item = automation.automationItems.id(itemId);
      
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Automation item not found'
        });
      }
      
      // Return item with sorted content items
      const itemData = item.toObject();
      if (item.contentItems && item.contentItems.length > 0) {
        itemData.contentItems = item.contentItems
          .filter(contentItem => contentItem.isActive)
          .sort((a, b) => a.order - b.order);
      } else {
        itemData.contentItems = [{
          _id: item._id,
          title: item.title,
          description: item.description,
          order: 0,
          isActive: true
        }];
      }
      
      res.status(200).json({
        success: true,
        data: itemData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching automation item',
        error: error.message
      });
    }
  }

  async updateAutomationItem(req, res) {
    try {
      console.log('BODY:', req.body);
      console.log('FILE:', req.file);
      const { itemId } = req.params;
      const updateData = { ...req.body };
      // Parse contentItems nếu là string (do gửi qua FormData)
      if (typeof updateData.contentItems === 'string') {
        try {
          updateData.contentItems = JSON.parse(updateData.contentItems);
        } catch (e) {
          updateData.contentItems = [];
        }
      }
      // Handle image upload if present
      if (req.file) {
        updateData.image = `/uploads/images/automation/${req.file.filename}`;
      }
      // Clean up data
      if (updateData.title) updateData.title = updateData.title.trim();
      if (updateData.description) updateData.description = updateData.description.trim();
      const automation = await Automation.findOne({ isActive: true });
      await automation.updateItem(itemId, updateData);
      res.status(200).json({
        success: true,
        message: 'Automation item updated successfully',
        data: automation.sortedItems
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating automation item',
        error: error.message
      });
    }
  }

  async deleteAutomationItem(req, res) {
    try {
      const { itemId } = req.params;
      
      const automation = await Automation.findOne({ isActive: true });
      await automation.deleteItem(itemId);
      
      res.status(200).json({
        success: true,
        message: 'Automation item deleted successfully',
        data: automation.sortedItems
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting automation item',
        error: error.message
      });
    }
  }

  async toggleAutomationItemStatus(req, res) {
    try {
      const { itemId } = req.params;
      
      const automation = await Automation.findOne({ isActive: true });
      await automation.toggleItemStatus(itemId);
      
      const item = automation.automationItems.id(itemId);
      
      res.status(200).json({
        success: true,
        message: `Automation item ${item.isActive ? 'activated' : 'deactivated'} successfully`,
        data: automation.sortedItems
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error toggling automation item status',
        error: error.message
      });
    }
  }

  // ==================== CONTENT ITEMS MANAGEMENT ====================
  
  async getContentItems(req, res) {
    try {
      const { itemId } = req.params;
      const { includeInactive = false } = req.query;
      
      const automation = await Automation.findOne({ isActive: true });
      const item = automation.automationItems.id(itemId);
      
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Automation item not found'
        });
      }
      
      let contentItems = item.contentItems || [];
      
      if (!includeInactive) {
        contentItems = contentItems.filter(contentItem => contentItem.isActive);
      }
      
      contentItems = contentItems.sort((a, b) => a.order - b.order);
      
      // If no content items, create a default one from the main item
      if (contentItems.length === 0) {
        contentItems = [{
          _id: item._id,
          title: item.title,
          description: item.description,
          order: 0,
          isActive: true
        }];
      }
      
      res.status(200).json({
        success: true,
        data: contentItems
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching content items',
        error: error.message
      });
    }
  }

  async addContentItem(req, res) {
    try {
      const { itemId } = req.params;
      const { title, description, order } = req.body;
      
      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: 'Title and description are required'
        });
      }
      
      const automation = await Automation.findOne({ isActive: true });
      const item = automation.automationItems.id(itemId);
      
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Automation item not found'
        });
      }
      
      const contentItemsCount = item.contentItems ? item.contentItems.length : 0;
      
      const newContentItem = {
        title: title.trim(),
        description: description.trim(),
        order: order || contentItemsCount + 1,
        isActive: true
      };
      
      await automation.addContentItem(itemId, newContentItem);
      
      const updatedItem = automation.automationItems.id(itemId);
      const sortedContentItems = updatedItem.contentItems
        .filter(contentItem => contentItem.isActive)
        .sort((a, b) => a.order - b.order);
      
      res.status(201).json({
        success: true,
        message: 'Content item added successfully',
        data: sortedContentItems
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error adding content item',
        error: error.message
      });
    }
  }

  async getContentItemById(req, res) {
    try {
      const { itemId, contentItemId } = req.params;
      
      const automation = await Automation.findOne({ isActive: true });
      const item = automation.automationItems.id(itemId);
      
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Automation item not found'
        });
      }
      
      const contentItem = item.contentItems.id(contentItemId);
      
      if (!contentItem) {
        return res.status(404).json({
          success: false,
          message: 'Content item not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: contentItem
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching content item',
        error: error.message
      });
    }
  }

  async updateContentItem(req, res) {
    try {
      const { itemId, contentItemId } = req.params;
      const updateData = { ...req.body };
      
      // Clean up data
      if (updateData.title) updateData.title = updateData.title.trim();
      if (updateData.description) updateData.description = updateData.description.trim();
      
      const automation = await Automation.findOne({ isActive: true });
      await automation.updateContentItem(itemId, contentItemId, updateData);
      
      const item = automation.automationItems.id(itemId);
      const sortedContentItems = item.contentItems
        .filter(contentItem => contentItem.isActive)
        .sort((a, b) => a.order - b.order);
      
      res.status(200).json({
        success: true,
        message: 'Content item updated successfully',
        data: sortedContentItems
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating content item',
        error: error.message
      });
    }
  }

  async deleteContentItem(req, res) {
    try {
      const { itemId, contentItemId } = req.params;
      
      const automation = await Automation.findOne({ isActive: true });
      await automation.deleteContentItem(itemId, contentItemId);
      
      const item = automation.automationItems.id(itemId);
      const sortedContentItems = item.contentItems
        .filter(contentItem => contentItem.isActive)
        .sort((a, b) => a.order - b.order);
      
      res.status(200).json({
        success: true,
        message: 'Content item deleted successfully',
        data: sortedContentItems
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting content item',
        error: error.message
      });
    }
  }

  async toggleContentItemStatus(req, res) {
    try {
      const { itemId, contentItemId } = req.params;
      
      const automation = await Automation.findOne({ isActive: true });
      await automation.toggleContentItemStatus(itemId, contentItemId);
      
      const item = automation.automationItems.id(itemId);
      const contentItem = item.contentItems.id(contentItemId);
      
      res.status(200).json({
        success: true,
        message: `Content item ${contentItem.isActive ? 'activated' : 'deactivated'} successfully`,
        data: item.contentItems.filter(ci => ci.isActive).sort((a, b) => a.order - b.order)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error toggling content item status',
        error: error.message
      });
    }
  }

  async reorderContentItems(req, res) {
    try {
      const { itemId } = req.params;
      const { contentItemIds } = req.body;
      
      if (!contentItemIds || !Array.isArray(contentItemIds)) {
        return res.status(400).json({
          success: false,
          message: 'Content item IDs array is required'
        });
      }
      
      const automation = await Automation.findOne({ isActive: true });
      await automation.reorderContentItems(itemId, contentItemIds);
      
      const item = automation.automationItems.id(itemId);
      const sortedContentItems = item.contentItems
        .filter(contentItem => contentItem.isActive)
        .sort((a, b) => a.order - b.order);
      
      res.status(200).json({
        success: true,
        message: 'Content items reordered successfully',
        data: sortedContentItems
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error reordering content items',
        error: error.message
      });
    }
  }

  // ==================== BULK OPERATIONS ====================
  
  async updateAllAutomationItems(req, res) {
    try {
      const { items } = req.body;
      
      if (!items || !Array.isArray(items)) {
        return res.status(400).json({
          success: false,
          message: 'Items array is required'
        });
      }
      
      const automation = await Automation.findOne({ isActive: true });
      automation.automationItems = items;
      await automation.save();
      
      res.status(200).json({
        success: true,
        message: 'All automation items updated successfully',
        data: automation.sortedItems
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating automation items',
        error: error.message
      });
    }
  }

  async reorderAutomationItems(req, res) {
    try {
      const { itemIds } = req.body;
      
      if (!itemIds || !Array.isArray(itemIds)) {
        return res.status(400).json({
          success: false,
          message: 'Item IDs array is required'
        });
      }
      
      const automation = await Automation.findOne({ isActive: true });
      await automation.reorderItems(itemIds);
      
      res.status(200).json({
        success: true,
        message: 'Automation items reordered successfully',
        data: automation.sortedItems
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error reordering automation items',
        error: error.message
      });
    }
  }

  async bulkDeleteAutomationItems(req, res) {
    try {
      const { itemIds } = req.body;
      
      if (!itemIds || !Array.isArray(itemIds)) {
        return res.status(400).json({
          success: false,
          message: 'Item IDs array is required'
        });
      }
      
      const automation = await Automation.findOne({ isActive: true });
      
      // Remove multiple items
      itemIds.forEach(itemId => {
        automation.automationItems.pull({ _id: itemId });
      });
      
      await automation.save();
      
      res.status(200).json({
        success: true,
        message: `${itemIds.length} automation items deleted successfully`,
        data: automation.sortedItems
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error bulk deleting automation items',
        error: error.message
      });
    }
  }

  // ==================== PAGE SETTINGS ====================
  
  async updatePageSettings(req, res) {
    try {
      const { pageTitle, pageDescription, seo } = req.body;
      
      const automation = await Automation.findOne({ isActive: true });
      
      if (pageTitle) automation.pageTitle = pageTitle.trim();
      if (pageDescription) automation.pageDescription = pageDescription.trim();
      if (seo) {
        automation.seo = { ...automation.seo, ...seo };
      }
      
      await automation.save();
      
      res.status(200).json({
        success: true,
        message: 'Page settings updated successfully',
        data: {
          pageTitle: automation.pageTitle,
          pageDescription: automation.pageDescription,
          seo: automation.seo
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating page settings',
        error: error.message
      });
    }
  }

  // ==================== SLIDER SETTINGS ====================
  
  async getSliderSettings(req, res) {
    try {
      const automation = await Automation.findOne({ isActive: true });
      
      res.status(200).json({
        success: true,
        data: automation.sliderSettings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching slider settings',
        error: error.message
      });
    }
  }

  async updateSliderSettings(req, res) {
    try {
      const { sliderSettings } = req.body;
      
      if (!sliderSettings) {
        return res.status(400).json({
          success: false,
          message: 'Slider settings are required'
        });
      }
      
      const automation = await Automation.findOne({ isActive: true });
      automation.sliderSettings = { ...automation.sliderSettings, ...sliderSettings };
      await automation.save();
      
      res.status(200).json({
        success: true,
        message: 'Slider settings updated successfully',
        data: automation.sliderSettings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating slider settings',
        error: error.message
      });
    }
  }

  // ==================== STATISTICS ====================
  
  async getAutomationStats(req, res) {
    try {
      const automation = await Automation.findOne({ isActive: true });
      
      const stats = {
        totalItems: automation.automationItems.length,
        activeItems: automation.automationItems.filter(item => item.isActive).length,
        inactiveItems: automation.automationItems.filter(item => !item.isActive).length,
        totalContentItems: automation.automationItems.reduce((total, item) => 
          total + (item.contentItems ? item.contentItems.length : 0), 0),
        lastUpdated: automation.updatedAt
      };
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching automation statistics',
        error: error.message
      });
    }
  }
}

module.exports = {
  AutomationController: new AutomationController(),
  upload
};