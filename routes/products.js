// routes/productsRoutes.js
const express = require('express');
const ProductsController = require('../controllers/productsController');
const multer = require('multer');
const path = require('path');
const { processUploadedImages } = require('../middleware/imageProcessor');

// Configure multer for image upload
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

const router = express.Router();

// ==================== MAIN DATA ROUTES ====================

// GET products data for frontend (products page)
router.get('/data', ProductsController.getProductsData);

// GET products statistics
router.get('/stats', ProductsController.getProductsStats);

// GET search products
router.get('/search', ProductsController.searchProducts);

// ==================== PRODUCTS ROUTES ====================

// GET all products (admin)
router.get('/', ProductsController.getAllProducts);

// POST create new product (with main image upload)
router.post('/', upload.single('mainImage'), processUploadedImages, ProductsController.createProduct);

// POST reorder products
router.post('/reorder', ProductsController.reorderProducts);

// GET featured products
router.get('/featured', ProductsController.getFeaturedProducts);

// GET product by slug (for product details page)
router.get('/slug/:slug', ProductsController.getProductBySlug);

// GET specific product by ID
router.get('/:productId', ProductsController.getProductById);

// PUT update specific product (with optional main image upload and gallery images upload)
router.put('/:productId', upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 }
]), processUploadedImages, ProductsController.updateProduct);

// DELETE specific product
router.delete('/:productId', ProductsController.deleteProduct);

// POST toggle product status (active/inactive)
router.post('/:productId/toggle', ProductsController.toggleProductStatus);

// POST toggle featured status
router.post('/:productId/toggle-featured', ProductsController.toggleFeaturedStatus);

// ==================== GALLERY IMAGES ROUTES ====================

// POST add gallery image to product (with image upload)
router.post('/:productId/gallery', upload.single('image'), processUploadedImages, ProductsController.addGalleryImage);

// PUT update gallery image (with optional image upload)
router.put('/:productId/gallery/:imageId', upload.single('image'), processUploadedImages, ProductsController.updateGalleryImage);

// DELETE gallery image
router.delete('/:productId/gallery/:imageId', ProductsController.deleteGalleryImage);

// POST reorder gallery images
router.post('/:productId/gallery/reorder', ProductsController.reorderGalleryImages);

// ==================== FEATURES ROUTES ====================

// POST add feature to product
router.post('/:productId/features', ProductsController.addFeature);

// PUT update feature
router.put('/:productId/features/:featureId', ProductsController.updateFeature);

// DELETE feature
router.delete('/:productId/features/:featureId', ProductsController.deleteFeature);

// POST reorder features
router.post('/:productId/features/reorder', ProductsController.reorderFeatures);

// ==================== APPLICATIONS ROUTES ====================

// POST add application to product (with multiple image upload support)
router.post('/:productId/applications', uploadApplicationImages, processUploadedImages, ProductsController.addApplication);

// PUT update application (with multiple image upload support)
router.put('/:productId/applications/:applicationId', uploadApplicationImages, processUploadedImages, ProductsController.updateApplication);

// DELETE application
router.delete('/:productId/applications/:applicationId', ProductsController.deleteApplication);
// Thêm route admin cho xóa application
router.delete('/admin/:productId/applications/:applicationId', ProductsController.deleteApplication);

// POST reorder applications
router.post('/:productId/applications/reorder', ProductsController.reorderApplications);

// ==================== APPLICATION IMAGES ROUTES ====================

// POST add image to an application
router.post('/:productId/applications/:applicationId/images', upload.single('image'), processUploadedImages, ProductsController.addApplicationImage);

// PUT update application image
router.put('/:productId/applications/:applicationId/images/:imageIndex', upload.single('image'), processUploadedImages, ProductsController.updateApplicationImage);

// DELETE application image
router.delete('/:productId/applications/:applicationId/images/:imageIndex', ProductsController.deleteApplicationImage);

// POST reorder application images
router.post('/:productId/applications/:applicationId/images/reorder', ProductsController.reorderApplicationImages);

module.exports = router;