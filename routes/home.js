// routes/home.js
const express = require('express');
const router = express.Router();
const { HomeController, uploadConfigs, upload } = require('../controllers/homeController');
const { processUploadedImages } = require('../middleware/imageProcessor');

// Debug middleware để kiểm tra request
router.use((req, res, next) => {
  console.log(`[HOME ROUTE] ${req.method} ${req.path}`);
  if (req.files) {
    console.log('Files in request:', Object.keys(req.files));
  }
  next();
});

// ==================== HERO SECTION ROUTES ====================
router.get('/hero', HomeController.getHero);
router.put('/hero', uploadConfigs.hero, processUploadedImages, HomeController.updateHero);
router.post('/hero/video', uploadConfigs.hero, processUploadedImages, HomeController.updateHeroVideo);

// Heroes (multiple banners)
router.put('/heroes', upload.any(), processUploadedImages, HomeController.updateHeroes);

// ==================== HOME SECTIONS ROUTES ====================
router.get('/sections', HomeController.getHomeSections);
router.put('/sections', uploadConfigs.sections, processUploadedImages, HomeController.updateHomeSections);

// ==================== CUSTOMERS ROUTES ====================
router.get('/customers', HomeController.getCustomers);
router.put('/customers', uploadConfigs.customers, processUploadedImages, HomeController.updateCustomers);
router.delete('/customers/:category/:id', HomeController.deleteCustomer);

// ==================== CERTIFICATIONS ROUTES ====================
router.get('/certifications', HomeController.getCertifications);
router.put('/certifications', uploadConfigs.certifications, processUploadedImages, HomeController.updateCertifications);

// ==================== HOME CONTACT ROUTES ====================
router.get('/contact-section', HomeController.getHomeContact);
router.put('/contact-section', HomeController.updateHomeContact);

// ==================== NEWS ROUTES ====================
router.get('/news', HomeController.getNews);
router.get('/news/all', HomeController.getAllPublishedNews); // Thêm route cho "View All News"
router.get('/news/:id', HomeController.getNewsById);
router.post('/news', uploadConfigs.news, processUploadedImages, HomeController.createNews);
router.put('/news/:id', uploadConfigs.news, processUploadedImages, HomeController.updateNews);
router.delete('/news/:id', HomeController.deleteNews);
router.get('/admin/news', HomeController.getAllNewsForAdmin); // Get ALL news for dashboard
router.post('/admin/news/bulk-update', HomeController.bulkUpdateNewsStatus);

// ==================== COMBINED DATA ROUTE ====================
router.get('/data', HomeController.getHomepageData);

// ==================== ERROR HANDLING ====================
router.use((error, req, res, next) => {
  console.error('Upload error details:', error);
  
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 100MB.'
    });
  }
  
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: `Unexpected field: ${error.field}. Please check your form data.`,
      field: error.field
    });
  }
  
  if (error.message === 'Only images and videos are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image and video files are allowed.'
    });
  }
  
  console.error('Upload error:', error);
  res.status(500).json({
    success: false,
    message: 'File upload error',
    error: error.message
  });
});

module.exports = router;