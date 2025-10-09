const { CompanyInfo, Job, ContactHR, JobApplication } = require('../models/Careers');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');

// Configure multer for CV uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/cvs/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cv-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
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
      const { includeInactive = 'false', page = 1, limit = 50 } = req.query;
      
      let jobs;
      if (includeInactive === 'true') {
        // For admin, return all jobs without pagination
        jobs = await Job.find({}).sort({ order: 1, createdAt: -1 });
      } else {
        // For frontend, return only active jobs
        jobs = await Job.getActiveJobs();
      }
      
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
      console.log('Creating new job - Request body:', req.body);
      const { title, location, type, description, requirements, benefits, isFeatured, order } = req.body;
      
      if (!title || !location || !description) {
        console.log('Validation failed: Missing required fields');
        return res.status(400).json({
          success: false,
          message: 'Title, location, and description are required'
        });
      }
      
      // Generate slug from title
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      
      const jobData = {
        title: title.trim(),
        location: location.trim(),
        type: type || 'Full-time',
        description: description.trim(),
        requirements: Array.isArray(requirements) ? requirements : [],
        benefits: Array.isArray(benefits) ? benefits : [],
        isFeatured: isFeatured || false,
        order: order || 0,
        slug: slug // Add slug to jobData
      };
      
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
      
      const job = await Job.findBySlug(slug);
      
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
      const { jobId } = req.params;
      const updateData = { ...req.body };
      
      // Clean up data
      if (updateData.title) updateData.title = updateData.title.trim();
      if (updateData.location) updateData.location = updateData.location.trim();
      if (updateData.description) updateData.description = updateData.description.trim();
      
      const job = await Job.findByIdAndUpdate(
        jobId,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Job updated successfully',
        data: job
      });
    } catch (error) {
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

      // Gửi email thông báo HR ở background (không block response)
      (async () => {
        try {
          const { sendHRNotificationEmail } = require('../utils/emailHelper');
          await sendHRNotificationEmail(application, job);
        } catch (err) {
          console.error('Send HR notification email error (background):', err);
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
  upload
};