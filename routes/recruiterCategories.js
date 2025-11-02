const express = require('express');
const router = express.Router();
const recruiterCategoryController = require('../controllers/recruiterCategoryController');
const { authenticateJWT } = require('../middleware/auth');
const { isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', recruiterCategoryController.getAllCategories);
router.get('/:id', recruiterCategoryController.getCategoryById);

// Admin routes
router.get('/admin/all', authenticateJWT, isAdmin, recruiterCategoryController.getAllCategoriesForAdmin);
router.post('/', authenticateJWT, isAdmin, recruiterCategoryController.uploadCategoryImage, recruiterCategoryController.createCategory);
router.put('/:id', authenticateJWT, isAdmin, recruiterCategoryController.uploadCategoryImage, recruiterCategoryController.updateCategory);
router.delete('/:id', authenticateJWT, isAdmin, recruiterCategoryController.deleteCategory);

module.exports = router;

