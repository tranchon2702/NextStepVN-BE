// routes/contact.js
const express = require('express');
const router = express.Router();
const { ContactController, upload } = require('../controllers/contactController');

// ==================== CONTACT INFO MANAGEMENT (CMS) ====================

/**
 * @route   GET /api/contact/info
 * @desc    Get contact information for display
 * @access  Public
 */
router.get('/info', ContactController.getContactInfo);

/**
 * @route   GET /api/contact/data
 * @desc    Get complete contact data for frontend
 * @access  Public
 */
router.get('/data', ContactController.getContactData);

/**
 * @route   PUT /api/contact/info
 * @desc    Update contact information (Admin CMS)
 * @access  Admin
 * @body    { address, email, phone, workingHours, mapEmbedUrl, socialLinks }
 * @files   bannerImage (optional)
 */
router.put('/info', upload.single('bannerImage'), ContactController.updateContactInfo);

// ==================== CONTACT FORM SUBMISSIONS ====================

/**
 * @route   POST /api/contact/submit
 * @desc    Submit contact form (Public frontend)
 * @access  Public
 * @body    { name, company, email, phone, subject, message }
 */
router.post('/submit', ContactController.createSubmission);

/**
 * @route   GET /api/contact/submissions
 * @desc    Get contact submissions with filters and pagination (Admin Dashboard)
 * @access  Admin
 * @query   page, limit, status, priority, search, startDate, endDate, sortBy, sortOrder
 */
router.get('/submissions', ContactController.getSubmissions);

/**
 * @route   GET /api/contact/submissions/export
 * @desc    Export submissions to CSV/JSON
 * @access  Admin
 * @query   format (csv|json), status, priority, startDate, endDate
 */
router.get('/submissions/export', ContactController.exportSubmissions);

/**
 * @route   GET /api/contact/submissions/:id
 * @desc    Get single submission by ID
 * @access  Admin
 */
router.get('/submissions/:id', ContactController.getSubmissionById);

/**
 * @route   PUT /api/contact/submissions/:id
 * @desc    Update submission (status, priority, notes, etc.)
 * @access  Admin
 * @body    { status, priority, tags, note, assignedTo }
 */
router.put('/submissions/:id', ContactController.updateSubmission);

/**
 * @route   DELETE /api/contact/submissions/:id
 * @desc    Delete submission (mark as spam or permanent delete)
 * @access  Admin
 * @query   permanent (true|false)
 */
router.delete('/submissions/:id', ContactController.deleteSubmission);

/**
 * @route   POST /api/contact/submissions/bulk
 * @desc    Bulk update multiple submissions
 * @access  Admin
 * @body    { ids: [], action: 'status|priority|assignTo|markSpam|delete', value: 'new_value' }
 */
router.post('/submissions/bulk', ContactController.bulkUpdateSubmissions);

module.exports = router;