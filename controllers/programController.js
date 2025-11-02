const Program = require('../models/Program');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình multer cho upload ảnh programs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/images/programs');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'program-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter
});

const uploadConfigs = {
  program: upload.fields([
    { name: 'programImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 10 }
  ])
};

class ProgramController {
  // GET All Programs
  async getAllPrograms(req, res) {
    try {
      const programs = await Program.find({}).sort({ order: 1, createdAt: -1 });
      res.status(200).json({
        success: true,
        data: programs
      });
    } catch (error) {
      console.error('Error in getAllPrograms:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching programs',
        error: error.message
      });
    }
  }

  // GET Published Programs (for frontend)
  async getPublishedPrograms(req, res) {
    try {
      const programs = await Program.find({ isPublished: true }).sort({ order: 1, createdAt: -1 });
      res.status(200).json({
        success: true,
        data: programs
      });
    } catch (error) {
      console.error('Error in getPublishedPrograms:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching programs',
        error: error.message
      });
    }
  }

  // GET Program by ID or Slug
  async getProgramById(req, res) {
    try {
      const { id } = req.params;
      let program = null;
      
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        program = await Program.findById(id);
      }
      
      if (!program) {
        program = await Program.findOne({ slug: id });
      }
      
      if (!program) {
        return res.status(404).json({
          success: false,
          message: 'Program not found'
        });
      }
      
      program.views += 1;
      await program.save();
      
      res.status(200).json({
        success: true,
        data: program
      });
    } catch (error) {
      console.error('Error in getProgramById:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching program',
        error: error.message
      });
    }
  }

  // CREATE Program
  async createProgram(req, res) {
    try {
      const { title, titleJa, content, contentJa, excerpt, excerptJa, category, isFeatured, isPublished, order } = req.body;
      
      const mainImageFile = req.files && req.files.programImage ? req.files.programImage[0] : null;
      
      // Ảnh banner là bắt buộc khi tạo mới
      if (!mainImageFile) {
        return res.status(400).json({
          success: false,
          message: 'Banner image is required'
        });
      }
      
      const mainImageUrl = `/uploads/images/programs/${mainImageFile.filename}`;
      
      // Process additional images
      const additionalImages = [];
      if (req.files && req.files.additionalImages) {
        req.files.additionalImages.forEach((file, index) => {
          additionalImages.push({
            url: `/uploads/images/programs/${file.filename}`,
            alt: '',
            order: index
          });
        });
      }
      
      const program = new Program({
        title,
        titleJa: titleJa || '',
        content,
        contentJa: contentJa || '',
        excerpt: excerpt || '',
        excerptJa: excerptJa || '',
        mainImage: mainImageUrl,
        additionalImages: additionalImages,
        category: category || '',
        isFeatured: isFeatured === 'true' || isFeatured === true,
        isPublished: isPublished === 'true' || isPublished === true,
        order: order ? parseInt(order) : 0,
        views: 0
      });
      
      await program.save();
      
      res.status(201).json({
        success: true,
        message: 'Program created successfully',
        data: program
      });
    } catch (error) {
      console.error('Error in createProgram:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating program',
        error: error.message
      });
    }
  }

  // UPDATE Program
  async updateProgram(req, res) {
    try {
      const { id } = req.params;
      const { title, titleJa, content, contentJa, excerpt, excerptJa, category, isFeatured, isPublished, order } = req.body;
      
      // Debug log
      console.log('Update Program - Received:', {
        contentLength: content?.length || 0,
        contentJaLength: contentJa?.length || 0,
        contentPreview: content?.substring(0, 100),
        contentJaPreview: contentJa?.substring(0, 100),
      });
      
      const program = await Program.findById(id);
      if (!program) {
        return res.status(404).json({
          success: false,
          message: 'Program not found'
        });
      }
      
      // Update fields
      if (title) program.title = title;
      if (titleJa !== undefined) program.titleJa = titleJa;
      // Luôn cập nhật content và contentJa nếu có trong request
      if (content !== undefined) {
        program.content = content;
        program.markModified('content');
      }
      if (contentJa !== undefined) {
        program.contentJa = contentJa;
        program.markModified('contentJa');
      }
      if (excerpt !== undefined) program.excerpt = excerpt;
      if (excerptJa !== undefined) program.excerptJa = excerptJa;
      if (category !== undefined) program.category = category;
      if (isFeatured !== undefined) program.isFeatured = isFeatured === 'true' || isFeatured === true;
      if (isPublished !== undefined) program.isPublished = isPublished === 'true' || isPublished === true;
      if (order !== undefined) program.order = parseInt(order);
      
      // Update main image if new one uploaded
      const mainImageFile = req.files && req.files.programImage ? req.files.programImage[0] : null;
      if (mainImageFile) {
        program.mainImage = `/uploads/images/programs/${mainImageFile.filename}`;
      }
      
      // Update additional images if new ones uploaded
      if (req.files && req.files.additionalImages) {
        const newAdditionalImages = req.files.additionalImages.map((file, index) => ({
          url: `/uploads/images/programs/${file.filename}`,
          alt: '',
          order: program.additionalImages.length + index
        }));
        program.additionalImages.push(...newAdditionalImages);
      }
      
      await program.save();
      
      res.status(200).json({
        success: true,
        message: 'Program updated successfully',
        data: program
      });
    } catch (error) {
      console.error('Error in updateProgram:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating program',
        error: error.message
      });
    }
  }

  // DELETE Program
  async deleteProgram(req, res) {
    try {
      const { id } = req.params;
      
      const program = await Program.findByIdAndDelete(id);
      if (!program) {
        return res.status(404).json({
          success: false,
          message: 'Program not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Program deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteProgram:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting program',
        error: error.message
      });
    }
  }

  // DELETE Additional Image
  async deleteAdditionalImage(req, res) {
    try {
      const { id, imageIndex } = req.params;
      
      const program = await Program.findById(id);
      if (!program) {
        return res.status(404).json({
          success: false,
          message: 'Program not found'
        });
      }
      
      const imageIndexNum = parseInt(imageIndex);
      if (imageIndexNum < 0 || imageIndexNum >= program.additionalImages.length) {
        return res.status(400).json({
          success: false,
          message: 'Invalid image index'
        });
      }
      
      program.additionalImages.splice(imageIndexNum, 1);
      await program.save();
      
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
        data: program
      });
    } catch (error) {
      console.error('Error in deleteAdditionalImage:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting image',
        error: error.message
      });
    }
  }
}

module.exports = { ProgramController: new ProgramController(), uploadConfigs };

