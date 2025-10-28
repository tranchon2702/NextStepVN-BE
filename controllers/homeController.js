const { Hero, HomeSection, Customer, Certification, News, HomeContact } = require('../models');

// Log to verify models are loaded correctly
console.log('Models loaded:', {
  Hero: !!Hero,
  HomeSection: !!HomeSection,
  Customer: !!Customer,
  Certification: !!Certification,
  News: !!News,
  HomeContact: !!HomeContact
});
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { processImage } = require('../middleware/imageProcessor');

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const dirs = ['uploads/images', 'uploads/videos'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};
createUploadDirs();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = file.fieldname.includes('video') || 
                      file.fieldname.includes('Video') || 
                      file.mimetype.startsWith('video/') 
                      ? 'uploads/videos/' : 'uploads/images/';
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images and videos
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed!'), false);
  }
};

// General upload middleware
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 200 * 1024 * 1024 // Increase from 100MB to 200MB limit
  },
  fileFilter: fileFilter
});

// Specific upload configurations for different endpoints
const uploadConfigs = {
  // Hero section: background image + video + aiBannerImage
  hero: upload.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'heroVideo', maxCount: 1 },
    { name: 'aiBannerImage', maxCount: 1 } // thêm dòng này
  ]),
  
  // Info cards: multiple cards with media + factory video
  sections: upload.fields([
    // Factory video
    { name: 'factoryVideo', maxCount: 1 },
    // Standard backend naming
    { name: 'card_0', maxCount: 1 },
    { name: 'card_1', maxCount: 1 },
    { name: 'card_2', maxCount: 1 },
    { name: 'card_3', maxCount: 1 },
    { name: 'card_4', maxCount: 1 },
    { name: 'card_5', maxCount: 1 },
    // Alternative frontend naming patterns
    { name: '0-mediaUrl', maxCount: 1 },
    { name: '1-mediaUrl', maxCount: 1 },
    { name: '2-mediaUrl', maxCount: 1 },
    { name: '3-mediaUrl', maxCount: 1 },
    { name: '4-mediaUrl', maxCount: 1 },
    { name: '5-mediaUrl', maxCount: 1 },
    { name: 'sections-0-mediaUrl', maxCount: 1 },
    { name: 'sections-1-mediaUrl', maxCount: 1 },
    { name: 'sections-2-mediaUrl', maxCount: 1 },
    { name: 'sections-3-mediaUrl', maxCount: 1 },
    { name: 'sections-4-mediaUrl', maxCount: 1 },
    { name: 'sections-5-mediaUrl', maxCount: 1 },
    { name: 'mediaUrl-0', maxCount: 1 },
    { name: 'mediaUrl-1', maxCount: 1 },
    { name: 'mediaUrl-2', maxCount: 1 },
    { name: 'mediaUrl-3', maxCount: 1 },
    { name: 'mediaUrl-4', maxCount: 1 },
    { name: 'mediaUrl-5', maxCount: 1 }
  ]),
  
  // Customers: logos for both categories - use any() to handle dynamic field names
  customers: upload.any(),
  
  // Certifications: certificate images
  certifications: upload.fields([
    { name: 'cert_0', maxCount: 1 },
    { name: 'cert_1', maxCount: 1 },
    { name: 'cert_2', maxCount: 1 },
    { name: 'cert_3', maxCount: 1 },
    { name: 'cert_4', maxCount: 1 },
    { name: 'cert_5', maxCount: 1 },
    { name: 'cert_6', maxCount: 1 } 
   
  ]),
  
  // News: only main image
  news: upload.fields([
    { name: 'newsImage', maxCount: 1 }
  ]),
  
  // News additional images only
  newsAdditionalImages: upload.array('additionalImages', 10)
};

class HomeController {
  
  // ==================== HERO SECTION APIs ====================
  
  // GET Hero content
  async getHero(req, res) {
    try {
      let hero = await Hero.findOne({ isActive: true });
      
      if (!hero) {
        return res.status(404).json({
          success: false,
          message: 'Hero content not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: hero
      });
    } catch (error) {
      console.error('Error in getHero:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching hero content',
        error: error.message
      });
    }
  }

