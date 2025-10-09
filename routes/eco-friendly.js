// routes/eco-friendly.js
const express = require('express');
const router = express.Router();
const { EcoFriendlyController, upload } = require('../controllers/ecoFriendlyController');
const { processUploadedImages } = require('../middleware/imageProcessor');

// ==================== MAIN PAGE DATA ====================

/**
 * @route   GET /api/eco-friendly/data
 * @desc    Get all eco-friendly page data for frontend
 * @access  Public
 */
router.get('/data', EcoFriendlyController.getEcoFriendlyData);

// ==================== HERO SECTION ROUTES ====================

/**
 * @route   PUT /api/eco-friendly/hero
 * @desc    Update hero section
 * @access  Admin
 */
router.put('/hero', upload.single('heroImage'), processUploadedImages, EcoFriendlyController.updateHero);

// ==================== MAIN IMAGE ROUTES ====================

/**
 * @route   PUT /api/eco-friendly/main-image
 * @desc    Update main circle image
 * @access  Admin
 */
router.put('/main-image', upload.single('mainImage'), processUploadedImages, EcoFriendlyController.updateMainImage);

// ==================== FEATURES ROUTES ====================

/**
 * @route   GET /api/eco-friendly/features
 * @desc    Get all features
 * @access  Admin
 */
router.get('/features', EcoFriendlyController.getFeatures);

/**
 * @route   POST /api/eco-friendly/features
 * @desc    Create new feature
 * @access  Admin
 */
router.post('/features', EcoFriendlyController.createFeature);

/**
 * @route   PUT /api/eco-friendly/features/:featureId
 * @desc    Update specific feature
 * @access  Admin
 */
router.put('/features/:featureId', EcoFriendlyController.updateFeature);

/**
 * @route   DELETE /api/eco-friendly/features/:featureId
 * @desc    Delete specific feature
 * @access  Admin
 */
router.delete('/features/:featureId', EcoFriendlyController.deleteFeature);

// ==================== SECTIONS ROUTES ====================

/**
 * @route   GET /api/eco-friendly/sections
 * @desc    Get all sections
 * @access  Admin
 */
router.get('/sections', EcoFriendlyController.getSections);

/**
 * @route   POST /api/eco-friendly/sections
 * @desc    Create new section
 * @access  Admin
 */
router.post('/sections', upload.single('sectionImage'), processUploadedImages, EcoFriendlyController.createSection);

/**
 * @route   PUT /api/eco-friendly/sections/:sectionId
 * @desc    Update specific section
 * @access  Admin
 */
router.put('/sections/:sectionId', upload.single('image'), processUploadedImages, EcoFriendlyController.updateSection);

/**
 * @route   DELETE /api/eco-friendly/sections/:sectionId
 * @desc    Delete specific section
 * @access  Admin
 */
router.delete('/sections/:sectionId', EcoFriendlyController.deleteSection);

// ==================== PAGE SETTINGS ROUTES ====================

/**
 * @route   PUT /api/eco-friendly/settings
 * @desc    Update page settings (title, description, SEO)
 * @access  Admin
 */
router.put('/settings', EcoFriendlyController.updatePageSettings);

module.exports = router; 