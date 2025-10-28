const express = require('express');
const router = express.Router();
const { ProgramsController } = require('../controllers/programsController');

// Public
router.get('/', ProgramsController.list);
router.get('/slug/:slug', ProgramsController.getBySlug);
router.get('/:id', ProgramsController.getById);

// Admin (no JWT enforced per project pattern)
router.post('/', ProgramsController.create);
router.put('/:id', ProgramsController.update);
router.delete('/:id', ProgramsController.remove);

module.exports = router;


