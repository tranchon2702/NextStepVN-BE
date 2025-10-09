// routes/automationRoutes.js
const express = require('express');
const { AutomationController, upload } = require('../controllers/automationController');
const { processUploadedImages } = require('../middleware/imageProcessor');

const router = express.Router();

// ==================== MAIN DATA ROUTES ====================

// GET all automation data (for frontend)
router.get('/data', AutomationController.getAutomationData);

// GET automation statistics
router.get('/stats', AutomationController.getAutomationStats);

// ==================== AUTOMATION ITEMS ROUTES ====================

// GET all automation items
router.get('/items', AutomationController.getAutomationItems);

// POST add new automation item (with image upload)
router.post('/items', upload.single('image'), processUploadedImages, AutomationController.addAutomationItem);

// PUT update all automation items
router.put('/items', AutomationController.updateAllAutomationItems);

// POST reorder automation items
router.post('/items/reorder', AutomationController.reorderAutomationItems);

// POST bulk delete automation items
router.post('/items/bulk-delete', AutomationController.bulkDeleteAutomationItems);

// GET specific automation item by ID
router.get('/items/:itemId', AutomationController.getAutomationItemById);

// PUT update specific automation item (with optional image upload)
router.put('/items/:itemId', upload.single('image'), processUploadedImages, AutomationController.updateAutomationItem);

// DELETE specific automation item
router.delete('/items/:itemId', AutomationController.deleteAutomationItem);

// POST toggle automation item status (active/inactive)
router.post('/items/:itemId/toggle', AutomationController.toggleAutomationItemStatus);

// ==================== CONTENT ITEMS ROUTES ====================

// GET all content items for a specific automation item
router.get('/items/:itemId/content', AutomationController.getContentItems);

// POST add new content item to a specific automation item
router.post('/items/:itemId/content', AutomationController.addContentItem);

// POST reorder content items for a specific automation item
router.post('/items/:itemId/content/reorder', AutomationController.reorderContentItems);

// GET specific content item by ID
router.get('/items/:itemId/content/:contentItemId', AutomationController.getContentItemById);

// PUT update specific content item
router.put('/items/:itemId/content/:contentItemId', AutomationController.updateContentItem);

// DELETE specific content item
router.delete('/items/:itemId/content/:contentItemId', AutomationController.deleteContentItem);

// POST toggle content item status (active/inactive)
router.post('/items/:itemId/content/:contentItemId/toggle', AutomationController.toggleContentItemStatus);

// ==================== SLIDER SETTINGS ROUTES ====================

// GET slider settings
router.get('/slider-settings', AutomationController.getSliderSettings);

// PUT update slider settings
router.put('/slider-settings', AutomationController.updateSliderSettings);

// ==================== PAGE SETTINGS ROUTES ====================

// PUT update page settings (title, description, SEO)
router.put('/settings', AutomationController.updatePageSettings);

module.exports = router;