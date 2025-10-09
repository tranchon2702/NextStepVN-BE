const express = require('express');
const { FacilitiesController, upload, uploadFeatureImages } = require('../controllers/facilitiesController');
const { processUploadedImages } = require('../middleware/imageProcessor');

const router = express.Router();

// ==================== MAIN DATA ROUTES ====================

// GET all facilities data (for frontend)
router.get('/data', FacilitiesController.getFacilitiesData);

// GET all facilities data (for admin)
router.get('/', FacilitiesController.getFacilitiesData);

// ==================== KEY METRICS ROUTES ====================

// GET all key metrics
router.get('/metrics', FacilitiesController.getKeyMetrics);

// PUT update all key metrics
router.put('/metrics', FacilitiesController.updateKeyMetrics);

// POST add new key metric
router.post('/metrics', FacilitiesController.addKeyMetric);

// PUT update specific key metric
router.put('/metrics/:metricId', FacilitiesController.updateKeyMetric);

// DELETE specific key metric
router.delete('/metrics/:metricId', FacilitiesController.deleteKeyMetric);

// POST reorder metrics
router.post('/metrics/reorder', FacilitiesController.reorderMetrics);

// ==================== FACILITY FEATURES ROUTES ====================

// GET all facility features
router.get('/features', FacilitiesController.getFacilityFeatures);

// PUT update all facility features
router.put('/features', FacilitiesController.updateFacilityFeatures);

// POST add new facility feature (JSON only, no image upload)
router.post('/features', FacilitiesController.addFacilityFeature);

// POST add new facility feature (with image upload)
router.post('/features/with-image', upload.single('image'), processUploadedImages, FacilitiesController.addFacilityFeature);

// GET specific facility feature by ID
router.get('/features/:featureId', FacilitiesController.getFacilityFeatureById);

// PUT update specific facility feature (with optional image upload)
router.put('/features/:featureId', upload.single('image'), processUploadedImages, FacilitiesController.updateFacilityFeature);

// DELETE specific facility feature
router.delete('/features/:featureId', FacilitiesController.deleteFacilityFeature);

// POST reorder features
router.post('/features/reorder', FacilitiesController.reorderFeatures);

// ==================== FEATURE IMAGES ROUTES ====================

// POST add multiple images to a feature
router.post('/features/:featureId/images', 
  uploadFeatureImages, 
  processUploadedImages, 
  FacilitiesController.addFeatureImages
);

// PUT update feature image
router.put('/features/:featureId/images/:imageIndex', 
  upload.single('image'), 
  processUploadedImages, 
  FacilitiesController.updateFeatureImage
);

// DELETE feature image
router.delete('/features/:featureId/images/:imageIndex', 
  FacilitiesController.deleteFeatureImage
);

// POST reorder feature images
router.post('/features/:featureId/images/reorder', 
  FacilitiesController.reorderFeatureImages
);

// ==================== PAGE SETTINGS ROUTES ====================

// PUT update page settings (title, description, SEO)
router.put('/settings', FacilitiesController.updatePageSettings);

// POST add multiple images for facility feature (for admin upload)
router.post('/features/images/upload-multiple', upload.array('images', 10), processUploadedImages, FacilitiesController.uploadMultipleFeatureImages);

module.exports = router;