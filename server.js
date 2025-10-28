const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// ==================== ENSURE UPLOADS FOLDER EXISTS ====================
const uploadDir = path.join(__dirname, 'uploads', 'cvs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ==================== CORS CONFIGURATION ====================
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5001',       // Local development FE
    'http://localhost:3006',        // Local production FE  
    'https://saigon3jean.com',      // Production domain
    'http://222.255.214.144:3006',  // Direct IP access
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ==================== MIDDLEWARE - UPLOAD OPTIMIZED ====================
// ✅ TĂNG LIMITS MẠNH CHO UPLOAD
app.use(express.json({ 
  limit: '500mb',
  parameterLimit: 50000
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '500mb',
  parameterLimit: 50000
}));

// ✅ TIMEOUT MIDDLEWARE CHO UPLOAD
app.use((req, res, next) => {
  // Set timeout 10 phút cho upload
  req.setTimeout(600000, () => {
    console.log('Request timeout');
    res.status(408).json({ 
      success: false, 
      message: 'Request timeout' 
    });
  });
  
  res.setTimeout(600000, () => {
    console.log('Response timeout');
  });
  
  next();
});

// ✅ REQUEST SIZE LOGGING
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    const contentLength = req.get('content-length');
    if (contentLength) {
      console.log(`📄 Request size: ${(contentLength / 1024 / 1024).toFixed(2)}MB`);
    }
  }
  next();
});

// Serve static files (uploaded images/videos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1y',
  etag: true
}));

// ==================== DATABASE CONNECTION ====================
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   maxPoolSize: 10,
//   serverSelectionTimeoutMS: 5000,
//   socketTimeoutMS: 45000,
// });

mongoose.connect('mongodb://localhost:27017/saigon3jean', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  
  // Initialize default admin user if none exists
  const authController = require('./controllers/authController');
  await authController.createInitialAdmin();
});

// ==================== ROUTES ====================
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const overviewRoutes = require('./routes/overview');
const productsRoutes = require('./routes/products');
const machineryRoutes = require('./routes/machinery');
const facilitiesRoutes = require('./routes/facilities');
const ecoFriendlyRoutes = require('./routes/eco-friendly');
const automationRoutes = require('./routes/automation');
const contactRoutes = require('./routes/contact');
const careersRoutes = require('./routes/careers');
const uploadRoutes = require('./routes/upload');
const emailConfigRoutes = require('./routes/emailConfig');
const candidatesRoutes = require('./routes/candidates');
const programsRoutes = require('./routes/programs');
// Đã xóa routes/news.js vì tất cả API tin tức đã được xử lý trong routes/home.js

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/overview', overviewRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/machinery', machineryRoutes);
app.use('/api/facilities', facilitiesRoutes);
app.use('/api/eco-friendly', ecoFriendlyRoutes);
app.use('/api/automation', automationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/email-config', emailConfigRoutes);
app.use('/api/candidates', candidatesRoutes);
app.use('/api/programs', programsRoutes);
// Đã xóa đăng ký routes/news.js vì tất cả API tin tức đã được xử lý trong routes/home.js

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Saigon 3 Jean API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// ✅ UPLOAD-SPECIFIC ERROR HANDLING
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);
  
  // Handle Multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File too large. Maximum size is 500MB.',
      error: 'FILE_TOO_LARGE'
    });
  }
  
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected file field',
      error: 'INVALID_FILE_FIELD'
    });
  }
  
  // Handle timeout errors
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return res.status(408).json({
      success: false,
      message: 'Request timeout. Please try with a smaller file.',
      error: 'TIMEOUT'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

const PORT = process.env.PORT || 3007;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Upload limit: 500MB`);
  console.log(`⏱️  Request timeout: 10 minutes`);
});

// ✅ SERVER TIMEOUT SETTINGS
server.timeout = 600000; // 10 minutes
server.keepAliveTimeout = 600000;
server.headersTimeout = 610000;

module.exports = app;