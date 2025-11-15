const { CompanyInfo, Job, ContactHR, JobApplication } = require('../models/Careers');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Configure multer for CV uploads
const cvStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/cvs/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cv-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: cvStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
    }
  }
});

// Configure multer for job image uploads
const jobImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/images/jobs/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'job-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const jobImageUpload = multer({ 
  storage: jobImageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Export upload middlewares
const uploadJobImage = jobImageUpload.single('jobImage');



class CareersController {
  
  // ==================== MAIN PAGE DATA ====================
  
  async getCareersPageData(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      
      // Get company info
      const companyInfo = await CompanyInfo.findOne({ isActive: true });
      if (!companyInfo) {
        return res.status(404).json({
          success: false,
          message: 'Company info not found'
        });
      }
      
      // Get contact HR info
      const contactHR = await ContactHR.findOne({ isActive: true });
      if (!contactHR) {
        return res.status(404).json({
          success: false,
          message: 'Contact HR info not found'
        });
      }
      
      // Get paginated jobs - only active jobs
      const jobsData = await Job.getJobsWithPagination(parseInt(page), parseInt(limit));
      
      // Transform jobs for frontend
      const transformedJobs = jobsData.jobs.map(job => ({
        _id: job._id,
        title: job.title,
        slug: job.slug,
        type: job.type,
        location: job.location,
        createdAt: job.createdAt,
        description: job.description,
        requirements: job.requirements,
        benefits: job.benefits,
        isFeatured: job.isFeatured,
        applicationCount: job.applicationCount,
        isActive: job.isActive
      }));
      
      res.status(200).json({
        success: true,
        data: {
          jobs: transformedJobs,
          pagination: jobsData.pagination,
          companyInfo: {
            logo: companyInfo.logo,
            title: companyInfo.title,
            description: companyInfo.description,
            stats: companyInfo.stats
          },
          contactHR: {
            title: contactHR.title,
            description: contactHR.description,
            email: contactHR.email,
            phone: contactHR.phone,
            submitResumeText: contactHR.submitResumeText
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching careers page data',
        error: error.message
      });
    }
  }

  // ==================== COMPANY INFO MANAGEMENT ====================
  
  async getCompanyInfo(req, res) {
    try {
      const companyInfo = await CompanyInfo.findOne({ isActive: true });
      
      if (!companyInfo) {
        return res.status(404).json({
          success: false,
          message: 'Company info not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: companyInfo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching company info',
        error: error.message
      });
    }
  }

  async updateCompanyInfo(req, res) {
    try {
      const updateData = { ...req.body };
      
      const companyInfo = await CompanyInfo.findOneAndUpdate(
        { isActive: true },
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!companyInfo) {
        return res.status(404).json({
          success: false,
          message: 'Company info not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Company info updated successfully',
        data: companyInfo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating company info',
        error: error.message
      });
    }
  }

  // ==================== CONTACT HR MANAGEMENT ====================
  
  async getContactHR(req, res) {
    try {
      const contactHR = await ContactHR.findOne({ isActive: true });
      
      if (!contactHR) {
        return res.status(404).json({
          success: false,
          message: 'Contact HR info not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: contactHR
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching contact HR info',
        error: error.message
      });
    }
  }

  async updateContactHR(req, res) {
    try {
      const updateData = { ...req.body };
      
      const contactHR = await ContactHR.findOneAndUpdate(
        { isActive: true },
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!contactHR) {
        return res.status(404).json({
          success: false,
          message: 'Contact HR info not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Contact HR info updated successfully',
        data: contactHR
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating contact HR info',
        error: error.message
      });
    }
  }

  // ==================== JOBS MANAGEMENT ====================
  
  async getAllJobs(req, res) {
    try {
      const { includeInactive = 'false', category, page = 1, limit = 50 } = req.query;
      
      let filter = {};
      
      if (includeInactive !== 'true') {
        filter.isActive = true;
      }
      
      if (category) {
        filter.category = category;
      }
      
      const jobs = await Job.find(filter).sort({ order: 1, createdAt: -1 });
      
      res.status(200).json({
        success: true,
        data: jobs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching jobs',
        error: error.message
      });
    }
  }

  async createJob(req, res) {
    try {
      // Parse JSON fields from FormData if needed
      let bodyData = req.body;
      if (req.body.requirements && typeof req.body.requirements === 'string') {
        bodyData.requirements = JSON.parse(req.body.requirements);
      }
      if (req.body.requirementsJa && typeof req.body.requirementsJa === 'string') {
        bodyData.requirementsJa = JSON.parse(req.body.requirementsJa);
      }
      if (req.body.benefits && typeof req.body.benefits === 'string') {
        bodyData.benefits = JSON.parse(req.body.benefits);
      }
      if (req.body.benefitsJa && typeof req.body.benefitsJa === 'string') {
        bodyData.benefitsJa = JSON.parse(req.body.benefitsJa);
      }
      if (req.body.salary && typeof req.body.salary === 'string') {
        bodyData.salary = JSON.parse(req.body.salary);
      }
      if (req.body.age && typeof req.body.age === 'string') {
        bodyData.age = JSON.parse(req.body.age);
      }
      // Parse SEO từ JSON string nếu là string (khi gửi từ FormData)
      if (req.body.seo && typeof req.body.seo === 'string') {
        try {
          bodyData.seo = JSON.parse(req.body.seo);
        } catch (e) {
          console.error('Error parsing SEO JSON:', e);
          bodyData.seo = null;
        }
      }

      console.log('Creating new job - Request body:', bodyData);
      let { 
        jobCode, title, titleJa, category, categoryId, location, locationJa, workType, 
        description, descriptionJa, requirements, requirementsJa, benefits, benefitsJa,
        salary, bonus, bonusJa, allowance, allowanceJa, otherBenefits, otherBenefitsJa, 
        major, majorJa, age, experience, experienceJa, language, languageJa,
        overtime, overtimeJa, offTime, offTimeJa, interviewFormat, interviewFormatJa, 
        interviewTime, interviewTimeJa, otherInfo, otherInfoJa, assignedTo,
        recruitmentStatus, isActive, isFeatured, order, useCategoryImage, seo, slug, slugJa
      } = bodyData;
      
      if (!title || !category || !location || !description) {
        console.log('Validation failed: Missing required fields');
        // Delete uploaded file if exists
        if (req.file) {
          const filePath = path.join(__dirname, '..', req.file.path);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        return res.status(400).json({
          success: false,
          message: 'Title, category, location, and description are required'
        });
      }
      
      // Handle job image
      let jobImageUrl = '';
      if (req.file) {
        // User uploaded custom image
        jobImageUrl = `/uploads/images/jobs/${req.file.filename}`;
      } else if (useCategoryImage === 'false' || useCategoryImage === false) {
        // User wants to use custom image but didn't upload - error
        return res.status(400).json({
          success: false,
          message: 'Vui lòng upload ảnh hoặc chọn dùng ảnh từ danh mục'
        });
      } else {
        // useCategoryImage is true - will use category image on frontend
        jobImageUrl = ''; // Empty means use category image
      }
      
      // Generate slug from title if not provided, or use provided slug
      let finalSlug = slug;
      if (!finalSlug || finalSlug.trim() === '') {
        // Normalize Vietnamese diacritics
        let normalized = title
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // strip diacritics
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'D');

        let baseSlug = normalized
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '')
          .trim();

        // Fallback if still empty
        if (!baseSlug || baseSlug.length === 0) {
          baseSlug = `job-${Date.now()}`;
        }

        // Ensure uniqueness
        let uniqueSlug = baseSlug;
        let counter = 2;
        while (await Job.findOne({ slug: uniqueSlug })) {
          uniqueSlug = `${baseSlug}-${counter}`;
          counter += 1;
        }
        finalSlug = uniqueSlug;
      } else {
        // Use provided slug, but ensure uniqueness
        finalSlug = finalSlug.toLowerCase().trim();
        let uniqueSlug = finalSlug;
        let counter = 2;
        while (await Job.findOne({ slug: uniqueSlug })) {
          uniqueSlug = `${finalSlug}-${counter}`;
          counter += 1;
        }
        finalSlug = uniqueSlug;
      }
      
      // Generate slugJa from titleJa if not provided using romaji conversion
      let finalSlugJa = slugJa;
      if (titleJa && (!finalSlugJa || finalSlugJa.trim() === '')) {
        const { generateSlugJaFromTitleJa } = require('../utils/japaneseToRomaji');
        let baseSlugJa = await generateSlugJaFromTitleJa(titleJa, 'job');
        
        // Ensure uniqueness
        let uniqueSlugJa = baseSlugJa;
        let counter = 2;
        while (await Job.findOne({ slugJa: uniqueSlugJa })) {
          uniqueSlugJa = `${baseSlugJa}-${counter}`;
          counter += 1;
        }
        finalSlugJa = uniqueSlugJa;
      } else if (finalSlugJa && finalSlugJa.trim() !== '') {
        // Use provided slugJa, but ensure uniqueness
        finalSlugJa = finalSlugJa.trim();
        let uniqueSlugJa = finalSlugJa;
        let counter = 2;
        while (await Job.findOne({ slugJa: uniqueSlugJa })) {
          uniqueSlugJa = `${finalSlugJa}-${counter}`;
          counter += 1;
        }
        finalSlugJa = uniqueSlugJa;
      }
      
      const jobData = {
        jobCode: jobCode || undefined,
        title: title.trim(),
        titleJa: titleJa?.trim() || undefined,
        category: category,
        categoryId: categoryId || undefined,
        location: location.trim(),
        locationJa: locationJa?.trim() || undefined,
        workType: workType || 'Full-time',
        description: description.trim(),
        descriptionJa: descriptionJa?.trim() || undefined,
        requirements: Array.isArray(requirements) ? requirements : [],
        requirementsJa: Array.isArray(requirementsJa) ? requirementsJa : [],
        benefits: Array.isArray(benefits) ? benefits : [],
        benefitsJa: Array.isArray(benefitsJa) ? benefitsJa : [],
        salary: salary || {},
        bonus: bonus || undefined,
        bonusJa: bonusJa || undefined,
        allowance: allowance || undefined,
        allowanceJa: allowanceJa || undefined,
        otherBenefits: otherBenefits || undefined,
        otherBenefitsJa: otherBenefitsJa || undefined,
        major: major || undefined,
        majorJa: majorJa || undefined,
        age: age || {},
        experience: experience || undefined,
        experienceJa: experienceJa || undefined,
        language: language || undefined,
        languageJa: languageJa || undefined,
        overtime: overtime || undefined,
        overtimeJa: overtimeJa || undefined,
        offTime: offTime || undefined,
        offTimeJa: offTimeJa || undefined,
        interviewFormat: interviewFormat || undefined,
        interviewFormatJa: interviewFormatJa || undefined,
        interviewTime: interviewTime || undefined,
        interviewTimeJa: interviewTimeJa || undefined,
        otherInfo: otherInfo || undefined,
        otherInfoJa: otherInfoJa || undefined,
        assignedTo: assignedTo || undefined,
        recruitmentStatus: recruitmentStatus || 'Đang tuyển',
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured || false,
        order: order || 0,
        slug: finalSlug,
        slugJa: finalSlugJa || undefined,
        // SEO fields - set các field được gửi lên (kể cả empty string)
        ...(seo && {
          seo: {
            ...(seo.metaTitle !== undefined && { metaTitle: seo.metaTitle || '' }),
            ...(seo.metaDescription !== undefined && { metaDescription: seo.metaDescription || '' }),
            ...(seo.metaKeywords !== undefined && { 
              metaKeywords: Array.isArray(seo.metaKeywords) 
                ? seo.metaKeywords 
                : (typeof seo.metaKeywords === 'string' 
                  ? seo.metaKeywords.split(',').map(k => k.trim()).filter(k => k)
                  : [])
            }),
            ...(seo.ogImage !== undefined && { ogImage: seo.ogImage || '' })
          }
        })
      };

      // Only set jobImage if we have a custom image
      if (jobImageUrl) {
        jobData.jobImage = jobImageUrl;
      }
      
      console.log('Processed job data:', jobData);
      const job = new Job(jobData);
      console.log('Job model instance created');
      await job.save();
      console.log('Job saved successfully:', job);
      
      res.status(201).json({
        success: true,
        message: 'Job created successfully',
        data: job
      });
    } catch (error) {
      console.error('Error in createJob:', error);
      // Delete uploaded file if error
      if (req.file) {
        const filePath = path.join(__dirname, '..', req.file.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      if (error.code === 11000) {
        console.log('Duplicate key error:', error.keyValue);
        res.status(400).json({
          success: false,
          message: 'Job with this title already exists'
        });
      } else {
        console.error('Unhandled error in createJob:', error.message, error.stack);
        res.status(500).json({
          success: false,
          message: 'Error creating job',
          error: error.message
        });
      }
    }
  }

  async getJobById(req, res) {
    try {
      const { jobId } = req.params;
      
      const job = await Job.findById(jobId);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: job
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching job',
        error: error.message
      });
    }
  }

  async getJobBySlug(req, res) {
    try {
      const { slug } = req.params;
      
      // Tìm theo slug (tiếng Việt) hoặc slugJa (tiếng Nhật)
      const job = await Job.findOne({ 
        $or: [
          { slug: slug, isActive: true },
          { slugJa: slug, isActive: true }
        ]
      });
      
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      // Transform for job details display
      const jobDetails = {
        id: job._id,
        title: job.title,
        slug: job.slug,
        type: job.type,
        location: job.location,
        description: job.description,
        requirements: job.requirements,
        benefits: job.benefits,
        postedDate: job.postedDate,
        applicationCount: job.applicationCount
      };
      
      res.status(200).json({
        success: true,
        data: jobDetails
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching job',
        error: error.message
      });
    }
  }

  async updateJob(req, res) {
    try {
      // Parse JSON fields from FormData if needed
      let bodyData = req.body;
      if (req.body.requirements && typeof req.body.requirements === 'string') {
        bodyData.requirements = JSON.parse(req.body.requirements);
      }
      if (req.body.requirementsJa && typeof req.body.requirementsJa === 'string') {
        bodyData.requirementsJa = JSON.parse(req.body.requirementsJa);
      }
      if (req.body.benefits && typeof req.body.benefits === 'string') {
        bodyData.benefits = JSON.parse(req.body.benefits);
      }
      if (req.body.benefitsJa && typeof req.body.benefitsJa === 'string') {
        bodyData.benefitsJa = JSON.parse(req.body.benefitsJa);
      }
      if (req.body.salary && typeof req.body.salary === 'string') {
        bodyData.salary = JSON.parse(req.body.salary);
      }
      if (req.body.age && typeof req.body.age === 'string') {
        bodyData.age = JSON.parse(req.body.age);
      }
      // Parse SEO từ JSON string nếu là string (khi gửi từ FormData)
      if (req.body.seo && typeof req.body.seo === 'string') {
        try {
          bodyData.seo = JSON.parse(req.body.seo);
        } catch (e) {
          console.error('Error parsing SEO JSON:', e);
          bodyData.seo = null;
        }
      }

      const { jobId } = req.params;
      
      // Tìm job trước để xử lý SEO và image
      const existingJob = await Job.findById(jobId);
      if (!existingJob) {
        // Delete uploaded file if job not found
        if (req.file) {
          const filePath = path.join(__dirname, '..', req.file.path);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      const updateData = { ...bodyData };
      
      // Handle job image upload
      if (req.file) {
        // Delete old image if exists
        if (existingJob.jobImage && existingJob.jobImage.startsWith('/uploads/')) {
          const oldFilePath = path.join(__dirname, '..', existingJob.jobImage);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        updateData.jobImage = `/uploads/images/jobs/${req.file.filename}`;
      } else if (bodyData.useCategoryImage === 'true' || bodyData.useCategoryImage === true) {
        // User wants to use category image - remove jobImage
        updateData.jobImage = undefined;
      }
      
      // Clean up string data
      if (updateData.title) updateData.title = updateData.title.trim();
      if (updateData.titleJa) updateData.titleJa = updateData.titleJa.trim();
      if (updateData.location) updateData.location = updateData.location.trim();
      if (updateData.locationJa) updateData.locationJa = updateData.locationJa.trim();
      if (updateData.description) updateData.description = updateData.description.trim();
      if (updateData.descriptionJa) updateData.descriptionJa = updateData.descriptionJa.trim();
      if (updateData.jobCode) updateData.jobCode = updateData.jobCode.trim();
      if (updateData.bonus) updateData.bonus = updateData.bonus.trim();
      if (updateData.bonusJa) updateData.bonusJa = updateData.bonusJa.trim();
      if (updateData.allowance) updateData.allowance = updateData.allowance.trim();
      if (updateData.allowanceJa) updateData.allowanceJa = updateData.allowanceJa.trim();
      if (updateData.otherBenefits) updateData.otherBenefits = updateData.otherBenefits.trim();
      if (updateData.otherBenefitsJa) updateData.otherBenefitsJa = updateData.otherBenefitsJa.trim();
      if (updateData.major) updateData.major = updateData.major.trim();
      if (updateData.majorJa) updateData.majorJa = updateData.majorJa.trim();
      if (updateData.experience) updateData.experience = updateData.experience.trim();
      if (updateData.experienceJa) updateData.experienceJa = updateData.experienceJa.trim();
      if (updateData.language) updateData.language = updateData.language.trim();
      if (updateData.languageJa) updateData.languageJa = updateData.languageJa.trim();
      if (updateData.overtime) updateData.overtime = updateData.overtime.trim();
      if (updateData.overtimeJa) updateData.overtimeJa = updateData.overtimeJa.trim();
      if (updateData.offTime) updateData.offTime = updateData.offTime.trim();
      if (updateData.offTimeJa) updateData.offTimeJa = updateData.offTimeJa.trim();
      if (updateData.interviewFormat) updateData.interviewFormat = updateData.interviewFormat.trim();
      if (updateData.interviewFormatJa) updateData.interviewFormatJa = updateData.interviewFormatJa.trim();
      if (updateData.interviewTime) updateData.interviewTime = updateData.interviewTime.trim();
      if (updateData.interviewTimeJa) updateData.interviewTimeJa = updateData.interviewTimeJa.trim();
      if (updateData.otherInfo) updateData.otherInfo = updateData.otherInfo.trim();
      if (updateData.otherInfoJa) updateData.otherInfoJa = updateData.otherInfoJa.trim();
      if (updateData.assignedTo) updateData.assignedTo = updateData.assignedTo.trim();
      
      // Handle slug - use provided slug or generate from title
      if (bodyData.slug && bodyData.slug.trim() !== '') {
        // Use provided slug, ensure uniqueness
        let uniqueSlug = bodyData.slug.toLowerCase().trim();
        let counter = 2;
        while (await Job.findOne({ slug: uniqueSlug, _id: { $ne: jobId } })) {
          uniqueSlug = `${bodyData.slug.toLowerCase().trim()}-${counter}`;
          counter += 1;
        }
        updateData.slug = uniqueSlug;
      } else if (updateData.title) {
        // Generate slug from title if not provided
        let normalized = updateData.title
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'D');
        
        let baseSlug = normalized
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '')
          .trim();
        
        if (!baseSlug || baseSlug.length === 0) {
          baseSlug = `job-${Date.now()}`;
        }
        
        let uniqueSlug = baseSlug;
        let counter = 2;
        while (await Job.findOne({ slug: uniqueSlug, _id: { $ne: jobId } })) {
          uniqueSlug = `${baseSlug}-${counter}`;
          counter += 1;
        }
        updateData.slug = uniqueSlug;
      }
      
      // Handle slugJa - use provided slugJa or generate from titleJa
      if (bodyData.slugJa && bodyData.slugJa.trim() !== '') {
        // Use provided slugJa, ensure uniqueness
        let uniqueSlugJa = bodyData.slugJa.trim();
        let counter = 2;
        while (await Job.findOne({ slugJa: uniqueSlugJa, _id: { $ne: jobId } })) {
          uniqueSlugJa = `${bodyData.slugJa.trim()}-${counter}`;
          counter += 1;
        }
        updateData.slugJa = uniqueSlugJa;
      } else if (bodyData.titleJa && bodyData.titleJa.trim() !== '') {
        // Generate slugJa from titleJa if not provided using romaji conversion
        const { generateSlugJaFromTitleJa } = require('../utils/japaneseToRomaji');
        let baseSlugJa = await generateSlugJaFromTitleJa(bodyData.titleJa, 'job');
        
        // Ensure uniqueness
        let uniqueSlugJa = baseSlugJa;
        let counter = 2;
        while (await Job.findOne({ slugJa: uniqueSlugJa, _id: { $ne: jobId } })) {
          uniqueSlugJa = `${baseSlugJa}-${counter}`;
          counter += 1;
        }
        updateData.slugJa = uniqueSlugJa;
      }
      
      // Remove useCategoryImage from updateData (not a field in model)
      delete updateData.useCategoryImage;
      
      // Handle SEO fields - update các field được gửi lên (kể cả empty string để xóa)
      if (bodyData.seo) {
        // Khởi tạo seo nếu chưa có
        if (!existingJob.seo) {
          existingJob.seo = {};
        }
        
        // Update từng field nếu có trong request (kể cả empty string)
        if (bodyData.seo.metaTitle !== undefined) {
          existingJob.seo.metaTitle = bodyData.seo.metaTitle || '';
        }
        if (bodyData.seo.metaDescription !== undefined) {
          existingJob.seo.metaDescription = bodyData.seo.metaDescription || '';
        }
        if (bodyData.seo.metaKeywords !== undefined) {
          if (Array.isArray(bodyData.seo.metaKeywords)) {
            existingJob.seo.metaKeywords = bodyData.seo.metaKeywords;
          } else if (typeof bodyData.seo.metaKeywords === 'string') {
            existingJob.seo.metaKeywords = bodyData.seo.metaKeywords.split(',').map(k => k.trim()).filter(k => k);
          } else {
            existingJob.seo.metaKeywords = [];
          }
        }
        if (bodyData.seo.ogImage !== undefined) {
          existingJob.seo.ogImage = bodyData.seo.ogImage || '';
        }
        
        // Đánh dấu seo đã được modify để Mongoose lưu
        existingJob.markModified('seo');
        updateData.seo = existingJob.seo;
      }
      
      const job = await Job.findByIdAndUpdate(
        jobId,
        updateData,
        { new: true, runValidators: true }
      );
      
      res.status(200).json({
        success: true,
        message: 'Job updated successfully',
        data: job
      });
    } catch (error) {
      console.error('Error in updateJob:', error);
      // Delete uploaded file if error
      if (req.file) {
        const filePath = path.join(__dirname, '..', req.file.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      res.status(500).json({
        success: false,
        message: 'Error updating job',
        error: error.message
      });
    }
  }

  async deleteJob(req, res) {
    try {
      const { jobId } = req.params;
      
      const job = await Job.findByIdAndDelete(jobId);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      // Also delete related applications
      await JobApplication.deleteMany({ jobId });
      
      res.status(200).json({
        success: true,
        message: 'Job and related applications deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting job',
        error: error.message
      });
    }
  }

  async toggleJobStatus(req, res) {
    try {
      const { jobId } = req.params;
      
      const job = await Job.findById(jobId);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      job.isActive = !job.isActive;
      await job.save();
      
      res.status(200).json({
        success: true,
        message: `Job ${job.isActive ? 'activated' : 'deactivated'} successfully`,
        data: job
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error toggling job status',
        error: error.message
      });
    }
  }

  async toggleFeaturedStatus(req, res) {
    try {
      const { jobId } = req.params;
      
      const job = await Job.findById(jobId);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      job.isFeatured = !job.isFeatured;
      await job.save();
      
      res.status(200).json({
        success: true,
        message: `Job ${job.isFeatured ? 'featured' : 'unfeatured'} successfully`,
        data: job
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error toggling featured status',
        error: error.message
      });
    }
  }

  async reorderJobs(req, res) {
    try {
      const { jobIds } = req.body;
      
      if (!jobIds || !Array.isArray(jobIds)) {
        return res.status(400).json({
          success: false,
          message: 'Job IDs array is required'
        });
      }
      
      // Update order for each job
      const updatePromises = jobIds.map((jobId, index) => 
        Job.findByIdAndUpdate(jobId, { order: index + 1 })
      );
      
      await Promise.all(updatePromises);
      
      const jobs = await Job.getActiveJobs();
      
      res.status(200).json({
        success: true,
        message: 'Jobs reordered successfully',
        data: jobs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error reordering jobs',
        error: error.message
      });
    }
  }

  // ==================== JOB APPLICATIONS ====================
  
  async submitApplication(req, res) {
    try {
      const { jobId } = req.params;
      const { fullName, email, phone, address } = req.body;
      
      if (!fullName || !email || !phone) {
        return res.status(400).json({
          success: false,
          message: 'Full name, email, and phone are required'
        });
      }
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'CV file is required'
        });
      }
      
      // Get job details
      const job = await Job.findById(jobId);
      
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      const applicationData = {
        jobId,
        jobTitle: job.title,
        jobLocation: job.location,
        personalInfo: {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          address: address ? address.trim() : ''
        },
        cvFile: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: req.file.path,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      };
      
      const application = new JobApplication(applicationData);
      await application.save();
      
      // Update job application count
      job.applicationCount += 1;
      await job.save();
      
      // Trả về response ngay sau khi lưu DB
      res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        data: {
          applicationId: application._id,
          jobTitle: job.title,
          submittedAt: application.createdAt
        }
      });

      // Gửi email thông báo HR và xác nhận cho ứng viên ở background (không block response)
      (async () => {
        try {
          const { sendHRNotificationEmail, sendCandidateConfirmationEmail } = require('../utils/emailHelper');
          // Gửi email cho HR
          await sendHRNotificationEmail(application, job);
          // Gửi email xác nhận cho ứng viên
          await sendCandidateConfirmationEmail(application, job);
        } catch (err) {
          console.error('Send email error (background):', err);
        }
      })();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error submitting application',
        error: error.message
      });
    }
  }

