// controllers/ecoFriendlyController.js
const { EcoFriendly } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = path.join(__dirname, '../uploads/images/eco-friendly');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, 
    fieldSize: 50 * 1024 * 1024,  
    fields: 1000,                
    files: 10,                   
    parts: 1000                  
  },
  fileFilter: fileFilter
});

class EcoFriendlyController {
  
  // ==================== GET ECO-FRIENDLY DATA ====================
  
  async getEcoFriendlyData(req, res) {
    try {
      const ecoFriendly = await EcoFriendly.findOne({ isActive: true });
      
      if (!ecoFriendly) {
        return res.status(404).json({
          success: false,
          message: 'Eco-friendly data not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          pageTitle: ecoFriendly.pageTitle,
          pageDescription: ecoFriendly.pageDescription,
          hero: ecoFriendly.hero,
          mainImage: ecoFriendly.mainImage,
          mainImageAlt: ecoFriendly.mainImageAlt,
          features: ecoFriendly.sortedFeatures,
          sections: ecoFriendly.sortedSections,
          seo: ecoFriendly.seo
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching eco-friendly data',
        error: error.message
      });
    }
  }
  
  // ==================== HERO SECTION ====================
  
  async updateHero(req, res) {
    try {
      const ecoFriendly = await EcoFriendly.findOne({ isActive: true });
      
      if (!ecoFriendly) {
        return res.status(404).json({
          success: false,
          message: 'Eco-friendly data not found'
        });
      }
      
      if (req.file) {
        // Get relative path for storage in DB
        const relativePath = req.file.path.split('uploads')[1].replace(/\\/g, '/');
        ecoFriendly.hero.image = '/uploads' + relativePath;
      }
      
      if (req.body.imageAlt) {
        ecoFriendly.hero.imageAlt = req.body.imageAlt;
      }
      
      await ecoFriendly.save();
      
      res.status(200).json({
        success: true,
        message: 'Hero section updated successfully',
        data: ecoFriendly.hero
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating hero section',
        error: error.message
      });
    }
  }
  
  // ==================== MAIN IMAGE ====================
  
  async updateMainImage(req, res) {
    try {
      const ecoFriendly = await EcoFriendly.findOne({ isActive: true });
      
      if (!ecoFriendly) {
        return res.status(404).json({
          success: false,
          message: 'Eco-friendly data not found'
        });
      }
      
      if (req.file) {
        // Get relative path for storage in DB
        const relativePath = req.file.path.split('uploads')[1].replace(/\\/g, '/');
        ecoFriendly.mainImage = '/uploads' + relativePath;
      }
      
      if (req.body.mainImageAlt) {
        ecoFriendly.mainImageAlt = req.body.mainImageAlt;
      }
      
      await ecoFriendly.save();
      
      res.status(200).json({
        success: true,
        message: 'Main image updated successfully',
        data: {
          mainImage: ecoFriendly.mainImage,
          mainImageAlt: ecoFriendly.mainImageAlt
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating main image',
        error: error.message
      });
    }
  }
  
  // ==================== FEATURES SECTION ====================
  
  async getFeatures(req, res) {
    try {
      const ecoFriendly = await EcoFriendly.findOne({ isActive: true });
      
      if (!ecoFriendly) {
        return res.status(404).json({
          success: false,
          message: 'Eco-friendly data not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: ecoFriendly.sortedFeatures
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching features',
        error: error.message
      });
    }
  }
  
  async createFeature(req, res) {
    try {
      const { title, points, order } = req.body;
      
      if (!title || !points || !Array.isArray(points) || points.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Title and at least one point are required'
        });
      }
      
      const ecoFriendly = await EcoFriendly.findOne({ isActive: true });
      
      if (!ecoFriendly) {
        return res.status(404).json({
          success: false,
          message: 'Eco-friendly data not found'
        });
      }
      
      // Create new feature
      const newFeature = {
        title,
        points,
        order: order || ecoFriendly.features.length,
        isActive: true
      };
      
      ecoFriendly.features.push(newFeature);
      await ecoFriendly.save();
      
      res.status(201).json({
        success: true,
        message: 'Feature created successfully',
        data: newFeature
      });
    } catch (error) {
      console.error('EcoFriendlyController createFeature error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating feature',
        error: error.message
      });
    }
  }
  
