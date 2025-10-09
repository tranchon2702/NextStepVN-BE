// controllers/overviewController.js
const { OverviewBanner, Milestone, Message, VisionMission, CoreValue } = require('../models');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

class OverviewController {
  
  // ==================== BANNER SECTION ====================
  
  // GET Banner
  async getBanner(req, res) {
    try {
      let banner = await OverviewBanner.findOne({ isActive: true });
      
      if (!banner) {
        return res.status(404).json({
          success: false,
          message: 'Banner content not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: banner
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching banner content',
        error: error.message
      });
    }
  }

  // UPDATE Banner
  async updateBanner(req, res) {
    try {
      const { title, description } = req.body;
      const backgroundImage = req.file ? `/uploads/images/${req.file.filename}` : undefined;
      
      let banner = await OverviewBanner.findOne({ isActive: true });
      
      if (!banner) {
        return res.status(404).json({
          success: false,
          message: 'Banner not found'
        });
      }
      
      if (title) banner.title = title;
      if (description) banner.description = description;
      if (backgroundImage) banner.backgroundImage = backgroundImage;
      
      await banner.save();
      
      res.status(200).json({
        success: true,
        message: 'Banner updated successfully',
        data: banner
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating banner',
        error: error.message
      });
    }
  }

  // ==================== MILESTONES SECTION ====================
  
  // GET Milestones
  async getMilestones(req, res) {
    try {
      let milestone = await Milestone.findOne({ isActive: true });
      
      if (!milestone) {
        return res.status(404).json({
          success: false,
          message: 'Milestones not found'
        });
      }
      
      // Sort milestones by order
      milestone.milestones.sort((a, b) => a.order - b.order);
      
      res.status(200).json({
        success: true,
        data: milestone.milestones
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching milestones',
        error: error.message
      });
    }
  }

  // UPDATE Milestones
  async updateMilestones(req, res) {
    try {
      let { milestones } = req.body;
      if (typeof milestones === 'string') {
        try {
          milestones = JSON.parse(milestones);
        } catch (e) {
          return res.status(400).json({
            success: false,
            message: 'Milestones data is not valid JSON',
            error: e.message
          });
        }
      }
      
      let milestone = await Milestone.findOne({ isActive: true });
      if (!milestone) {
        return res.status(404).json({
          success: false,
          message: 'Milestones not found'
        });
      }
      
      // Process uploaded files
      const files = req.files || {};
      
      milestones.forEach((item, index) => {
        const imageFile = files[`milestone_image_${index}`];
        if (imageFile && imageFile[0]) {
          item.image = `/uploads/images/${imageFile[0].filename}`;
        }
        item.order = index + 1;
      });
      
      milestone.milestones = milestones;
      await milestone.save();
      
      res.status(200).json({
        success: true,
        message: 'Milestones updated successfully',
        data: milestone.milestones
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating milestones',
        error: error.message
      });
    }
  }

  // ADD Milestone
  async addMilestone(req, res) {
    try {
      const { year, title, description, image } = req.body;
      const yearNum = Number(year);
      if (!yearNum || !title || !description) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields (year, title, description)'
        });
      }
      let milestoneDoc = await Milestone.findOne({ isActive: true });
      if (!milestoneDoc) {
        milestoneDoc = new Milestone({ milestones: [], isActive: true });
      }
      const newMilestone = {
        year: yearNum,
        title,
        description,
        image: image || '/uploads/images/placeholder.jpg',
        order: milestoneDoc.milestones.length + 1
      };
      milestoneDoc.milestones.push(newMilestone);
      await milestoneDoc.save();
      res.status(200).json({
        success: true,
        message: 'Milestone added successfully',
        data: newMilestone
      });
    } catch (error) {
      console.error('Error adding milestone:', error, req.body);
      res.status(500).json({
        success: false,
        message: 'Error adding milestone',
        error: error.message
      });
    }
  }

  // DELETE Milestone
  async deleteMilestone(req, res) {
    try {
      const { milestoneId } = req.params;
      let milestoneDoc = await Milestone.findOne({ isActive: true });
      if (!milestoneDoc) {
        return res.status(404).json({ success: false, message: 'Milestone document not found' });
      }
      const before = milestoneDoc.milestones.length;
      milestoneDoc.milestones = milestoneDoc.milestones.filter(m => m._id.toString() !== milestoneId);
      if (milestoneDoc.milestones.length === before) {
        return res.status(404).json({ success: false, message: 'Milestone not found' });
      }
      // Cập nhật lại order
      milestoneDoc.milestones.forEach((m, idx) => m.order = idx + 1);
      await milestoneDoc.save();
      res.status(200).json({ success: true, message: 'Milestone deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting milestone', error: error.message });
    }
  }

  // ==================== MESSAGE SECTION ====================
  
  // GET Message
  async getMessage(req, res) {
    try {
      let message = await Message.findOne({ isActive: true });
      
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Message not found'
        });
      }
      
      // Sort content by order
      message.content.sort((a, b) => a.order - b.order);
      
      res.status(200).json({
        success: true,
        data: message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching message',
        error: error.message
      });
    }
  }

  // UPDATE Message
  async updateMessage(req, res) {
    try {
      console.log('--- updateMessage ---');
      console.log('req.files:', req.files);
      console.log('req.body:', req.body);
      const { ceoName, content } = req.body;
      let ceoImage, backgroundImage;
      let ceoImageVersions, backgroundImageVersions;
      if (req.files && req.files.ceoImage && req.files.ceoImage[0]) {
        ceoImage = `/uploads/images/${req.files.ceoImage[0].filename}`;
        ceoImageVersions = req.files.ceoImage[0].versions;
      }
      if (req.files && req.files.backgroundImage && req.files.backgroundImage[0]) {
        backgroundImage = `/uploads/images/${req.files.backgroundImage[0].filename}`;
        backgroundImageVersions = req.files.backgroundImage[0].versions;
      }
      let message = await Message.findOne({ isActive: true });
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Message not found'
        });
      }
      if (ceoName) message.ceoName = ceoName;
      if (ceoImage) message.ceoImage = ceoImage;
      if (ceoImageVersions) message.ceoImageVersions = ceoImageVersions;
      if (backgroundImage) message.backgroundImage = backgroundImage;
      else if (req.body.backgroundImage) message.backgroundImage = req.body.backgroundImage;
      if (backgroundImageVersions) message.backgroundImageVersions = backgroundImageVersions;
      if (content && Array.isArray(content)) {
        message.content = content.map((item, index) => ({
          paragraph: item.paragraph,
          type: item.type || 'normal',
          order: index + 1
        }));
      }
      await message.save();
      res.status(200).json({
        success: true,
        message: 'Message updated successfully',
        data: message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating message',
        error: error.message
      });
    }
  }

  // ==================== VISION & MISSION SECTION ====================
  
  // GET Vision & Mission
  async getVisionMission(req, res) {
    try {
      let visionMission = await VisionMission.findOne({ isActive: true });
      
      if (!visionMission) {
        return res.status(404).json({
          success: false,
          message: 'Vision & Mission not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: visionMission
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching vision & mission',
        error: error.message
      });
    }
  }

  // UPDATE Vision & Mission
  async updateVisionMission(req, res) {
    try {
      const { vision, mission } = req.body;
      
      let visionMission = await VisionMission.findOne({ isActive: true });
      
      if (!visionMission) {
        return res.status(404).json({
          success: false,
          message: 'Vision & Mission not found'
        });
      }
      
      if (vision) {
        visionMission.vision = { ...visionMission.vision, ...vision };
      }
      
      if (mission) {
        visionMission.mission = { ...visionMission.mission, ...mission };
      }
      
      await visionMission.save();
      
      res.status(200).json({
        success: true,
        message: 'Vision & Mission updated successfully',
        data: visionMission
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating vision & mission',
        error: error.message
      });
    }
  }

  // ==================== CORE VALUES SECTION ====================
  
  // GET Core Values
  async getCoreValues(req, res) {
    try {
      let coreValue = await CoreValue.findOne({ isActive: true });
      
      if (!coreValue) {
        return res.status(404).json({
          success: false,
          message: 'Core values not found'
        });
      }
      
      // Sort values by order
      coreValue.values.sort((a, b) => a.order - b.order);
      
      res.status(200).json({
        success: true,
        data: coreValue.values
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching core values',
        error: error.message
      });
    }
  }

  // UPDATE Core Values
  async updateCoreValues(req, res) {
    try {
      const { values } = req.body;
      
      let coreValue = await CoreValue.findOne({ isActive: true });
      if (!coreValue) {
        return res.status(404).json({
          success: false,
          message: 'Core values not found'
        });
      }
      
      if (values && Array.isArray(values)) {
        coreValue.values = values.map((item, index) => ({
          title: item.title,
          content: item.content,
          icon: item.icon || "fas fa-star",
          order: index + 1
        }));
      }
      
      await coreValue.save();
      
      res.status(200).json({
        success: true,
        message: 'Core values updated successfully',
        data: coreValue.values
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating core values',
        error: error.message
      });
    }
  }

  // ==================== COMBINED OVERVIEW DATA ====================
  
  // GET All overview data
  async getOverviewData(req, res) {
    try {
      const [banner, milestones, message, visionMission, coreValues] = await Promise.all([
        OverviewBanner.findOne({ isActive: true }),
        Milestone.findOne({ isActive: true }),
        Message.findOne({ isActive: true }),
        VisionMission.findOne({ isActive: true }),
        CoreValue.findOne({ isActive: true })
      ]);
      
      res.status(200).json({
        success: true,
        data: {
          banner,
          milestones: milestones?.milestones?.sort((a, b) => a.order - b.order) || [],
          message,
          visionMission,
          coreValues: coreValues?.values?.sort((a, b) => a.order - b.order) || []
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching overview data',
        error: error.message
      });
    }
  }
}

module.exports = {
  OverviewController: new OverviewController(),
  upload
};