  // UPDATE Hero content
  async updateHero(req, res) {
    try {
      console.log('--- [updateHero] ---');
      console.log('req.body:', req.body);
      console.log('req.files:', req.files);
      const { title, subtitle, videoUrl, aiBannerTitle, ctaType, ctaLabel, ctaSlug, ctaUrl, ctaTheme, buttonLink } = req.body;
      
      let hero = await Hero.findOne({ isActive: true });
      if (!hero) {
        return res.status(404).json({
          success: false,
          message: 'Hero content not found'
        });
      }
      // Log giá trị trước khi update
      console.log('Trước update: hero.aiBannerImage =', hero.aiBannerImage);
      // Update text fields
      if (title) hero.title = title;
      if (subtitle !== undefined) hero.subtitle = subtitle;
      if (videoUrl !== undefined) hero.videoUrl = videoUrl;
      if (aiBannerTitle !== undefined) hero.aiBannerTitle = aiBannerTitle;
      if (buttonLink !== undefined) hero.buttonLink = buttonLink;
      if (ctaType !== undefined) hero.ctaType = ctaType;
      if (ctaLabel !== undefined) hero.ctaLabel = ctaLabel;
      if (ctaSlug !== undefined) hero.ctaSlug = ctaSlug;
      if (ctaUrl !== undefined) hero.ctaUrl = ctaUrl;
      if (ctaTheme !== undefined) hero.ctaTheme = ctaTheme;
      // Handle file uploads
      if (req.files) {
        if (req.files.heroImage && req.files.heroImage[0]) {
          hero.backgroundImage = `/uploads/images/${req.files.heroImage[0].filename}`;
        }
        if (req.files.heroVideo && req.files.heroVideo[0]) {
          hero.videoUrl = `/uploads/videos/${req.files.heroVideo[0].filename}`;
        }
        if (req.files.aiBannerImage && req.files.aiBannerImage[0]) {
          console.log('Đã nhận file aiBannerImage:', req.files.aiBannerImage[0].filename);
          hero.aiBannerImage = `/uploads/images/${req.files.aiBannerImage[0].filename}`;
          // Tối ưu các phiên bản ảnh
          const versions = await processImage(req.files.aiBannerImage[0].path);
          if (versions) {
            // Chuyển đổi sang đường dẫn public
            const toPublic = (p) => p ? p.replace(/\\/g, '/').replace(/^.*\/uploads\//, '/uploads/') : '';
            hero.aiBannerImageVersions = {
              original: toPublic(versions.original),
              webp: toPublic(versions.webp),
              thumbnail: toPublic(versions.thumbnail),
              medium: toPublic(versions.medium)
            };
          }
        } else {
          console.log('Không nhận được file aiBannerImage');
        }
      }
      // Log giá trị sau khi update
      console.log('Sau update: hero.aiBannerImage =', hero.aiBannerImage);
      await hero.save();
      // Log sau khi save
      console.log('Sau save: hero.aiBannerImage =', hero.aiBannerImage);
      res.status(200).json({
        success: true,
        message: 'Hero updated successfully',
        data: hero
      });
    } catch (error) {
      console.error('Error in updateHero:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating hero content',
        error: error.message
      });
    }
  }

  // UPDATE Hero video
  async updateHeroVideo(req, res) {
    try {
      let hero = await Hero.findOne({ isActive: true });
      if (!hero) {
        return res.status(404).json({
          success: false,
          message: 'Hero content not found'
        });
      }
      
      // Handle video upload
      if (req.files && req.files.heroVideo && req.files.heroVideo[0]) {
        hero.videoUrl = `/uploads/videos/${req.files.heroVideo[0].filename}`;
        await hero.save();
        
        res.status(200).json({
          success: true,
          message: 'Hero video uploaded successfully',
          data: {
            videoUrl: hero.videoUrl
          }
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'No video file provided'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating hero video',
        error: error.message
      });
    }
  }

  // UPDATE Multiple Heroes
  async updateHeroes(req, res) {
    try {
      console.log('--- [updateHeroes] ---');
      console.log('req.body:', req.body);
      console.log('req.files:', req.files);
      
      const heroesData = JSON.parse(req.body.heroes || '[]');
      console.log('Parsed heroes data:', heroesData);
      
      // Process each hero
      for (let i = 0; i < heroesData.length; i++) {
        const heroData = heroesData[i];
        let hero;
        
        // If hero has _id, update existing
        if (heroData._id) {
          hero = await Hero.findById(heroData._id);
        }
        
        // If not found or no _id, create new
        if (!hero) {
          hero = new Hero();
        }
        
        // Update fields
        hero.title = heroData.title || hero.title;
        hero.subtitle = heroData.subtitle !== undefined ? heroData.subtitle : hero.subtitle;
        hero.isActive = heroData.isActive !== undefined ? heroData.isActive : hero.isActive;
        hero.order = heroData.order !== undefined ? heroData.order : i;
        hero.aiBannerImage = heroData.aiBannerImage || hero.aiBannerImage;
        hero.aiBannerTitle = heroData.aiBannerTitle || hero.aiBannerTitle;
        hero.backgroundImage = heroData.backgroundImage || hero.backgroundImage;
        hero.buttonLink = heroData.buttonLink !== undefined ? heroData.buttonLink : hero.buttonLink;
        // CTA
        if (heroData.ctaType !== undefined) hero.ctaType = heroData.ctaType;
        if (heroData.ctaLabel !== undefined) hero.ctaLabel = heroData.ctaLabel;
        if (heroData.ctaSlug !== undefined) hero.ctaSlug = heroData.ctaSlug;
        if (heroData.ctaUrl !== undefined) hero.ctaUrl = heroData.ctaUrl;
        if (heroData.ctaTheme !== undefined) hero.ctaTheme = heroData.ctaTheme;
        
        // Handle videoUrl (for backward compatibility)
        if (heroData.videoUrl !== undefined) {
          hero.videoUrl = heroData.videoUrl;
        }
        
        // Handle file upload for this hero's image
        const fileKey = `heroImage-${i}`; // Changed from heroVideo to heroImage for images
        if (req.files && Array.isArray(req.files)) {
          // req.files is an array when using upload.any()
          const file = req.files.find(f => f.fieldname === fileKey);
          if (file) {
            // Check if it's image or video
            if (file.mimetype.startsWith('image/')) {
              // Use the optimized version path if available
              if (file.versions && file.versions.webp) {
                hero.backgroundImage = file.versions.webp;
              } else {
                hero.backgroundImage = `/uploads/images/${file.filename}`;
              }
              console.log(`Updated hero ${i} with image: ${hero.backgroundImage}`);
            } else {
              hero.videoUrl = `/uploads/videos/${file.filename}`;
              console.log(`Updated hero ${i} with video: ${hero.videoUrl}`);
            }
          }
        }
        
        await hero.save();
        console.log(`Hero ${i} saved:`, hero._id);
      }
      
      // Get all active heroes sorted by order
      const heroes = await Hero.find({ isActive: true }).sort({ order: 1 });
      
      res.status(200).json({
        success: true,
        message: 'Heroes updated successfully',
        data: { heroes }
      });
    } catch (error) {
      console.error('Error updating heroes:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating heroes',
        error: error.message
      });
    }
  }