  async updateFeature(req, res) {
    try {
      const { featureId } = req.params;
      const { title, points, order, isActive } = req.body;
      
      const ecoFriendly = await EcoFriendly.findOne({ isActive: true });
      
      if (!ecoFriendly) {
        return res.status(404).json({
          success: false,
          message: 'Eco-friendly data not found'
        });
      }
      
      // Log featureId và feature tìm được
      console.log('Update featureId:', featureId);
      // Find feature by ID
      const feature = ecoFriendly.features.id(featureId);
      console.log('Feature found:', feature);
      
      if (!feature) {
        return res.status(404).json({
          success: false,
          message: 'Feature not found'
        });
      }
      
      // Update feature properties
      if (title !== undefined) feature.title = title;
      if (points !== undefined) {
        if (!Array.isArray(points)) {
          return res.status(400).json({
            success: false,
            message: 'Points must be an array'
          });
        }
        feature.points = points;
      }
      if (order !== undefined) feature.order = order;
      if (isActive !== undefined) feature.isActive = isActive;
      
      await ecoFriendly.save();
      
      res.status(200).json({
        success: true,
        message: 'Feature updated successfully',
        data: feature
      });
    } catch (error) {
      console.error('EcoFriendlyController updateFeature error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating feature',
        error: error.message
      });
    }
  }
  
  async deleteFeature(req, res) {
    try {
      const { featureId } = req.params;
      
      const ecoFriendly = await EcoFriendly.findOne({ isActive: true });
      
      // Find and remove feature
      const feature = ecoFriendly.features.id(featureId);
      
      if (!feature) {
        return res.status(404).json({
          success: false,
          message: 'Feature not found'
        });
      }
      
      feature.remove();
      await ecoFriendly.save();
      
      res.status(200).json({
        success: true,
        message: 'Feature deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting feature',
        error: error.message
      });
    }
  }
  
  // ==================== SECTIONS ====================
  
  async getSections(req, res) {
    try {
      const ecoFriendly = await EcoFriendly.findOne({ isActive: true });
      
      if (!ecoFriendly) {
        return res.status(404).json({
          success: false,
          message: 'Eco-friendly data not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: ecoFriendly.sortedSections
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching sections',
        error: error.message
      });
    }
  }
  
  async createSection(req, res) {
    try {
      const { title, description, stats, order } = req.body;
      
      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: 'Title and description are required'
        });
      }
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Image is required'
        });
      }
      
      const ecoFriendly = await EcoFriendly.findOne({ isActive: true });
      
      if (!ecoFriendly) {
        return res.status(404).json({
          success: false,
          message: 'Eco-friendly data not found'
        });
      }
      
      // Get relative path for storage in DB
      const relativePath = req.file.path.split('uploads')[1].replace(/\\/g, '/');
      const imagePath = '/uploads' + relativePath;
      
      // Create new section
      const newSection = {
        title,
        description,
        image: imagePath,
        imageAlt: title,
        order: order || ecoFriendly.sections.length,
        stats: stats || [],
        isActive: true
      };
      
      ecoFriendly.sections.push(newSection);
      await ecoFriendly.save();
      
      res.status(201).json({
        success: true,
        message: 'Section created successfully',
        data: newSection
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating section',
        error: error.message
      });
    }
  }
  
  async updateSection(req, res) {
    try {
      const { sectionId } = req.params;
      const { title, description, stats, order, isActive, imageAlt } = req.body;
      
      const ecoFriendly = await EcoFriendly.findOne({ isActive: true });
      
      if (!ecoFriendly) {
        return res.status(404).json({
          success: false,
          message: 'Eco-friendly data not found'
        });
      }
      
      // Find section by ID
      const section = ecoFriendly.sections.id(sectionId);
      
      if (!section) {
        return res.status(404).json({
          success: false,
          message: 'Section not found'
        });
      }
      
      // Update section properties
      if (title !== undefined) section.title = title;
      if (description !== undefined) section.description = description;
      if (stats !== undefined && Array.isArray(stats)) section.stats = stats;
      if (order !== undefined) section.order = order;
      if (isActive !== undefined) section.isActive = isActive;
      if (imageAlt !== undefined) section.imageAlt = imageAlt;
      
      // Update image if provided
      if (req.file) {
        const relativePath = req.file.path.split('uploads')[1].replace(/\\/g, '/');
        section.image = '/uploads' + relativePath;
      }
      
      await ecoFriendly.save();
      
      res.status(200).json({
        success: true,
        message: 'Section updated successfully',
        data: section
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating section',
        error: error.message
      });
    }
  }
  
  async deleteSection(req, res) {
    try {
      const { sectionId } = req.params;
      
      const ecoFriendly = await EcoFriendly.findOne({ isActive: true });
      
      if (!ecoFriendly) {
        return res.status(404).json({
          success: false,
          message: 'Eco-friendly data not found'
        });
      }
      
      // Find and remove section
      const section = ecoFriendly.sections.id(sectionId);
      
      if (!section) {
        return res.status(404).json({
          success: false,
          message: 'Section not found'
        });
      }
      
      section.remove();
      await ecoFriendly.save();
      
      res.status(200).json({
        success: true,
        message: 'Section deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting section',
        error: error.message
      });
    }
  }
  
  // ==================== PAGE SETTINGS ====================
  
  async updatePageSettings(req, res) {
    try {
      const { pageTitle, pageDescription, seo } = req.body;
      
      const ecoFriendly = await EcoFriendly.findOne({ isActive: true });
      
      if (pageTitle) ecoFriendly.pageTitle = pageTitle.trim();
      if (pageDescription) ecoFriendly.pageDescription = pageDescription.trim();
      if (seo) {
        ecoFriendly.seo = { ...ecoFriendly.seo, ...seo };
      }
      
      await ecoFriendly.save();
      
      res.status(200).json({
        success: true,
        message: 'Page settings updated successfully',
        data: {
          pageTitle: ecoFriendly.pageTitle,
          pageDescription: ecoFriendly.pageDescription,
          seo: ecoFriendly.seo
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
}

module.exports = {
  EcoFriendlyController: new EcoFriendlyController(),
  upload
}; 