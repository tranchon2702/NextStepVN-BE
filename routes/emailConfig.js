const express = require('express');
const router = express.Router();
const EmailConfigController = require('../controllers/emailConfigController');

// Get current email configuration
router.get('/', EmailConfigController.getEmailConfig);

// Update email configuration
router.put('/', EmailConfigController.updateEmailConfig);

// Test email configuration
router.post('/test', EmailConfigController.testEmailConfig);

module.exports = router;
