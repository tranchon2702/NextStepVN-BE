const express = require('express');
const { CareersController, upload } = require('../controllers/careersController');

const router = express.Router();

// ==================== MAIN PAGE DATA ====================

// GET careers page data (for frontend)
router.get('/data', CareersController.getCareersPageData.bind(CareersController));

// GET careers statistics
router.get('/stats', CareersController.getCareersStats.bind(CareersController));

// ==================== COMPANY INFO ROUTES ====================

// GET company info
router.get('/company-info', CareersController.getCompanyInfo.bind(CareersController));

// PUT update company info
router.put('/company-info', CareersController.updateCompanyInfo.bind(CareersController));

// ==================== CONTACT HR ROUTES ====================

// GET contact HR info
router.get('/contact-hr', CareersController.getContactHR.bind(CareersController));

// PUT update contact HR info
router.put('/contact-hr', CareersController.updateContactHR.bind(CareersController));

// ==================== JOBS ROUTES ====================

// GET all jobs (admin)
router.get('/jobs', CareersController.getAllJobs.bind(CareersController));

// POST create new job
router.post('/jobs', CareersController.createJob.bind(CareersController));

// POST reorder jobs
router.post('/jobs/reorder', CareersController.reorderJobs.bind(CareersController));

// GET featured jobs
router.get('/jobs/featured', CareersController.getFeaturedJobs.bind(CareersController));

// GET search jobs
router.get('/jobs/search', CareersController.searchJobs.bind(CareersController));

// GET specific job by ID
router.get('/jobs/:jobId', CareersController.getJobById.bind(CareersController));

// GET job by slug (for job details)
router.get('/jobs/slug/:slug', CareersController.getJobBySlug.bind(CareersController));

// PUT update specific job
router.put('/jobs/:jobId', CareersController.updateJob.bind(CareersController));

// DELETE specific job
router.delete('/jobs/:jobId', CareersController.deleteJob.bind(CareersController));

// POST toggle job status (active/inactive)
router.post('/jobs/:jobId/toggle', CareersController.toggleJobStatus.bind(CareersController));

// POST toggle featured status
router.post('/jobs/:jobId/toggle-featured', CareersController.toggleFeaturedStatus.bind(CareersController));

// ==================== JOB APPLICATIONS ROUTES ====================

// POST submit job application (with CV upload)
router.post('/jobs/:jobId/apply', upload.single('cv'), CareersController.submitApplication.bind(CareersController));

// GET all applications (admin)
router.get('/applications', CareersController.getAllApplications.bind(CareersController));

// GET applications by job
router.get('/jobs/:jobId/applications', CareersController.getApplicationsByJob.bind(CareersController));

// GET specific application by ID
router.get('/applications/:applicationId', CareersController.getApplicationById.bind(CareersController));

// PUT update application status
router.put('/applications/:applicationId/status', CareersController.updateApplicationStatus.bind(CareersController));

// DELETE application
router.delete('/applications/:applicationId', CareersController.deleteApplication.bind(CareersController));

// POST bulk update applications
router.post('/applications/bulk-update', CareersController.bulkUpdateApplications.bind(CareersController));

// GET export applications
router.get('/applications/export', CareersController.exportApplications.bind(CareersController));

module.exports = router;