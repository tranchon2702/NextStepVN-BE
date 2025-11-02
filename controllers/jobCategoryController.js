const JobCategory = require('../models/JobCategory');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/images/job-categories/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'category-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Export multer middleware
exports.uploadCategoryImage = upload.single('image');

class JobCategoryController {
  // Get all active categories (public)
  async getAllCategories(req, res) {
    try {
      const categories = await JobCategory.find({ isActive: true })
        .sort({ order: 1, createdAt: 1 });
      
      res.status(200).json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Error getting categories:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách categories',
        error: error.message
      });
    }
  }

  // Get all categories for admin (including inactive)
  async getAllCategoriesForAdmin(req, res) {
    try {
      const categories = await JobCategory.find({})
        .sort({ order: 1, createdAt: 1 });
      
      res.status(200).json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Error getting categories for admin:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách categories',
        error: error.message
      });
    }
  }

  // Get category by ID
  async getCategoryById(req, res) {
    try {
      const category = await JobCategory.findById(req.params.id);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy category'
        });
      }
      
      res.status(200).json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Error getting category:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin category',
        error: error.message
      });
    }
  }

  // Create new category
  async createCategory(req, res) {
    try {
      const {
        categoryId,
        name,
        nameJa,
        description,
        descriptionJa,
        color,
        order,
        isActive
      } = req.body;

      // Check if categoryId already exists
      const existing = await JobCategory.findOne({ categoryId });
      if (existing) {
        // Delete uploaded file if exists
        if (req.file) {
          const filePath = path.join(__dirname, '..', req.file.path);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        return res.status(400).json({
          success: false,
          message: 'Category ID đã tồn tại'
        });
      }

      // Handle image upload
      let imageUrl = '';
      if (req.file) {
        imageUrl = `/uploads/images/job-categories/${req.file.filename}`;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng upload ảnh cho danh mục'
        });
      }

      const category = new JobCategory({
        categoryId,
        name,
        nameJa: nameJa || '',
        description,
        descriptionJa: descriptionJa || '',
        color: color || '#dc2626',
        image: imageUrl,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      });

      await category.save();

      res.status(201).json({
        success: true,
        message: 'Tạo category thành công',
        data: category
      });
    } catch (error) {
      console.error('Error creating category:', error);
      // Delete uploaded file if error
      if (req.file) {
        const filePath = path.join(__dirname, '..', req.file.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo category',
        error: error.message
      });
    }
  }

  // Update category
  async updateCategory(req, res) {
    try {
      const category = await JobCategory.findById(req.params.id);
      
      if (!category) {
        // Delete uploaded file if exists
        if (req.file) {
          const filePath = path.join(__dirname, '..', req.file.path);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy category'
        });
      }

      const {
        categoryId,
        name,
        nameJa,
        description,
        descriptionJa,
        color,
        order,
        isActive
      } = req.body;

      // Check if categoryId is being changed and already exists
      if (categoryId && categoryId !== category.categoryId) {
        const existing = await JobCategory.findOne({ categoryId, _id: { $ne: req.params.id } });
        if (existing) {
          // Delete uploaded file if exists
          if (req.file) {
            const filePath = path.join(__dirname, '..', req.file.path);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
          return res.status(400).json({
            success: false,
            message: 'Category ID đã tồn tại'
          });
        }
        category.categoryId = categoryId;
      }

      // Handle image upload
      if (req.file) {
        // Delete old image if exists
        if (category.image && category.image.startsWith('/uploads/')) {
          const oldFilePath = path.join(__dirname, '..', category.image);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        category.image = `/uploads/images/job-categories/${req.file.filename}`;
      }

      // Update fields
      if (name !== undefined) category.name = name;
      if (nameJa !== undefined) category.nameJa = nameJa || '';
      if (description !== undefined) category.description = description;
      if (descriptionJa !== undefined) category.descriptionJa = descriptionJa || '';
      if (color !== undefined) category.color = color;
      if (order !== undefined) category.order = order;
      if (isActive !== undefined) category.isActive = isActive;

      await category.save();

      res.status(200).json({
        success: true,
        message: 'Cập nhật category thành công',
        data: category
      });
    } catch (error) {
      console.error('Error updating category:', error);
      // Delete uploaded file if error
      if (req.file) {
        const filePath = path.join(__dirname, '..', req.file.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật category',
        error: error.message
      });
    }
  }

  // Delete category (soft delete)
  async deleteCategory(req, res) {
    try {
      const category = await JobCategory.findById(req.params.id);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy category'
        });
      }

      category.isActive = false;
      await category.save();

      res.status(200).json({
        success: true,
        message: 'Xóa category thành công'
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa category',
        error: error.message
      });
    }
  }
}

const controller = new JobCategoryController();

// Bind methods to ensure 'this' context is correct
module.exports = {
  getAllCategories: controller.getAllCategories.bind(controller),
  getAllCategoriesForAdmin: controller.getAllCategoriesForAdmin.bind(controller),
  getCategoryById: controller.getCategoryById.bind(controller),
  createCategory: controller.createCategory.bind(controller),
  updateCategory: controller.updateCategory.bind(controller),
  deleteCategory: controller.deleteCategory.bind(controller),
  uploadCategoryImage: exports.uploadCategoryImage
};


