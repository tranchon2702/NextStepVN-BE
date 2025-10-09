const express = require('express');
const multer = require('multer');
const path = require('path');

// Configure multer for general image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Default to general images folder
    cb(null, 'uploads/images/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const router = express.Router();
const { processUploadedImages } = require('../middleware/imageProcessor');

// POST upload multiple images
router.post('/multiple', upload.array('images', 10), processUploadedImages, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    const urls = req.files.map(file => `/uploads/images/${file.filename}`);

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      urls: urls
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message
    });
  }
});

// POST upload single image
router.post('/single', upload.single('image'), processUploadedImages, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image uploaded'
      });
    }

    const url = `/uploads/images/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: url
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
});

module.exports = router; 