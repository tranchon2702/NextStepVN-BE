const express = require('express');
const router = express.Router();
const { ProgramController, uploadConfigs } = require('../controllers/programController');
const { processUploadedImages } = require('../middleware/imageProcessor');
const { authenticateJWT, isAdmin } = require('../middleware/auth');

// GET All Programs (Admin) - Requires authentication
router.get('/admin/all', authenticateJWT, isAdmin, ProgramController.getAllPrograms);

// GET Published Programs (Frontend)
router.get('/', ProgramController.getPublishedPrograms);

// GET Program by ID or Slug
router.get('/:id', ProgramController.getProgramById);

// CREATE Program - Requires authentication
router.post('/', authenticateJWT, isAdmin, uploadConfigs.program, processUploadedImages, ProgramController.createProgram);

// UPDATE Program - Requires authentication
router.put('/:id', authenticateJWT, isAdmin, uploadConfigs.program, processUploadedImages, ProgramController.updateProgram);

// DELETE Program - Requires authentication
router.delete('/:id', authenticateJWT, isAdmin, ProgramController.deleteProgram);

// DELETE Additional Image - Requires authentication
router.delete('/:id/images/:imageIndex', authenticateJWT, isAdmin, ProgramController.deleteAdditionalImage);

module.exports = router;

