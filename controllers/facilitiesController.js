const Facilities = require('../models/Facilities');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images/facilities-page/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
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

// Multer middleware for multiple feature images
const uploadFeatureImages = upload.array('featureImages', 10); // Allow up to 10 images

class FacilitiesController {
  
  // ==================== GET ALL FACILITIES DATA ====================
  
  async getFacilitiesData(req, res) {
    try {
      const facilities = await Facilities.findOne({ isActive: true });
      
      if (!facilities) {
        return res.status(404).json({
          success: false,
          message: 'Facilities data not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          pageTitle: facilities.pageTitle,
          pageDescription: facilities.pageDescription,
          keyMetrics: facilities.sortedMetrics,
          facilityFeatures: facilities.sortedFeatures,
          seo: facilities.seo
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching facilities data',
        error: error.message
      });
    }
  }

  // ==================== KEY METRICS MANAGEMENT ====================
  
  async getKeyMetrics(req, res) {
    try {
      const facilities = await Facilities.findOne({ isActive: true });
      
      if (!facilities) {
        return res.status(404).json({
          success: false,
          message: 'Facilities data not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: facilities.sortedMetrics
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching key metrics',
        error: error.message
      });
    }
  }

  async updateKeyMetrics(req, res) {
    try {
      const { metrics } = req.body;
      
      if (!metrics || !Array.isArray(metrics)) {
        return res.status(400).json({
          success: false,
          message: 'Metrics array is required'
        });
      }
      
      const facilities = await Facilities.findOne({ isActive: true });
      
      if (!facilities) {
        return res.status(404).json({
          success: false,
          message: 'Facilities data not found'
        });
      }
      
      facilities.keyMetrics = metrics;
      await facilities.save();
      
      res.status(200).json({
        success: true,
        message: 'Key metrics updated successfully',
        data: facilities.sortedMetrics
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating key metrics',
        error: error.message
      });
    }
  }

  async addKeyMetric(req, res) {
    try {
      const { icon, value, unit, label, order } = req.body;
      
      if (!value || !label) {
        return res.status(400).json({
          success: false,
          message: 'Value and label are required'
        });
      }
      
      const facilities = await Facilities.findOne({ isActive: true });
      
      const newMetric = {
        icon: icon || 'fas fa-chart-bar',
        value: value.trim(),
        unit: unit || '',
        label: label.trim(),
        order: order || facilities.keyMetrics.length + 1
      };
      
      await facilities.addMetric(newMetric);
      
      res.status(201).json({
        success: true,
        message: 'Key metric added successfully',
        data: facilities.sortedMetrics
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error adding key metric',
        error: error.message
      });
    }
  }

  async updateKeyMetric(req, res) {
    try {
      const { metricId } = req.params;
      const updateData = req.body;
      
      const facilities = await Facilities.findOne({ isActive: true });
      await facilities.updateMetric(metricId, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Key metric updated successfully',
        data: facilities.sortedMetrics
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating key metric',
        error: error.message
      });
    }
  }

  async deleteKeyMetric(req, res) {
    try {
      const { metricId } = req.params;
      
      const facilities = await Facilities.findOne({ isActive: true });
      await facilities.deleteMetric(metricId);
      
      res.status(200).json({
        success: true,
        message: 'Key metric deleted successfully',
        data: facilities.sortedMetrics
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting key metric',
        error: error.message
      });
    }
  }

  // ==================== FACILITY FEATURES MANAGEMENT ====================
  
  async getFacilityFeatures(req, res) {
    try {
      const facilities = await Facilities.findOne({ isActive: true });
      
      res.status(200).json({
        success: true,
        data: facilities.sortedFeatures
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching facility features',
        error: error.message
      });
    }
  }

  async updateFacilityFeatures(req, res) {
    try {
      const { features } = req.body;
      
      if (!features || !Array.isArray(features)) {
        return res.status(400).json({
          success: false,
          message: 'Features array is required'
        });
      }
      
      const facilities = await Facilities.findOne({ isActive: true });
      facilities.facilityFeatures = features;
      await facilities.save();
      
      res.status(200).json({
        success: true,
        message: 'Facility features updated successfully',
        data: facilities.sortedFeatures
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating facility features',
        error: error.message
      });
    }
  }

  async addFacilityFeature(req, res) {
    try {
      console.log('addFacilityFeature - req.body:', req.body);
      console.log('addFacilityFeature - req.file:', req.file);
      
      const { title, description, layout, order, image, images } = req.body;
      
      // Handle image from file upload or from request body
      let imagePath = null;
      if (req.file) {
        imagePath = `/uploads/images/facilities-page/${req.file.filename}`;
      } else if (image) {
        imagePath = image;
      } else {
        // Use default placeholder image
        imagePath = '/images/placeholder-facility.jpg';
      }
      
      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: 'Title and description are required'
        });
      }
      
