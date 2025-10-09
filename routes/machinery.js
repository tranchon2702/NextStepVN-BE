// routes/machineryRoutes.js
const express = require('express');
const { MachineryController, upload, uploadMachineImages } = require('../controllers/machineryController');
const { processUploadedImages } = require('../middleware/imageProcessor');

const router = express.Router();

// ==================== MAIN DATA ROUTES ====================

// GET all machinery data (for frontend)
router.get('/data', MachineryController.getMachineryData);

// GET machinery statistics
router.get('/stats', MachineryController.getMachineryStats);

// ==================== STAGES ROUTES ====================

// GET all stages
router.get('/stages', MachineryController.getStages);

// POST add new stage
router.post('/stages', MachineryController.addStage);

// POST reorder stages
router.post('/stages/reorder', MachineryController.reorderStages);

// GET specific stage by ID
router.get('/stages/:stageId', MachineryController.getStageById);

// PUT update specific stage
router.put('/stages/:stageId', MachineryController.updateStage);

// DELETE specific stage
router.delete('/stages/:stageId', MachineryController.deleteStage);

// POST toggle stage status (active/inactive)
router.post('/stages/:stageId/toggle', MachineryController.toggleStageStatus);

// ==================== MACHINES ROUTES ====================

// GET all machines in a stage
router.get('/stages/:stageId/machines', MachineryController.getStageMachines);

// POST add new machine to a stage (with image upload)
router.post('/stages/:stageId/machines', uploadMachineImages, processUploadedImages, MachineryController.addMachine);

// POST reorder machines in a stage
router.post('/stages/:stageId/machines/reorder', MachineryController.reorderMachines);

// GET specific machine by ID
router.get('/stages/:stageId/machines/:machineId', MachineryController.getMachineById);

// PUT update specific machine (with optional image upload)
router.put('/stages/:stageId/machines/:machineId', uploadMachineImages, processUploadedImages, MachineryController.updateMachine);

// DELETE specific machine
router.delete('/stages/:stageId/machines/:machineId', MachineryController.deleteMachine);

// POST toggle machine status (active/inactive)
router.post('/stages/:stageId/machines/:machineId/toggle', MachineryController.toggleMachineStatus);

// ==================== MACHINE IMAGES ROUTES ====================

// POST add multiple images to a machine
router.post('/stages/:stageId/machines/:machineId/images', 
  uploadMachineImages, 
  processUploadedImages, 
  MachineryController.addMachineImages
);

// PUT update machine image
router.put('/stages/:stageId/machines/:machineId/images/:imageIndex', 
  upload.single('image'), 
  processUploadedImages, 
  MachineryController.updateMachineImage
);

// DELETE machine image
router.delete('/stages/:stageId/machines/:machineId/images/:imageIndex', 
  MachineryController.deleteMachineImage
);

// POST reorder machine images
router.post('/stages/:stageId/machines/:machineId/images/reorder', 
  MachineryController.reorderMachineImages
);

// DELETE machine image by imageId (_id)
router.delete('/stages/:stageId/machines/:machineId/images/by-id/:imageId', 
  MachineryController.deleteMachineImageById
);

// ==================== PAGE SETTINGS ROUTES ====================

// PUT update page settings (title, description, SEO)
router.put('/settings', MachineryController.updatePageSettings);

module.exports = router;