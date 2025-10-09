// routes/overview.js
const express = require('express');
const router = express.Router();
const { OverviewController, upload } = require('../controllers/overviewController');
const { processUploadedImages } = require('../middleware/imageProcessor');

// Middleware for multiple file uploads
const multipleUpload = upload.fields([
  // Banner section
  { name: 'bannerImage', maxCount: 1 },
  
  // Milestones (max 10 for flexibility)
  ...Array.from({length: 10}, (_, i) => ({ name: `milestone_image_${i}`, maxCount: 1 })),
  
  // Message section
  { name: 'ceoImage', maxCount: 1 }
]);

// ==================== BANNER SECTION ====================

/**
 * @route   GET /api/overview/banner
 * @desc    Get overview banner content
 * @access  Public
 */
router.get('/banner', OverviewController.getBanner);

/**
 * @route   PUT /api/overview/banner
 * @desc    Update overview banner content
 * @access  Admin
 * @body    { title, description }
 * @files   bannerImage (optional)
 */
router.put('/banner', upload.single('bannerImage'), processUploadedImages, OverviewController.updateBanner);

// ==================== MILESTONES SECTION ====================

/**
 * @route   GET /api/overview/milestones
 * @desc    Get company milestones
 * @access  Public
 */
router.get('/milestones', OverviewController.getMilestones);

/**
 * @route   POST /api/overview/milestones
 * @desc    Add a new milestone
 * @access  Admin
 */
router.post('/milestones', OverviewController.addMilestone);

/**
 * @route   PUT /api/overview/milestones
 * @desc    Update company milestones
 * @access  Admin
 * @body    { milestones: [{ year, title, description }] }
 * @files   milestone_image_0, milestone_image_1, milestone_image_2, ...
 */
router.put('/milestones', multipleUpload, processUploadedImages, OverviewController.updateMilestones);

/**
 * @route   DELETE /api/overview/milestones/:milestoneId
 * @desc    Delete a milestone by id
 * @access  Admin
 */
router.delete('/milestones/:milestoneId', OverviewController.deleteMilestone);

// ==================== MESSAGE SECTION ====================

/**
 * @route   GET /api/overview/message
 * @desc    Get CEO message
 * @access  Public
 */
router.get('/message', OverviewController.getMessage);

/**
 * @route   PUT /api/overview/message
 * @desc    Update CEO message
 * @access  Admin
 * @body    { ceoName, content: [{ paragraph }] }
 * @files   ceoImage (optional), backgroundImage (optional)
 */
router.put('/message', upload.fields([
  { name: 'ceoImage', maxCount: 1 },
  { name: 'backgroundImage', maxCount: 1 }
]), processUploadedImages, OverviewController.updateMessage);

// ==================== VISION & MISSION SECTION ====================

/**
 * @route   GET /api/overview/vision-mission
 * @desc    Get vision & mission
 * @access  Public
 */
router.get('/vision-mission', OverviewController.getVisionMission);

/**
 * @route   PUT /api/overview/vision-mission
 * @desc    Update vision & mission
 * @access  Admin
 * @body    { vision: { content, icon, title }, mission: { content, icon, title } }
 */
router.put('/vision-mission', OverviewController.updateVisionMission);

// ==================== CORE VALUES SECTION ====================

/**
 * @route   GET /api/overview/core-values
 * @desc    Get core values
 * @access  Public
 */
router.get('/core-values', OverviewController.getCoreValues);

/**
 * @route   PUT /api/overview/core-values
 * @desc    Update core values
 * @access  Admin
 * @body    { values: [{ title, content, icon }] }
 */
router.put('/core-values', OverviewController.updateCoreValues);

// ==================== COMBINED OVERVIEW DATA ====================

/**
 * @route   GET /api/overview/data
 * @desc    Get all overview page data
 * @access  Public
 */
router.get('/data', OverviewController.getOverviewData);

module.exports = router;