      const facilities = await Facilities.findOne({ isActive: true });
      
      // Xử lý mảng images nếu có
      let processedImages = [];
      if (Array.isArray(images)) {
        processedImages = images;
      } else if (typeof images === 'string') {
        try {
          processedImages = JSON.parse(images);
        } catch (e) {
          console.error('Error parsing images JSON:', e);
          // Nếu parse JSON lỗi, tạo một mảng images đơn giản với ảnh chính
          processedImages = [{
            url: imagePath,
            alt: `${title.trim()} image`,
            order: 0
          }];
        }
      } else if (imagePath) {
        // Nếu không có mảng images nhưng có image path, thêm image path vào mảng images
        processedImages = [{
          url: imagePath,
          alt: `${title.trim()} image`,
          order: 0
        }];
      }
      
      const newFeature = {
        title: title.trim(),
        description: description.trim(),
        image: imagePath,
        imageAlt: req.body.imageAlt || `${title.trim()} Facilities`,
        images: processedImages,
        order: order || facilities.facilityFeatures.length + 1,
        layout: layout || 'left'
      };
      
      console.log('Adding new feature:', newFeature);
      await facilities.addFeature(newFeature);
      
      res.status(201).json({
        success: true,
        message: 'Facility feature added successfully',
        data: facilities.sortedFeatures
      });
    } catch (error) {
      console.error('Error adding facility feature:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding facility feature',
        error: error.message
      });
    }
  }

  async updateFacilityFeature(req, res) {
    try {
      const { featureId } = req.params;
      const updateData = { ...req.body };
      
      // Handle image upload if present
      if (req.file) {
        updateData.image = `/uploads/images/facilities-page/${req.file.filename}`;
      }
      
      const facilities = await Facilities.findOne({ isActive: true });
      await facilities.updateFeature(featureId, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Facility feature updated successfully',
        data: facilities.sortedFeatures
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating facility feature',
        error: error.message
      });
    }
  }

  async deleteFacilityFeature(req, res) {
    try {
      const { featureId } = req.params;
      console.log(`Attempting to delete facility feature with ID: ${featureId}`);
      
      if (!featureId) {
        return res.status(400).json({
          success: false,
          message: 'Feature ID is required'
        });
      }
      
      const facilities = await Facilities.findOne({ isActive: true });
      
      if (!facilities) {
        return res.status(404).json({
          success: false,
          message: 'Facilities data not found'
        });
      }
      
      // Log tất cả các id của features để debug
      const allFeatureIds = facilities.facilityFeatures.map(f => ({
        _id: f._id.toString(),
        title: f.title
      }));
      console.log('Available feature IDs:', JSON.stringify(allFeatureIds, null, 2));
      console.log('Trying to delete ID:', featureId);
      
      // Kiểm tra feature có tồn tại không bằng cách so sánh chuỗi ID
      const featureExists = facilities.facilityFeatures.find(f => f._id.toString() === featureId);
      if (!featureExists) {
        return res.status(404).json({
          success: false,
          message: 'Feature not found with the given ID'
        });
      }
      
      console.log('Found feature to delete:', featureExists.title);
      
      // Lưu độ dài mảng features trước khi xóa để kiểm tra sau
      const beforeLength = facilities.facilityFeatures.length;
      
      // Phương pháp 1: Sử dụng pull mongoose
      try {
        facilities.facilityFeatures.pull({ _id: featureId });
      } catch (pullError) {
        console.error('Error using pull method:', pullError);
      }
      
      // Phương pháp 2: Sử dụng updateOne để xóa feature
      if (facilities.facilityFeatures.length === beforeLength) {
        try {
          await Facilities.updateOne(
            { _id: facilities._id },
            { $pull: { facilityFeatures: { _id: featureId } } }
          );
          // Tải lại dữ liệu sau khi cập nhật
          await facilities.reload();
        } catch (updateError) {
          console.error('Error using updateOne method:', updateError);
        }
      }
      
      // Phương pháp 3: Sử dụng filter
      if (facilities.facilityFeatures.length === beforeLength) {
        facilities.facilityFeatures = facilities.facilityFeatures.filter(f => 
          f._id.toString() !== featureId
        );
      }
      
      // Kiểm tra xem đã xóa thành công chưa
      const afterLength = facilities.facilityFeatures.length;
      
      if (beforeLength === afterLength) {
        console.error('CRITICAL ERROR: Failed to delete feature after trying multiple methods');
        return res.status(500).json({
          success: false,
          message: 'Failed to delete feature despite multiple attempts'
        });
      } else {
        console.log(`Deletion successful: ${beforeLength} -> ${afterLength} features`);
      }
      
      // Lưu thay đổi
      await facilities.save();
      
      console.log(`Successfully deleted facility feature with ID: ${featureId}`);
      
      res.status(200).json({
        success: true,
        message: 'Facility feature deleted successfully',
        data: facilities.sortedFeatures
      });
    } catch (error) {
      console.error("Error deleting facility feature:", error);
      res.status(500).json({
        success: false,
        message: 'Error deleting facility feature',
        error: error.message
      });
    }
  }

  // ==================== FACILITY FEATURE BY ID ====================
  
  async getFacilityFeatureById(req, res) {
    try {
      const { featureId } = req.params;
      
      const facilities = await Facilities.findOne({ isActive: true });
      const feature = facilities.facilityFeatures.id(featureId);
      
      if (!feature) {
        return res.status(404).json({
          success: false,
          message: 'Facility feature not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: feature
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching facility feature',
        error: error.message
      });
    }
  }

  // ==================== PAGE SETTINGS ====================
  
  async updatePageSettings(req, res) {
    try {
      const { pageTitle, pageDescription, seo } = req.body;
      
      const facilities = await Facilities.findOne({ isActive: true });
      
      if (pageTitle) facilities.pageTitle = pageTitle.trim();
      if (pageDescription) facilities.pageDescription = pageDescription.trim();
      if (seo) {
        facilities.seo = { ...facilities.seo, ...seo };
      }
      
      await facilities.save();
      
      res.status(200).json({
        success: true,
        message: 'Page settings updated successfully',
        data: {
          pageTitle: facilities.pageTitle,
          pageDescription: facilities.pageDescription,
          seo: facilities.seo
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

  // ==================== REORDER FEATURES ====================
  
  async reorderFeatures(req, res) {
    try {
      const { featureIds } = req.body;
      
      if (!featureIds || !Array.isArray(featureIds)) {
        return res.status(400).json({
          success: false,
          message: 'Feature IDs array is required'
        });
      }
      
      const facilities = await Facilities.findOne({ isActive: true });
      
      // Update order based on array position
      featureIds.forEach((featureId, index) => {
        const feature = facilities.facilityFeatures.id(featureId);
        if (feature) {
          feature.order = index + 1;
        }
      });
      
      await facilities.save();
      
      res.status(200).json({
        success: true,
        message: 'Features reordered successfully',
        data: facilities.sortedFeatures
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error reordering features',
        error: error.message
      });
    }
  }

  // ==================== REORDER METRICS ====================
  
  async reorderMetrics(req, res) {
    try {
      const { metricIds } = req.body;
      
      if (!metricIds || !Array.isArray(metricIds)) {
        return res.status(400).json({
          success: false,
          message: 'Metric IDs array is required'
        });
      }
      
      const facilities = await Facilities.findOne({ isActive: true });
      
      // Update order based on array position
      metricIds.forEach((metricId, index) => {
        const metric = facilities.keyMetrics.id(metricId);
        if (metric) {
          metric.order = index + 1;
        }
      });
      
      await facilities.save();
      
      res.status(200).json({
        success: true,
        message: 'Metrics reordered successfully',
        data: facilities.sortedMetrics
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error reordering metrics',
        error: error.message
      });
    }
  }

  // ==================== FEATURE IMAGES MANAGEMENT ====================
  
  async addFeatureImages(req, res) {
    try {
      const { featureId } = req.params;
      const files = req.files;
      
      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No images uploaded'
        });
      }
      
      const facilities = await Facilities.findOne({ isActive: true });
      const feature = facilities.facilityFeatures.id(featureId);
      
      if (!feature) {
        return res.status(404).json({
          success: false,
          message: 'Feature not found'
        });
      }
      
      // Initialize images array if it doesn't exist
      if (!feature.images) {
        feature.images = [];
      }
      
      // Add new images
      const imageAlt = req.body.imageAlt || feature.title;
      const newImages = files.map((file, index) => {
        return {
          url: `/uploads/images/facilities-page/${file.filename}`,
          alt: `${imageAlt} ${feature.images.length + index + 1}`,
          order: feature.images.length + index + 1
        };
      });
      
      feature.images.push(...newImages);
      
      // If this is the first image, set it as the main image
      if (feature.images.length === newImages.length) {
        feature.image = feature.images[0].url;
      }
      
      await facilities.save();
      
      res.status(201).json({
        success: true,
        message: 'Feature images added successfully',
        data: feature.images.sort((a, b) => a.order - b.order)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error adding feature images',
        error: error.message
      });
    }
  }
  
  async updateFeatureImage(req, res) {
    try {
      const { featureId, imageIndex } = req.params;
      const { alt } = req.body;
      const url = req.file ? `/uploads/images/facilities-page/${req.file.filename}` : null;
      
      const facilities = await Facilities.findOne({ isActive: true });
      const feature = facilities.facilityFeatures.id(featureId);
      
      if (!feature) {
        return res.status(404).json({
          success: false,
          message: 'Feature not found'
        });
      }
      
      if (!feature.images || !feature.images[imageIndex]) {
        return res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }
      
      // Update image properties
      if (url) {
        feature.images[imageIndex].url = url;
      }
      
      if (alt) {
        feature.images[imageIndex].alt = alt;
      }
      
      // If this is the main image, update feature.image as well
      if (feature.image === feature.images[imageIndex].url && url) {
        feature.image = url;
      }
      
      await facilities.save();
      
      res.status(200).json({
        success: true,
        message: 'Feature image updated successfully',
        data: feature.images.sort((a, b) => a.order - b.order)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating feature image',
        error: error.message
      });
    }
  }
  
  async deleteFeatureImage(req, res) {
    try {
      const { featureId, imageIndex } = req.params;
      
      console.log(`Attempting to delete feature image - featureId: ${featureId}, imageIndex: ${imageIndex}`);
      
      // Tìm facilities document
      const facilities = await Facilities.findOne({ isActive: true });
      
      if (!facilities) {
        console.log('Facilities document not found');
        return res.status(404).json({
          success: false,
          message: 'Facilities data not found'
        });
      }
      
      // Tìm feature cụ thể
      const feature = facilities.facilityFeatures.id(featureId);
      
      if (!feature) {
        console.log(`Feature not found with ID: ${featureId}`);
        return res.status(404).json({
          success: false,
          message: 'Feature not found'
        });
      }
      
      if (!feature.images || !feature.images[imageIndex]) {
        console.log(`Image not found at index ${imageIndex} for feature ${featureId}`);
        return res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }
      
      // Check if this is the main image
      const isMainImage = feature.image === feature.images[imageIndex].url;
      console.log(`Is main image: ${isMainImage}, Main image URL: ${feature.image}, Image URL: ${feature.images[imageIndex].url}`);
      
      // Log the images array before deletion
      console.log(`Images before deletion: ${JSON.stringify(feature.images)}`);
      
      // Store the image URL being deleted for verification
      const imageUrlToDelete = feature.images[imageIndex].url;
      
      // Tạo một mảng mới thay vì sử dụng splice để tránh vấn đề với mongoose
      feature.images = feature.images.filter((_, idx) => idx !== parseInt(imageIndex));
      
      // Log the images array after deletion
      console.log(`Images after deletion: ${JSON.stringify(feature.images)}`);
      
      // Verify if the image was actually removed
      const imageStillExists = feature.images.some(img => img.url === imageUrlToDelete);
      console.log(`Image still exists after deletion: ${imageStillExists}`);
      
      // If we removed the main image, update it to the first available image if any exist
      if (isMainImage && feature.images.length > 0) {
        feature.image = feature.images[0].url;
        console.log(`Updated main image to: ${feature.image}`);
      } else if (isMainImage) {
        // No images left, clear the main image
        feature.image = '';
        console.log('Cleared main image as no images remain');
      }
      
      // Đánh dấu subdocument là đã sửa đổi
      feature.markModified('images');
      
      // Save changes to the database
      await facilities.save();
      console.log('Successfully saved changes to database');
      
      // Thực hiện một truy vấn trực tiếp để đảm bảo cập nhật
      await Facilities.updateOne(
        { _id: facilities._id, "facilityFeatures._id": featureId },
        { 
          $set: { 
            "facilityFeatures.$.images": feature.images,
            "facilityFeatures.$.image": feature.image
          }
        }
      );
      
      res.status(200).json({
        success: true,
        message: 'Feature image deleted successfully',
        data: feature.images.sort((a, b) => a.order - b.order)
      });
    } catch (error) {
      console.error(`Error deleting feature image: ${error.message}`);
      console.error(error.stack);
      res.status(500).json({
        success: false,
        message: 'Error deleting feature image',
        error: error.message
      });
    }
  }
  
  async reorderFeatureImages(req, res) {
    try {
      const { featureId } = req.params;
      const { imageIndexes } = req.body;
      
      if (!imageIndexes || !Array.isArray(imageIndexes)) {
        return res.status(400).json({
          success: false,
          message: 'Image indexes array is required'
        });
      }
      
      const facilities = await Facilities.findOne({ isActive: true });
      const feature = facilities.facilityFeatures.id(featureId);
      
      if (!feature) {
        return res.status(404).json({
          success: false,
          message: 'Feature not found'
        });
      }
      
      if (!feature.images || feature.images.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No feature images found'
        });
      }
      
      // Create a new array of reordered images
      const reorderedImages = [];
      imageIndexes.forEach((index, newOrder) => {
        if (feature.images[index]) {
          const image = {...feature.images[index]};
          image.order = newOrder + 1;
          reorderedImages.push(image);
        }
      });
      
      feature.images = reorderedImages;
      
      await facilities.save();
      
      res.status(200).json({
        success: true,
        message: 'Feature images reordered successfully',
        data: feature.images.sort((a, b) => a.order - b.order)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error reordering feature images',
        error: error.message
      });
    }
  }

  // ==================== UPLOAD MULTIPLE FEATURE IMAGES ====================
  async uploadMultipleFeatureImages(req, res) {
    try {
      console.log('uploadMultipleFeatureImages - req.files:', req.files?.length);
      
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'No images uploaded' 
        });
      }
      
      // Tạo URLs cho các ảnh đã upload
      const urls = req.files.map(file => `/uploads/images/facilities-page/${file.filename}`);
      
      console.log('Generated image URLs:', urls);
      
      res.status(200).json({ 
        success: true, 
        message: `Successfully uploaded ${urls.length} images`,
        urls 
      });
    } catch (error) {
      console.error('uploadMultipleFeatureImages error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error uploading images', 
        error: error.message 
      });
    }
  }
}

module.exports = {
  FacilitiesController: new FacilitiesController(),
  upload,
  uploadFeatureImages
};