  // ==================== HOME SECTIONS APIs ====================
  
  // GET Home sections (Info cards)
  async getHomeSections(req, res) {
    try {
      let homeSection = await HomeSection.findOne({ isActive: true });
      
      if (!homeSection) {
        return res.status(404).json({
          success: false,
          message: 'Home sections not found'
        });
      }
      
      // Sort sections by order
      homeSection.sections.sort((a, b) => a.order - b.order);
      
      res.status(200).json({
        success: true,
        data: {
          sections: homeSection.sections,
          factoryVideo: homeSection.factoryVideo || ""
        }
      });
    } catch (error) {
      console.error('Error in getHomeSections:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching home sections',
        error: error.message
      });
    }
  }

  // UPDATE Home sections
  async updateHomeSections(req, res) {
    try {
      let sections;
      
      // Parse sections data
      if (typeof req.body.sections === 'string') {
        sections = JSON.parse(req.body.sections);
      } else {
        sections = req.body.sections;
      }
      
      if (!sections || !Array.isArray(sections)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid sections data'
        });
      }
      
      let homeSection = await HomeSection.findOne({ isActive: true });
      if (!homeSection) {
        return res.status(404).json({
          success: false,
          message: 'Home sections not found'
        });
      }
      
      // Log files và body
      console.log('--- [updateHomeSections] ---');
      console.log('req.body:', req.body);
      console.log('req.files:', req.files);
      // Process uploaded files
      const files = req.files || {};
      // Log các file upload
      console.log('Files uploaded:', Object.keys(files));
      // Handle factory video upload if present
      if (files['factoryVideo'] && files['factoryVideo'][0]) {
        const factoryVideoFile = files['factoryVideo'][0];
        if (factoryVideoFile.mimetype.startsWith('video/')) {
          homeSection.factoryVideo = `/uploads/videos/${factoryVideoFile.filename}`;
          console.log('Factory video updated from file:', homeSection.factoryVideo);
        }
      } else if (req.body.factoryVideoUrl !== undefined || req.body.factoryVideo !== undefined) {
        // Accept either explicit YouTube URL field or the legacy field name
        const incoming = req.body.factoryVideoUrl !== undefined ? req.body.factoryVideoUrl : req.body.factoryVideo;
        console.log('Processing factoryVideo from body:', incoming);
        if (incoming === "") {
          homeSection.factoryVideo = "";
          console.log('Factory video cleared');
        } else {
          homeSection.factoryVideo = incoming;
          console.log('Factory video updated to:', homeSection.factoryVideo);
        }
      } else {
        console.log('No factoryVideo in request body or files');
      }
      // Tạo map _id -> section để mapping đúng
      const sectionMap = {};
      sections.forEach((section) => {
        if (section._id) sectionMap[section._id] = section;
      });
      // Mapping file upload cho section theo index (card_0, card_1, ...)
      Object.keys(files).forEach((key) => {
        const match = key.match(/^card_(\d+)$/);
        if (match) {
          const idx = parseInt(match[1], 10);
          const file = files[key][0];
          const section = sections[idx];
          if (section && file) {
            const uploadPath = file.mimetype.startsWith('video/') ? `/uploads/videos/${file.filename}` : `/uploads/images/${file.filename}`;
            section.mediaUrl = uploadPath;
            section.mediaType = file.mimetype.startsWith('video/') ? 'video' : 'image';
            console.log(`[MAPPING] Section index ${idx} - title: ${section.title} => file: ${file.filename}`);
          } else {
            console.warn(`[MAPPING WARNING] Không tìm thấy section cho file ${key}`);
          }
        }
      });
      // Đảm bảo order đúng
      sections.forEach((section, idx) => {
        section.order = idx + 1;
        console.log(`[SECTION] index ${idx} - title: ${section.title} - mediaUrl: ${section.mediaUrl}`);
      });
      homeSection.sections = sections;
      await homeSection.save();
      // Fetch lại từ DB để trả về data mới nhất
      const updated = await HomeSection.findOne({ isActive: true });
      res.status(200).json({
        success: true,
        message: 'Home sections updated successfully',
        data: {
          sections: updated.sections,
          factoryVideo: updated.factoryVideo
        }
      });
    } catch (error) {
      console.error('Error in updateHomeSections:', error);
      res.status(500).json({ success: false, message: 'Error updating home sections', error: error.message });
    }
  }

  // ==================== CUSTOMERS APIs ====================
  
  // GET Customers
  async getCustomers(req, res) {
    try {
      let customer = await Customer.findOne({ isActive: true });
      
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customers data not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: customer.categories
      });
    } catch (error) {
      console.error('Error in getCustomers:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching customers',
        error: error.message
      });
    }
  }

  // DELETE Customer by ID
  async deleteCustomer(req, res) {
    try {
      const { category, id } = req.params;
      
      if (!category || !id) {
        return res.status(400).json({
          success: false,
          message: 'Category and customer ID are required'
        });
      }
      
      if (category !== 'denimWoven' && category !== 'knit') {
        return res.status(400).json({
          success: false,
          message: 'Invalid category. Must be denimWoven or knit'
        });
      }
      
      const customer = await Customer.findOne({ isActive: true });
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customers data not found'
        });
      }
      
      // Tìm khách hàng trong danh mục đã chỉ định
      // Sử dụng String() để đảm bảo so sánh chuỗi chính xác
      // Điều này giúp xử lý cả ID MongoDB và ID tạm thời (temp_...)
      const customerIndex = customer.categories[category].findIndex(item => String(item._id) === String(id));
      
      if (customerIndex === -1) {
        return res.status(404).json({
          success: false,
          message: `Customer with ID ${id} not found in ${category} category`
        });
      }
      
      // Xóa khách hàng khỏi mảng
      customer.categories[category].splice(customerIndex, 1);
      
      // Sắp xếp lại thứ tự các khách hàng còn lại
      customer.categories[category].forEach((item, index) => {
        item.order = index + 1;
      });
      
      await customer.save();
      
      res.status(200).json({
        success: true,
        message: 'Customer deleted successfully',
        data: customer.categories
      });
    } catch (error) {
      console.error('Error in deleteCustomer:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting customer',
        error: error.message
      });
    }
  }

  // UPDATE Customers
  async updateCustomers(req, res) {
    try {
      let customers;
      
      // Parse customers data
      if (typeof req.body.customers === 'string') {
        customers = JSON.parse(req.body.customers);
      } else {
        customers = req.body.customers;
      }
      
      if (!customers) {
        return res.status(400).json({
          success: false,
          message: 'Invalid customers data'
        });
      }
      
      let customer = await Customer.findOne({ isActive: true });
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customers data not found'
        });
      }
      
      // Process uploaded logos
      const files = req.files || [];
      console.log('=== CUSTOMERS UPDATE DEBUG ===');
      console.log('Files uploaded for customers:', files.map(f => ({ fieldname: f.fieldname, filename: f.filename })));
      console.log('Request body fields:', Object.keys(req.body));
      console.log('Customers data structure:', JSON.stringify(customers, null, 2));
      
      // Group files by fieldname for easier access
      const filesByField = {};
      for (let file of files) {
        filesByField[file.fieldname] = file;
      }
      
      // Check for simplified field names for new customers
      const denimWovenNewFile = files.find(f => f.fieldname === 'denimWoven_new');
      const knitNewFile = files.find(f => f.fieldname === 'knit_new');
      
      // Handle denim & woven logos
      if (customers.denimWoven && Array.isArray(customers.denimWoven)) {
        customers.denimWoven.forEach((item) => {
          // Find the uploaded file for this customer using various possible field name patterns
          let logoFile = null;
          
          // For temporary IDs (new customers), use the simplified field name
          if (item._id.startsWith('temp_') && denimWovenNewFile) {
            logoFile = denimWovenNewFile;
          } else {
            // Try all possible field name patterns for existing customers
            const possibleFieldNames = [
              `denimWoven_${item._id}`,
              `denimWoven_${item._id}-logo`,
              `customers-denimWoven_${item._id}-logo`
            ];
            
            for (const fieldName of possibleFieldNames) {
              const matchingFile = files.find(f => f.fieldname === fieldName);
              if (matchingFile) {
                logoFile = matchingFile;
                break;
              }
            }
            
            // If still not found, check for any field name containing the ID
            if (!logoFile) {
              logoFile = files.find(f => f.fieldname.includes(item._id));
            }
          }
          
          if (logoFile) {
            console.log(`Processing logo for denimWoven customer ${item._id}:`, logoFile.filename);
            item.logo = `/uploads/images/${logoFile.filename}`;
          }
        });
        
        // Replace temporary IDs with proper MongoDB ObjectIds for new customers
        customers.denimWoven = customers.denimWoven.map((item, index) => {
          if (item._id.startsWith('temp_')) {
            const { _id, ...rest } = item;
            return { ...rest, order: index + 1 };
          }
          return { ...item, order: index + 1 };
        });
        
        customer.categories.denimWoven = customers.denimWoven;
      }
      
      // Handle knit logos
      if (customers.knit && Array.isArray(customers.knit)) {
        customers.knit.forEach((item) => {
          // Find the uploaded file for this customer using various possible field name patterns
          let logoFile = null;
          
          // For temporary IDs (new customers), use the simplified field name
          if (item._id.startsWith('temp_') && knitNewFile) {
            logoFile = knitNewFile;
          } else {
            // Try all possible field name patterns for existing customers
            const possibleFieldNames = [
              `knit_${item._id}`,
              `knit_${item._id}-logo`,
              `customers-knit_${item._id}-logo`
            ];
            
            for (const fieldName of possibleFieldNames) {
              const matchingFile = files.find(f => f.fieldname === fieldName);
              if (matchingFile) {
                logoFile = matchingFile;
                break;
              }
            }
            
            // If still not found, check for any field name containing the ID
            if (!logoFile) {
              logoFile = files.find(f => f.fieldname.includes(item._id));
            }
          }
          
          if (logoFile) {
            console.log(`Processing logo for knit customer ${item._id}:`, logoFile.filename);
            item.logo = `/uploads/images/${logoFile.filename}`;
          }
        });
        
        // Replace temporary IDs with proper MongoDB ObjectIds for new customers
        customers.knit = customers.knit.map((item, index) => {
          if (item._id.startsWith('temp_')) {
            const { _id, ...rest } = item;
            return { ...rest, order: index + 1 };
          }
          return { ...item, order: index + 1 };
        });
        
        customer.categories.knit = customers.knit;
      }
      
      await customer.save();
      
      res.status(200).json({
        success: true,
        message: 'Customers updated successfully',
        data: customer.categories
      });
    } catch (error) {
      console.error('Error in updateCustomers:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating customers',
        error: error.message
      });
    }
  }

  // ==================== CERTIFICATIONS APIs ====================
  
  // GET Certifications
  async getCertifications(req, res) {
    try {
      let certification = await Certification.findOne({ isActive: true });
      
      if (!certification) {
        return res.status(404).json({
          success: false,
          message: 'Certifications not found'
        });
      }
      
      // Sort by order
      certification.certifications.sort((a, b) => a.order - b.order);
      
      res.status(200).json({
        success: true,
        data: certification.certifications
      });
    } catch (error) {
      console.error('Error in getCertifications:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching certifications',
        error: error.message
      });
    }
  }

  // UPDATE Certifications
  async updateCertifications(req, res) {
    try {
      let certifications;
      
      // Parse certifications data
      if (typeof req.body.certifications === 'string') {
        certifications = JSON.parse(req.body.certifications);
      } else {
        certifications = req.body.certifications;
      }
      
      if (!certifications || !Array.isArray(certifications)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid certifications data'
        });
      }
      
      let certification = await Certification.findOne({ isActive: true });
      if (!certification) {
        return res.status(404).json({
          success: false,
          message: 'Certifications not found'
        });
      }
      
      // Process uploaded images
      const files = req.files || {};
      
      certifications.forEach((cert, index) => {
        const imageFile = files[`cert_${index}`];
        if (imageFile && imageFile[0]) {
          cert.image = `/uploads/images/${imageFile[0].filename}`;
        }
        cert.order = index + 1;
      });
      
      certification.certifications = certifications;
      await certification.save();
      
      res.status(200).json({
        success: true,
        message: 'Certifications updated successfully',
        data: certification.certifications
      });
    } catch (error) {
      console.error('Error in updateCertifications:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating certifications',
        error: error.message
      });
    }
  }

  // ==================== NEWS APIs (CRUD) ====================
  
  // GET News (with pagination)
  async getNews(req, res) {
    try {
      const { page = 1, limit = 10, featured = false, admin = false } = req.query;
      const skip = (page - 1) * limit;
      
      // ✅ FIXED: Admin mode gets ALL news (published + unpublished)
      let filter = {};
      
      if (admin !== 'true') {
        // Public mode: only published news
        filter.isPublished = true;
        
        if (featured === 'true') {
          filter.isFeatured = true;
        }
      }
      // Admin mode: get ALL news (no isPublished filter)
      
      const news = await News.find(filter)
        .sort({ publishDate: -1, createdAt: -1 })
        .limit(limit * 1)
        .skip(skip)
        .select(admin === 'true' ? '' : '-content'); // Admin gets full content
      
      const total = await News.countDocuments(filter);
      
      // ✅ FIXED: Add statistics for admin
      let stats = {};
      if (admin === 'true') {
        stats = {
          total: await News.countDocuments({}),
          published: await News.countDocuments({ isPublished: true }),
          hidden: await News.countDocuments({ isPublished: false }),
          featured: await News.countDocuments({ isPublished: true, isFeatured: true }),
          regular: await News.countDocuments({ isPublished: true, isFeatured: false })
        };
      }
      
      res.status(200).json({
        success: true,
        data: {
          news,
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          ...(admin === 'true' && { stats })
        }
      });
    } catch (error) {
      console.error('Error in getNews:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching news',
        error: error.message
      });
    }
  }

  async getAllNewsForAdmin(req, res) {
    try {
      console.log('Getting all news for admin');
      
      const news = await News.find({})
        .sort({ publishDate: -1, createdAt: -1 })
        .select('title content excerpt image mainImage additionalImages publishDate isPublished isFeatured views tags author createdAt updatedAt onHome');
      
      console.log(`Found ${news.length} news items`);
      
      const stats = {
        total: news.length,
        published: news.filter(n => n.isPublished).length,
        hidden: news.filter(n => !n.isPublished).length,
        featured: news.filter(n => n.isPublished && n.isFeatured).length,
        regular: news.filter(n => n.isPublished && !n.isFeatured).length
      };
      
      // Trả về dữ liệu dưới dạng mảng trực tiếp để phù hợp với client
      res.status(200).json({
        success: true,
        data: news
      });
    } catch (error) {
      console.error('Error in getAllNewsForAdmin:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching all news for admin',
        error: error.message
      });
    }
  }
  
  // 3. ADD this method for bulk operations (optional):
  async bulkUpdateNewsStatus(req, res) {
    try {
      const { newsIds, isPublished, isFeatured } = req.body;
      
      if (!newsIds || !Array.isArray(newsIds)) {
        return res.status(400).json({
          success: false,
          message: 'newsIds array is required'
        });
      }
      
      const updateData = {};
      if (isPublished !== undefined) updateData.isPublished = isPublished;
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
      
      const result = await News.updateMany(
        { _id: { $in: newsIds } },
        updateData
      );
      
      res.status(200).json({
        success: true,
        message: `Updated ${result.modifiedCount} news items`,
        data: {
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount
        }
      });
    } catch (error) {
      console.error('Error in bulkUpdateNewsStatus:', error);
      res.status(500).json({
        success: false,
        message: 'Error bulk updating news status',
        error: error.message
      });
    }
  }

  // GET Single News
  async getNewsById(req, res) {
    try {
      const { id } = req.params;
      console.log('getNewsById param:', id);
      let news = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        news = await News.findById(id);
        console.log('findById result:', news);
      }
      if (!news) {
        news = await News.findOne({ slug: id });
        console.log('findOne by slug result:', news);
      }
      if (!news) {
        return res.status(404).json({ success: false, message: 'News not found' });
      }
      news.views += 1;
      await news.save();
      res.status(200).json({ success: true, data: news });
    } catch (error) {
      console.error('Error in getNewsById:', error);
      res.status(500).json({ success: false, message: 'Error fetching news', error: error.message });
    }
  }

  // CREATE News
  async createNews(req, res) {
    try {
      const { title, content, excerpt, tags, isFeatured, isPublished, publishDate, onHome } = req.body;
      
      console.log('Create News - req.files:', req.files);
      console.log('Create News - req.file:', req.file);
      
      // Kiểm tra hình ảnh chính
      const mainImageFile = req.files && req.files.newsImage ? req.files.newsImage[0] : null;
      console.log('Main image file:', mainImageFile);
      
      if (!mainImageFile) {
        return res.status(400).json({
          success: false,
          message: 'Main image is required'
        });
      }
      
      // Xử lý hình ảnh chính
      const mainImageUrl = `/uploads/images/${mainImageFile.filename}`;
      
      const news = new News({
        title,
        content,
        excerpt: excerpt || '',
        mainImage: mainImageUrl,
        additionalImages: [],
        image: mainImageUrl, // Giữ backward compatibility
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        isFeatured: isFeatured === 'true',
        isPublished: isPublished === 'true',
        onHome: onHome === 'true',
        publishDate: publishDate || Date.now(),
        views: 0
      });
      
      console.log('Creating news with additionalImages:', news.additionalImages);
      
      await news.save();
      
      console.log('News saved successfully:', news);
      
      res.status(201).json({
        success: true,
        message: 'News created successfully',
        data: news
      });
    } catch (error) {
      console.error('Error in createNews:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating news',
        error: error.message
      });
    }
  }

  // UPDATE News
  async updateNews(req, res) {
    try {
      const { id } = req.params;
      const { title, content, excerpt, tags, isFeatured, isPublished, publishDate, onHome } = req.body;
      
      console.log('Update News - req.files:', req.files);
      console.log('Update News - req.file:', req.file);
      
      const news = await News.findById(id);
      if (!news) {
        return res.status(404).json({
          success: false,
          message: 'News not found'
        });
      }
      
      // Update fields
      if (title) news.title = title;
      // Allow updating even when content is an empty string
      if (content !== undefined) {
        console.log('[updateNews] Incoming content length:', typeof content === 'string' ? content.length : 'not-string');
        if (typeof content === 'string') {
          const preview = content.replace(/\n/g, ' ').slice(0, 200);
          console.log('[updateNews] content preview:', preview);
        }
        news.content = content;
        // Ensure mongoose detects string changes
        news.markModified('content');
      } else {
        console.log('[updateNews] No content field provided in body');
      }
      if (excerpt !== undefined) news.excerpt = excerpt;
      if (tags) news.tags = tags.split(',').map(tag => tag.trim());
      if (isFeatured !== undefined) news.isFeatured = isFeatured === 'true';
      if (isPublished !== undefined) news.isPublished = isPublished === 'true';
      if (onHome !== undefined) news.onHome = onHome === 'true';
      if (publishDate) news.publishDate = publishDate;
      
      // Update main image if new one uploaded
      const mainImageFile = req.files && req.files.newsImage ? req.files.newsImage[0] : null;
      if (mainImageFile) {
        news.mainImage = `/uploads/images/${mainImageFile.filename}`;
        news.image = `/uploads/images/${mainImageFile.filename}`; // Giữ backward compatibility
      }
      
      // Additional images feature removed
      
      await news.save();
      
      res.status(200).json({
        success: true,
        message: 'News updated successfully',
        data: news
      });
    } catch (error) {
      console.error('Error in updateNews:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating news',
        error: error.message
      });
    }
  }

  // DELETE News
  async deleteNews(req, res) {
    try {
      const { id } = req.params;
      
      const news = await News.findByIdAndDelete(id);
      if (!news) {
        return res.status(404).json({
          success: false,
          message: 'News not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'News deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteNews:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting news',
        error: error.message
      });
    }
  }

  // GET All published news for "View All News" page
  async getAllPublishedNews(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;
      const search = req.query.search || '';
      
      console.log('🔍 Search query received:', search);
      
      // Build filter
      let filter = { isPublished: true };
      
      // Add search filter if search query exists
      // Search in: title, content (nội dung), and tags
      if (search && search.trim()) {
        console.log('✅ Applying search filter for:', search.trim());
        const searchRegex = { $regex: search.trim(), $options: 'i' };
        filter = {
          isPublished: true,
          $or: [
            { title: searchRegex },
            { content: searchRegex },
            { tags: searchRegex }
          ]
        };
        console.log('📋 Filter:', JSON.stringify(filter, null, 2));
      } else {
        console.log('❌ No search query, showing all published news');
      }
      
      // Get news with pagination
      const news = await News.find(filter)
        .sort({ publishDate: -1 })
        .skip(skip)
        .limit(limit)
        .select('-content'); // Không lấy nội dung đầy đủ để giảm kích thước response
      
      // Get total count for pagination
      const totalItems = await News.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / limit);
      
      res.status(200).json({
        success: true,
        data: {
          news,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems,
            limit
          }
        }
      });
    } catch (error) {
      console.error('Error fetching all published news:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching news',
        error: error.message
      });
    }
  }

  // ==================== HOME CONTACT SECTION APIs ====================
  
  // GET Home contact section
  async getHomeContact(req, res) {
    try {
      console.log('Getting HomeContact data...');
      let homeContact = await HomeContact.findOne({ isActive: true });
      
      if (!homeContact) {
        console.log('No HomeContact data found, creating default...');
        // Create default if not exists
        homeContact = new HomeContact({
          contact: {
            title: 'CONTACT',
            description: 'Seeking us and you\'ll get someone who can deliver consistent, high-quality products while minimizing their ecological footprint',
            buttonText: 'CONTACT US',
            buttonLink: '/contact'
          },
          workWithUs: {
            title: 'WORK WITH US',
            description: 'We are looking for intelligent, passionate individuals who are ready to join us in building and growing the company',
            buttonText: 'LEARN MORE',
            buttonLink: '/recruitment'
          },
          isActive: true
        });
        await homeContact.save();
        console.log('Default HomeContact created:', homeContact);
      } else {
        console.log('HomeContact data found:', homeContact);
      }
      
      res.status(200).json({
        success: true,
        data: homeContact
      });
    } catch (error) {
      console.error('Error in getHomeContact:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching home contact section',
        error: error.message
      });
    }
  }

  // UPDATE Home contact section
  async updateHomeContact(req, res) {
    try {
      console.log('Updating HomeContact data with:', req.body);
      const { contact, workWithUs } = req.body;
      
      let homeContact = await HomeContact.findOne({ isActive: true });
      if (!homeContact) {
        console.log('No HomeContact found, creating new one');
        homeContact = new HomeContact({
          contact: {
            title: 'CONTACT',
            description: 'Seeking us and you\'ll get someone who can deliver consistent, high-quality products while minimizing their ecological footprint',
            buttonText: 'CONTACT US',
            buttonLink: '/contact'
          },
          workWithUs: {
            title: 'WORK WITH US',
            description: 'We are looking for intelligent, passionate individuals who are ready to join us in building and growing the company',
            buttonText: 'LEARN MORE',
            buttonLink: '/recruitment'
          },
          isActive: true
        });
      }
      
      // Update contact section
      if (contact) {
        console.log('Updating contact section with:', contact);
        if (contact.title !== undefined) homeContact.contact.title = contact.title;
        if (contact.description !== undefined) homeContact.contact.description = contact.description;
        if (contact.buttonText !== undefined) homeContact.contact.buttonText = contact.buttonText;
        if (contact.buttonLink !== undefined) homeContact.contact.buttonLink = contact.buttonLink;
      }
      
      // Update work with us section
      if (workWithUs) {
        console.log('Updating workWithUs section with:', workWithUs);
        if (workWithUs.title !== undefined) homeContact.workWithUs.title = workWithUs.title;
        if (workWithUs.description !== undefined) homeContact.workWithUs.description = workWithUs.description;
        if (workWithUs.buttonText !== undefined) homeContact.workWithUs.buttonText = workWithUs.buttonText;
        if (workWithUs.buttonLink !== undefined) homeContact.workWithUs.buttonLink = workWithUs.buttonLink;
      }
      
      console.log('Saving updated HomeContact:', homeContact);
      await homeContact.save();
      
      res.status(200).json({
        success: true,
        message: 'Home contact section updated successfully',
        data: homeContact
      });
    } catch (error) {
      console.error('Error in updateHomeContact:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating home contact section',
        error: error.message
      });
    }
  }

  // ==================== HOMEPAGE DATA (Combined) ====================
  
  // GET All homepage data
  async getHomepageData(req, res) {
    try {
      const [heroes, homeSections, customers, certifications, featuredNews, regularNews, homeContact] = await Promise.all([
        Hero.find({ isActive: true }).sort({ order: 1 }),
        HomeSection.findOne({ isActive: true }),
        Customer.findOne({ isActive: true }),
        Certification.findOne({ isActive: true }),
        // Lấy 1 tin nổi bật mới nhất được đánh dấu hiển thị trên trang chủ
        News.find({ isPublished: true, isFeatured: true, onHome: true })
          .sort({ publishDate: -1 })
          .limit(1)
          .select('-content'),
        // Lấy 3 tin thường mới nhất được đánh dấu hiển thị trên trang chủ
        News.find({ isPublished: true, isFeatured: false, onHome: true })
          .sort({ publishDate: -1 })
          .limit(3)
          .select('-content'),
        // Get home contact section
        HomeContact.findOne({ isActive: true })
      ]);
      
      // Create default home contact if not exists
      const contactData = homeContact || new HomeContact({
        contact: {
          title: 'CONTACT',
          description: 'Seeking us and you\'ll get someone who can deliver consistent, high-quality products while minimizing their ecological footprint',
          buttonText: 'CONTACT US',
          buttonLink: '/contact'
        },
        workWithUs: {
          title: 'WORK WITH US',
          description: 'We are looking for intelligent, passionate individuals who are ready to join us in building and growing the company',
          buttonText: 'LEARN MORE',
          buttonLink: '/recruitment'
        },
        isActive: true
      });
      
      if (!homeContact) {
        console.log('Creating default HomeContact in getHomepageData');
        await contactData.save();
      }
      
      res.status(200).json({
        success: true,
        data: {
          heroes: heroes || [],
          hero: heroes && heroes.length > 0 ? heroes[0] : null,  // Backward compatibility
          sections: homeSections?.sections?.sort((a, b) => a.order - b.order) || [],
          factoryVideo: homeSections?.factoryVideo || "",
          customers: customers?.categories || { denimWoven: [], knit: [] },
          certifications: certifications?.certifications?.sort((a, b) => a.order - b.order) || [],
          featuredNews: featuredNews || [],
          regularNews: regularNews || [],
          homeContact: contactData
        }
      });
    } catch (error) {
      console.error('Error in getHomepageData:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching homepage data',
        error: error.message
      });
    }
  }

  // ==================== NEWS ADDITIONAL IMAGES MANAGEMENT ====================
  
  // Add additional images to news
  async addNewsAdditionalImages(req, res) {
    try {
      const { id } = req.params;
      
      const news = await News.findById(id);
      if (!news) {
        return res.status(404).json({
          success: false,
          message: 'News not found'
        });
      }
      
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No images uploaded'
        });
      }
      
      const files = Array.isArray(req.files) ? req.files : [req.files];
      
      // Ensure additionalImages array exists
      if (!news.additionalImages) {
        news.additionalImages = [];
      }
      
      const newImages = files.map((file, index) => ({
        url: `/uploads/images/${file.filename}`,
        alt: `${news.title} - Image ${news.additionalImages.length + index + 1}`,
        order: news.additionalImages.length + index + 1
      }));
      
      news.additionalImages.push(...newImages);
      await news.save();
      
      res.status(201).json({
        success: true,
        message: 'Additional images added successfully',
        data: news.additionalImages
      });
    } catch (error) {
      console.error('Error in addNewsAdditionalImages:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding additional images',
        error: error.message
      });
    }
  }
  
  // Remove additional image from news
  async removeNewsAdditionalImage(req, res) {
    try {
      const { id, imageIndex } = req.params;
      
      const news = await News.findById(id);
      if (!news) {
        return res.status(404).json({
          success: false,
          message: 'News not found'
        });
      }
      
      // Ensure additionalImages array exists
      if (!news.additionalImages) {
        news.additionalImages = [];
      }
      
      const index = parseInt(imageIndex);
      if (index < 0 || index >= news.additionalImages.length) {
        return res.status(400).json({
          success: false,
          message: 'Invalid image index'
        });
      }
      
      news.additionalImages.splice(index, 1);
      
      // Reorder remaining images
      news.additionalImages.forEach((img, idx) => {
        img.order = idx + 1;
      });
      
      await news.save();
      
      res.status(200).json({
        success: true,
        message: 'Image removed successfully',
        data: news.additionalImages
      });
    } catch (error) {
      console.error('Error in removeNewsAdditionalImage:', error);
      res.status(500).json({
        success: false,
        message: 'Error removing image',
        error: error.message
      });
    }
  }
  
  // Reorder additional images
  async reorderNewsAdditionalImages(req, res) {
    try {
      const { id } = req.params;
      const { imageOrder } = req.body; // Array of image indices in new order
      
      const news = await News.findById(id);
      if (!news) {
        return res.status(404).json({
          success: false,
          message: 'News not found'
        });
      }
      
      // Ensure additionalImages array exists
      if (!news.additionalImages) {
        news.additionalImages = [];
      }
      
      if (!Array.isArray(imageOrder) || imageOrder.length !== news.additionalImages.length) {
        return res.status(400).json({
          success: false,
          message: 'Invalid image order array'
        });
      }
      
      // Create new ordered array
      const reorderedImages = imageOrder.map((index, newOrder) => ({
        ...news.additionalImages[index],
        order: newOrder + 1
      }));
      
      news.additionalImages = reorderedImages;
      await news.save();
      
      res.status(200).json({
        success: true,
        message: 'Images reordered successfully',
        data: news.additionalImages
      });
    } catch (error) {
      console.error('Error in reorderNewsAdditionalImages:', error);
      res.status(500).json({
        success: false,
        message: 'Error reordering images',
        error: error.message
      });
    }
  }
}

module.exports = {
  HomeController: new HomeController(),
  uploadConfigs,
  upload
};