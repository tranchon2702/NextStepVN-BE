const express = require('express');
const router = express.Router();
const jobCategoryController = require('../controllers/jobCategoryController');
const { authenticateJWT } = require('../middleware/auth');
const { isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', jobCategoryController.getAllCategories);
router.get('/:id', jobCategoryController.getCategoryById);

// Admin routes
router.get('/admin/all', authenticateJWT, isAdmin, jobCategoryController.getAllCategoriesForAdmin);
router.post('/', authenticateJWT, isAdmin, jobCategoryController.uploadCategoryImage, jobCategoryController.createCategory);
router.put('/:id', authenticateJWT, isAdmin, jobCategoryController.uploadCategoryImage, jobCategoryController.updateCategory);
router.delete('/:id', authenticateJWT, isAdmin, jobCategoryController.deleteCategory);

module.exports = router;



