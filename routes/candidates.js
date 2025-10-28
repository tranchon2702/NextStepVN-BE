const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const candidatesController = require('../controllers/candidatesController');
const candidateContactController = require('../controllers/candidateContactController');

// Create uploads/cvs directory if it doesn't exist
const cvsDir = path.join(__dirname, '../uploads/cvs');
if (!fs.existsSync(cvsDir)) {
  fs.mkdirSync(cvsDir, { recursive: true });
}

// Configure multer for CV uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, cvsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cv-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only PDF files
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file PDF'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

// Candidate routes
router.get('/', candidatesController.getAllCandidates);
router.get('/:id', candidatesController.getCandidateById);
router.post('/', upload.single('cv'), candidatesController.createCandidate);
router.put('/:id', upload.single('cv'), candidatesController.updateCandidate);
router.delete('/:id', candidatesController.deleteCandidate);
router.delete('/:id/cv', candidatesController.deleteCandidateCV);

// Contact request routes
router.post('/contact-request', candidateContactController.createContactRequest);
router.get('/contact-requests', candidateContactController.getAllContactRequests);
router.put('/contact-requests/:id', candidateContactController.updateContactRequestStatus);
router.delete('/contact-requests/:id', candidateContactController.deleteContactRequest);

module.exports = router;

