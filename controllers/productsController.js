const Product = require('../models/Products');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images/product-page/');
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
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Multer middleware for multiple application images
const uploadApplicationImages = upload.array('applicationImages', 10); // Allow up to 10 images

// ProductsController object
const ProductsController = {
  
  // ==================== GET ALL PRODUCTS DATA ====================
  
  async getProductsData(req, res) {
    try {
      const products = await Product.getActiveProducts();
      
      // Transform for frontend (products page)
      const productsData = products.map(product => ({
        id: product._id,
        name: product.name,
        slug: product.slug,
        galleryImages: product.sortedGalleryImages,
        carouselSettings: product.carouselSettings,
        order: product.order
      }));
      
      res.status(200).json({
        success: true,
        data: {
          products: productsData,
          totalProducts: products.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching products data',
        error: error.message
      });
    }
  },

  // GET products statistics
  async getProductsStats(req, res) {
    try {
      const totalProducts = await Product.countDocuments({});
      const activeProducts = await Product.countDocuments({ active: true });
      const featuredProducts = await Product.countDocuments({ featured: true });
      
      res.status(200).json({
        success: true,
        data: {
          totalProducts,
          activeProducts,
          featuredProducts
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching products statistics',
        error: error.message
      });
    }
  },
  
  // Search products
  async searchProducts(req, res) {
    try {
      const { query, limit = 10 } = req.query;
      
      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }
      
      const searchRegex = new RegExp(query, 'i');
      const products = await Product.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { 'seo.keywords': searchRegex }
        ]
      }).limit(parseInt(limit));
      
      res.status(200).json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error searching products',
        error: error.message
      });
    }
  },

  // ==================== PRODUCTS MANAGEMENT ====================
  
  async getAllProducts(req, res) {
    try {
      const { includeInactive = false } = req.query;
      
      let products;
      if (includeInactive === 'true') {
        products = await Product.find({}).sort({ order: 1 });
      } else {
        products = await Product.getActiveProducts();
      }
      
      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching products',
        error: error.message
      });
    }
  },

  // Get featured products
  async getFeaturedProducts(req, res) {
    try {
      const products = await Product.find({ featured: true, active: true }).sort({ order: 1 });
      
      const featuredProducts = products.map(product => ({
        id: product._id,
        name: product.name,
        slug: product.slug,
        mainImage: product.mainImage,
        description: product.description,
        order: product.order
      }));
      
      res.status(200).json({
        success: true,
        data: featuredProducts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching featured products',
        error: error.message
      });
    }
  },

  // Toggle featured status
  async toggleFeaturedStatus(req, res) {
    try {
      const { productId } = req.params;
      
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      product.featured = !product.featured;
      await product.save();
      
      res.status(200).json({
        success: true,
        message: `Product is ${product.featured ? 'now' : 'no longer'} featured`,
        data: {
          id: product._id,
          featured: product.featured
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error toggling featured status',
        error: error.message
      });
    }
  },

  // Reorder products
  async reorderProducts(req, res) {
    try {
      const { productIds } = req.body;
      
      if (!productIds || !Array.isArray(productIds)) {
        return res.status(400).json({
          success: false,
          message: 'Product IDs array is required'
        });
      }
      
      // Update order for each product
      const updates = productIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id },
          update: { order: index + 1 }
        }
      }));
      
      await Product.bulkWrite(updates);
      
      res.status(200).json({
        success: true,
        message: 'Products reordered successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error reordering products',
        error: error.message
      });
    }
  },

  async createProduct(req, res) {
    try {
      const { name, description, order, carouselSettings, seo } = req.body;
      const mainImage = req.file ? `/uploads/images/product-page/${req.file.filename}` : req.body.mainImage;
      
      if (!name || !description || !mainImage) {
        return res.status(400).json({
          success: false,
          message: 'Name, description, and main image are required'
        });
      }
      
      const productData = {
        name: name.trim().toUpperCase(),
        description: description.trim(),
        mainImage,
        order: order || 0,
        carouselSettings: carouselSettings || {},
        seo: seo || {}
      };
      
      const product = new Product(productData);
      await product.save();
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({
          success: false,
          message: 'Product with this name already exists'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error creating product',
          error: error.message
        });
      }
    }
  },

  async getProductById(req, res) {
    try {
      const { productId } = req.params;
      
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching product',
        error: error.message
      });
    }
  },

  async getProductBySlug(req, res) {
    try {
      const { slug } = req.params;
      
      const product = await Product.findBySlug(slug);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      // Transform for product details page
      const productDetails = {
        id: product._id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        mainImage: product.mainImage,
        mainImageAlt: product.mainImageAlt,
        features: product.sortedFeatures,
        applications: product.sortedApplications,
        seo: product.seo,
        galleryImages: product.sortedGalleryImages
      };
      
      res.status(200).json({
        success: true,
        data: productDetails
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching product',
        error: error.message
      });
    }
  },

  async updateProduct(req, res) {
    try {
      const { productId } = req.params;
      const updateData = { ...req.body };
      // Clean up data
      if (updateData.name) updateData.name = updateData.name.trim().toUpperCase();
      if (updateData.description) updateData.description = updateData.description.trim();
      // Xử lý xóa ảnh galleryImages nếu có
      let removeIds = [];
      if (updateData.removeGalleryImageIds) {
        try {
          removeIds = JSON.parse(updateData.removeGalleryImageIds);
        } catch (e) {
          removeIds = Array.isArray(updateData.removeGalleryImageIds) ? updateData.removeGalleryImageIds : [];
        }
      }
      // Lấy product
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      // Xóa ảnh galleryImages nếu có
      if (removeIds.length > 0) {
        product.galleryImages = product.galleryImages.filter(img => !removeIds.includes(String(img._id)));
      }
      // Thêm ảnh galleryImages mới nếu có
      if (req.files && req.files.galleryImages && req.files.galleryImages.length > 0) {
        req.files.galleryImages.forEach(file => {
          product.galleryImages.push({
            url: `/uploads/images/product-page/${file.filename}`,
            alt: updateData.name || product.name,
            order: product.galleryImages.length + 1
          });
        });
      }
      // Cập nhật name, order nếu có
      if (updateData.name) product.name = updateData.name;
      if (updateData.order !== undefined) product.order = Number(updateData.order);
      // Cập nhật mainImage nếu có
      if (req.files && req.files.mainImage && req.files.mainImage[0]) {
        product.mainImage = `/uploads/images/product-page/${req.files.mainImage[0].filename}`;
      }
      // Cập nhật description nếu có
      if (updateData.description) product.description = updateData.description;
      await product.save();
      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating product',
        error: error.message
      });
    }
  },

  async deleteProduct(req, res) {
    try {
      const { productId } = req.params;
      
      const product = await Product.findByIdAndDelete(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting product',
        error: error.message
      });
    }
  },

  async toggleProductStatus(req, res) {
    try {
      const { productId } = req.params;
      
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      product.isActive = !product.isActive;
      await product.save();
      
      res.status(200).json({
        success: true,
        message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
        data: {
          id: product._id,
          isActive: product.isActive
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error toggling product status',
        error: error.message
      });
    }
  },

  // ==================== APPLICATIONS MANAGEMENT ====================
  
  async addApplication(req, res) {
    try {
      const { productId } = req.params;
      const { title, content, order } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: 'Title and content are required'
        });
      }
      
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      // Handle uploaded application images if present
      if (req.files && req.files.length > 0) {
        const images = req.files.map((file, index) => {
          return {
            url: `/uploads/images/product-page/${file.filename}`,
            alt: `${content.heading || title} Image ${index + 1}`,
            order: index + 1
          };
        });
        content.images = images;
        
        // For backward compatibility, set the first image as the main image
        if (images.length > 0) {
          content.image = images[0].url;
        }
      } else if (req.file) { // For backward compatibility
        content.image = `/uploads/images/product-page/${req.file.filename}`;
        content.images = [{
          url: content.image,
          alt: content.heading || title,
          order: 1
        }];
      }
      
      const applicationData = {
        title: title.trim(),
        content,
        order: order || product.applications.length + 1
      };
      
      await product.addApplication(applicationData);
      
      res.status(201).json({
        success: true,
        message: 'Application added successfully',
        data: product.sortedApplications
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error adding application',
        error: error.message
      });
    }
  },

  async updateApplication(req, res) {
    try {
      const { productId, applicationId } = req.params;
      const updateData = { ...req.body };
      
      if (updateData.title) updateData.title = updateData.title.trim();
      
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      // Get the application to update
      const application = product.applications.id(applicationId);
      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }
      
      // Handle uploaded application images if present
      if (req.files && req.files.length > 0) {
        // Create images array from uploaded files
        const newImages = req.files.map((file, index) => {
          return {
            url: `/uploads/images/product-page/${file.filename}`,
            alt: updateData.content?.heading || application.content.heading,
            order: (application.content.images?.length || 0) + index + 1
          };
        });
        
        // Merge with existing images or create new array
        if (!updateData.content) {
          updateData.content = {};
        }
        
        if (application.content.images && application.content.images.length > 0) {
          updateData.content.images = [...application.content.images, ...newImages];
        } else {
          updateData.content.images = newImages;
        }
        
        // For backward compatibility, update the main image if no image exists
        if (!application.content.image && newImages.length > 0) {
          updateData.content.image = newImages[0].url;
        }
      } else if (req.file) { // For backward compatibility
        if (!updateData.content) {
          updateData.content = {};
        }
        updateData.content.image = `/uploads/images/product-page/${req.file.filename}`;
        
        // Also add to images array if it doesn't exist
        if (!application.content.images || application.content.images.length === 0) {
          updateData.content.images = [{
            url: updateData.content.image,
            alt: updateData.content?.heading || application.content.heading,
            order: 1
          }];
        }
      }
      
      await product.updateApplication(applicationId, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Application updated successfully',
        data: product.sortedApplications
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating application',
        error: error.message
      });
    }
  },

  async deleteApplication(req, res) {
    try {
      const { productId, applicationId } = req.params;
      
      console.log(`Attempting to delete application - productId: ${productId}, applicationId: ${applicationId}`);
      
      const product = await Product.findById(productId);
      
      if (!product) {
        console.log(`Product not found with ID: ${productId}`);
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      const application = product.applications.id(applicationId);
      if (!application) {
        console.log(`Application not found with ID: ${applicationId} in product ${productId}`);
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }
      
      // Thay thế application.remove() bằng phương thức pull
      product.applications.pull({ _id: applicationId });
      await product.save();
      
      console.log(`Successfully deleted application ${applicationId} from product ${productId}`);
      
      res.status(200).json({
        success: true,
        message: 'Application deleted successfully',
        data: product.sortedApplications
      });
    } catch (error) {
      console.error(`Error deleting application: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Error deleting application',
        error: error.message
      });
    }
  },

  // Reorder applications
  async reorderApplications(req, res) {
    try {
      const { productId } = req.params;
      const { applicationIds } = req.body;
      
      if (!applicationIds || !Array.isArray(applicationIds)) {
        return res.status(400).json({
          success: false,
          message: 'Application IDs array is required'
        });
      }
      
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      // Update order for each application
      applicationIds.forEach((id, index) => {
        const application = product.applications.id(id);
        if (application) {
          application.order = index + 1;
        }
      });
      
      await product.save();
      
      res.status(200).json({
        success: true,
        message: 'Applications reordered successfully',
        data: product.sortedApplications
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error reordering applications',
        error: error.message
      });
    }
  },

  // ==================== APPLICATION IMAGES MANAGEMENT ====================
  
  // Add an image to an application
  async addApplicationImage(req, res) {
    try {
      const { productId, applicationId } = req.params;
      
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      const application = product.applications.id(applicationId);
      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Image file is required'
        });
      }
      
      const imageUrl = `/uploads/images/product-page/${req.file.filename}`;
      
      // Create new image object
      const newImage = {
        url: imageUrl,
        alt: req.body.alt || application.content.heading,
        order: (application.content.images?.length || 0) + 1
      };
      
      // Initialize images array if it doesn't exist
      if (!application.content.images) {
        application.content.images = [];
      }
      
      // Add new image
      application.content.images.push(newImage);
      
      // Set the first image as the main image if no main image exists (for backward compatibility)
      if (!application.content.image && application.content.images.length === 1) {
        application.content.image = imageUrl;
      }
      
      await product.save();
      
      res.status(201).json({
        success: true,
        message: 'Application image added successfully',
        data: application.content.images
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error adding application image',
        error: error.message
      });
    }
  },

  // Update an application image
  async updateApplicationImage(req, res) {
    try {
      const { productId, applicationId, imageIndex } = req.params;
      const { alt, order } = req.body;
      
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      const application = product.applications.id(applicationId);
      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }
      
      if (!application.content.images || !application.content.images[imageIndex]) {
        return res.status(404).json({
          success: false,
          message: 'Application image not found'
        });
      }
      
      // Update image properties
      if (alt !== undefined) {
        application.content.images[imageIndex].alt = alt;
      }
      
      if (order !== undefined) {
        application.content.images[imageIndex].order = order;
      }
      
      // If a new image is uploaded, update the URL
      if (req.file) {
        const imageUrl = `/uploads/images/product-page/${req.file.filename}`;
        application.content.images[imageIndex].url = imageUrl;
        
        // Update main image if this is the first image (for backward compatibility)
        if (imageIndex === 0 || application.content.images[imageIndex].url === application.content.image) {
          application.content.image = imageUrl;
        }
      }
      
      await product.save();
      
      res.status(200).json({
        success: true,
        message: 'Application image updated successfully',
        data: application.content.images
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating application image',
        error: error.message
      });
    }
  },

  // Delete an application image
  async deleteApplicationImage(req, res) {
    try {
      const { productId, applicationId, imageIndex } = req.params;
      
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      const application = product.applications.id(applicationId);
      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }
      
      if (!application.content.images || !application.content.images[imageIndex]) {
        return res.status(404).json({
          success: false,
          message: 'Application image not found'
        });
      }
      
      // Check if this is the image referenced in the main image field
      const isMainImage = application.content.image === application.content.images[imageIndex].url;
      
      // Remove the image
      application.content.images.splice(imageIndex, 1);
      
      // If we removed the main image, update it to the first available image if any exist
      if (isMainImage && application.content.images.length > 0) {
        application.content.image = application.content.images[0].url;
      } else if (isMainImage) {
        // No images left, clear the main image
        application.content.image = '';
      }
      
      await product.save();
      
      res.status(200).json({
        success: true,
        message: 'Application image deleted successfully',
        data: application.content.images
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting application image',
        error: error.message
      });
    }
  },

  // Reorder application images
  async reorderApplicationImages(req, res) {
    try {
      const { productId, applicationId } = req.params;
      const { imageIndexes } = req.body;
      
      if (!imageIndexes || !Array.isArray(imageIndexes)) {
        return res.status(400).json({
          success: false,
          message: 'Image indexes array is required'
        });
      }
      
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      const application = product.applications.id(applicationId);
      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }
      
      if (!application.content.images || application.content.images.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No application images found'
        });
      }
      
      // Create a new array of reordered images
      const reorderedImages = [];
      imageIndexes.forEach((index, newOrder) => {
        if (application.content.images[index]) {
          const image = {...application.content.images[index]};
          image.order = newOrder + 1;
          reorderedImages.push(image);
        }
      });
      
      application.content.images = reorderedImages;
      
      await product.save();
      
      res.status(200).json({
        success: true,
        message: 'Application images reordered successfully',
        data: application.content.images
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error reordering application images',
        error: error.message
      });
    }
  },

  // ==================== GALLERY IMAGES MANAGEMENT ====================
  
  async addGalleryImage(req, res) {
    try {
      const { productId } = req.params;
      const { alt, order } = req.body;
      const url = req.file ? `/uploads/images/product-page/${req.file.filename}` : '';
      
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      if (!product.gallery) {
        product.gallery = {
          images: []
        };
      }
      
      if (!product.gallery.images) {
        product.gallery.images = [];
      }
      
      // Add the new image to gallery
      product.gallery.images.push({
        url,
        alt: alt || '',
        order: order || product.gallery.images.length + 1
      });
      
      await product.save();
      
      res.status(201).json({
        success: true,
        message: 'Gallery image added successfully',
        data: product.gallery.images
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error adding gallery image',
        error: error.message
      });
    }
  },

  // Update a gallery image
  async updateGalleryImage(req, res) {
    try {
      const { productId, imageIndex } = req.params;
      const { alt, order } = req.body;
      
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      if (!product.gallery || !product.gallery.images || !product.gallery.images[imageIndex]) {
        return res.status(404).json({
          success: false,
          message: 'Gallery image not found'
        });
      }
      
      // Update image properties
      if (alt !== undefined) {
        product.gallery.images[imageIndex].alt = alt;
      }
      
      if (order !== undefined) {
        product.gallery.images[imageIndex].order = order;
      }
      
      // If a new image is uploaded, update the URL
      if (req.file) {
        product.gallery.images[imageIndex].url = `/uploads/images/product-page/${req.file.filename}`;
      }
      
      await product.save();
      
      res.status(200).json({
        success: true,
        message: 'Gallery image updated successfully',
        data: product.gallery.images
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating gallery image',
        error: error.message
      });
    }
  },

  // Delete a gallery image
  async deleteGalleryImage(req, res) {
    try {
      const { productId, imageIndex } = req.params;
      
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      if (!product.gallery || !product.gallery.images || !product.gallery.images[imageIndex]) {
        return res.status(404).json({
          success: false,
          message: 'Gallery image not found'
        });
      }
      
      // Remove the image
      product.gallery.images.splice(imageIndex, 1);
      
      await product.save();
      
      res.status(200).json({
        success: true,
        message: 'Gallery image deleted successfully',
        data: product.gallery.images
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting gallery image',
        error: error.message
      });
    }
  },

  // Reorder gallery images
  async reorderGalleryImages(req, res) {
    try {
      const { productId } = req.params;
      const { imageIndexes } = req.body;
      
      if (!imageIndexes || !Array.isArray(imageIndexes)) {
        return res.status(400).json({
          success: false,
          message: 'Image indexes array is required'
        });
      }
      
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      if (!product.gallery || !product.gallery.images || product.gallery.images.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No gallery images found'
        });
      }
      
      // Create a new array of reordered images
      const reorderedImages = [];
      imageIndexes.forEach((index, newOrder) => {
        if (product.gallery.images[index]) {
          const image = {...product.gallery.images[index]};
          image.order = newOrder + 1;
          reorderedImages.push(image);
        }
      });
      
      product.gallery.images = reorderedImages;
      
      await product.save();
      
      res.status(200).json({
        success: true,
        message: 'Gallery images reordered successfully',
        data: product.gallery.images
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error reordering gallery images',
        error: error.message
      });
    }
  },

  // ==================== FEATURES MANAGEMENT ====================
  
  // Add a feature to a product
  async addFeature(req, res) {
    try {
      const { productId } = req.params;
      const { title, description, icon, order } = req.body;
      
      if (!title) {
        return res.status(400).json({
          success: false,
          message: 'Feature title is required'
        });
      }
      
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      if (!product.features) {
        product.features = [];
      }
      
      product.features.push({
        title,
        description: description || '',
        icon: icon || '',
        order: order || product.features.length + 1
      });
      
      await product.save();
      
      res.status(201).json({
        success: true,
        message: 'Feature added successfully',
        data: product.sortedFeatures
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error adding feature',
        error: error.message
      });
    }
  },

  // Update a feature
  async updateFeature(req, res) {
    try {
      const { productId, featureId } = req.params;
      const { title, description, icon, order } = req.body;
      
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      const feature = product.features.id(featureId);
      if (!feature) {
        return res.status(404).json({
          success: false,
          message: 'Feature not found'
        });
      }
      
      if (title) feature.title = title;
      if (description !== undefined) feature.description = description;
      if (icon !== undefined) feature.icon = icon;
      if (order !== undefined) feature.order = order;
      
      await product.save();
      
      res.status(200).json({
        success: true,
        message: 'Feature updated successfully',
        data: product.sortedFeatures
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating feature',
        error: error.message
      });
    }
  },

  // Delete a feature
  async deleteFeature(req, res) {
    try {
      const { productId, featureId } = req.params;
      
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      const feature = product.features.id(featureId);
      if (!feature) {
        return res.status(404).json({
          success: false,
          message: 'Feature not found'
        });
      }
      
      product.features.id(featureId).remove();
      await product.save();
      
      res.status(200).json({
        success: true,
        message: 'Feature deleted successfully',
        data: product.sortedFeatures
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting feature',
        error: error.message
      });
    }
  },

  // Reorder features
  async reorderFeatures(req, res) {
    try {
      const { productId } = req.params;
      const { featureIds } = req.body;
      
      if (!featureIds || !Array.isArray(featureIds)) {
        return res.status(400).json({
          success: false,
          message: 'Feature IDs array is required'
        });
      }
      
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
        success: false,
          message: 'Product not found'
      });
  }

      // Update order for each feature
      featureIds.forEach((id, index) => {
        const feature = product.features.id(id);
        if (feature) {
          feature.order = index + 1;
      }
      });
      
      await product.save();
      
      res.status(200).json({
        success: true,
        message: 'Features reordered successfully',
        data: product.sortedFeatures
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error reordering features',
        error: error.message
      });
    }
  },
};

module.exports = ProductsController;