  // Submit CV without specific job (general CV submission)
  async submitGeneralCV(req, res) {
    try {
      const { fullName, email, phone, address } = req.body;
      
      if (!fullName || !email || !phone) {
        return res.status(400).json({
          success: false,
          message: 'Full name, email, and phone are required'
        });
      }
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'CV file is required'
        });
      }
      
      const applicationData = {
        jobId: null, // No specific job
        jobTitle: 'CV Chung / General CV',
        jobLocation: 'N/A',
        personalInfo: {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          address: address ? address.trim() : ''
        },
        cvFile: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: req.file.path,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      };
      
      const application = new JobApplication(applicationData);
      await application.save();
      
      // Trả về response ngay sau khi lưu DB
      res.status(201).json({
        success: true,
        message: 'CV submitted successfully',
        data: {
          applicationId: application._id,
          submittedAt: application.createdAt
        }
      });

      // Gửi email thông báo HR và xác nhận cho ứng viên ở background
      (async () => {
        try {
          const { sendHRNotificationEmail, sendCandidateConfirmationEmail } = require('../utils/emailHelper');
          // Gửi email cho HR
          await sendHRNotificationEmail(application, null);
          // Gửi email xác nhận cho ứng viên
          await sendCandidateConfirmationEmail(application, null);
        } catch (err) {
          console.error('Send email error (background):', err);
        }
      })();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error submitting CV',
        error: error.message
      });
    }
  }

  async getAllApplications(req, res) {
    try {
      const { page = 1, limit = 20, status, jobId } = req.query;
      
      let filter = {};
      if (status) filter.status = status;
      if (jobId) filter.jobId = jobId;
      
      const applicationsData = await JobApplication.getApplicationsWithPagination(
        parseInt(page), 
        parseInt(limit), 
        filter
      );
      
      res.status(200).json({
        success: true,
        data: applicationsData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching applications',
        error: error.message
      });
    }
  }

  async getApplicationById(req, res) {
    try {
      const { applicationId } = req.params;
      
      const application = await JobApplication.findById(applicationId).populate('jobId', 'title location type');
      
      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: application
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching application',
        error: error.message
      });
    }
  }

  async getApplicationsByJob(req, res) {
    try {
      const { jobId } = req.params;
      
      const applications = await JobApplication.getApplicationsByJob(jobId);
      
      res.status(200).json({
        success: true,
        data: applications
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching job applications',
        error: error.message
      });
    }
  }

  async updateApplicationStatus(req, res) {
    try {
      const { applicationId } = req.params;
      const { status, reviewedBy, notes } = req.body;
      
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }
      
      const application = await JobApplication.findById(applicationId);
      
      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }
      
      await application.updateStatus(status, reviewedBy, notes);
      
      res.status(200).json({
        success: true,
        message: 'Application status updated successfully',
        data: application
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating application status',
        error: error.message
      });
    }
  }

  async deleteApplication(req, res) {
    try {
      const { applicationId } = req.params;
      
      const application = await JobApplication.findByIdAndDelete(applicationId);
      
      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }
      
      // Update job application count
      const job = await Job.findById(application.jobId);
      if (job && job.applicationCount > 0) {
        job.applicationCount -= 1;
        await job.save();
      }
      
      res.status(200).json({
        success: true,
        message: 'Application deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting application',
        error: error.message
      });
    }
  }

  // ==================== FEATURED JOBS ====================
  
  async getFeaturedJobs(req, res) {
    try {
      const jobs = await Job.getFeaturedJobs();
      
      res.status(200).json({
        success: true,
        data: jobs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching featured jobs',
        error: error.message
      });
    }
  }

  // ==================== SEARCH ====================
  
  async searchJobs(req, res) {
    try {
      const { q, type, location } = req.query;
      
      let filter = { isActive: true };
      
      if (q) {
        filter.$or = [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ];
      }
      
      if (type) {
        filter.type = type;
      }
      
      if (location) {
        filter.location = { $regex: location, $options: 'i' };
      }
      
      const jobs = await Job.find(filter).sort({ order: 1, createdAt: -1 });
      
      res.status(200).json({
        success: true,
        data: jobs,
        totalResults: jobs.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error searching jobs',
        error: error.message
      });
    }
  }

  // ==================== STATISTICS ====================
  
  async getCareersStats(req, res) {
    try {
      const [totalJobs, activeJobs, featuredJobs, totalApplications, pendingApplications] = await Promise.all([
        Job.countDocuments(),
        Job.countDocuments({ isActive: true }),
        Job.countDocuments({ isFeatured: true, isActive: true }),
        JobApplication.countDocuments(),
        JobApplication.countDocuments({ status: 'pending' })
      ]);
      
      // Get applications by status
      const applicationsByStatus = await JobApplication.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
      
      // Get jobs with application counts
      const jobsWithStats = await Job.aggregate([
        { $match: { isActive: true } },
        {
          $project: {
            title: 1,
            location: 1,
            type: 1,
            applicationCount: 1,
            isFeatured: 1,
            createdAt: 1
          }
        },
        { $sort: { applicationCount: -1 } },
        { $limit: 10 }
      ]);
      
      const stats = {
        totalJobs,
        activeJobs,
        featuredJobs,
        inactiveJobs: totalJobs - activeJobs,
        totalApplications,
        pendingApplications,
        applicationsByStatus,
        topJobsByApplications: jobsWithStats,
        lastUpdated: new Date()
      };
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching careers statistics',
        error: error.message
      });
    }
  }

  // ==================== BULK OPERATIONS ====================
  
  async bulkUpdateApplications(req, res) {
    try {
      const { applicationIds, status, reviewedBy, notes } = req.body;
      
      if (!applicationIds || !Array.isArray(applicationIds) || !status) {
        return res.status(400).json({
          success: false,
          message: 'Application IDs array and status are required'
        });
      }
      
      const updateData = {
        status,
        reviewedAt: new Date()
      };
      
      if (reviewedBy) updateData.reviewedBy = reviewedBy;
      if (notes) updateData.notes = notes;
      
      const result = await JobApplication.updateMany(
        { _id: { $in: applicationIds } },
        updateData
      );
      
      res.status(200).json({
        success: true,
        message: `${result.modifiedCount} applications updated successfully`,
        data: { modifiedCount: result.modifiedCount }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error bulk updating applications',
        error: error.message
      });
    }
  }

  async exportApplications(req, res) {
    try {
      const { jobId, status, startDate, endDate } = req.query;
      
      let filter = {};
      if (jobId) filter.jobId = jobId;
      if (status) filter.status = status;
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }
      
      const applications = await JobApplication.find(filter)
        .populate('jobId', 'title location type')
        .sort({ createdAt: -1 });
      
      // Transform for export
      const exportData = applications.map(app => ({
        applicationId: app._id,
        jobTitle: app.jobTitle,
        jobLocation: app.jobLocation,
        applicantName: app.personalInfo.fullName,
        applicantEmail: app.personalInfo.email,
        applicantPhone: app.personalInfo.phone,
        status: app.status,
        appliedDate: app.createdAt,
        reviewedBy: app.reviewedBy || '',
        reviewedDate: app.reviewedAt || '',
        notes: app.notes || ''
      }));
      
      res.status(200).json({
        success: true,
        data: exportData,
        totalRecords: exportData.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error exporting applications',
        error: error.message
      });
    }
  }
}

module.exports = {
  CareersController: new CareersController(),
  upload,
  uploadJobImage
};