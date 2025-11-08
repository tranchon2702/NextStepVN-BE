// controllers/contactController.js - FINAL FIXED VERSION
const { ContactInfo, ContactSubmission } = require('../models');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

// Helper functions
const detectSpam = (message, email, name) => {
  const spamKeywords = ['casino', 'lottery', 'viagra', 'cialis', 'loan', 'debt', 'crypto'];
  const messageWords = message.toLowerCase();
  
  // Debug logging
  console.log('🔍 Spam detection for:', { name, email, message: message.substring(0, 50) + '...' });
  
  if (spamKeywords.some(keyword => messageWords.includes(keyword))) {
    console.log('❌ Spam detected: contains keyword');
    return true;
  }
  
  if (message.length < 10 || message.split(' ').length < 3) {
    console.log('❌ Spam detected: message too short', { length: message.length, wordCount: message.split(' ').length });
    return true;
  }
  
  if (email.includes('temp') || email.includes('fake')) {
    console.log('❌ Spam detected: suspicious email');
    return true;
  }
  
  console.log('✅ Not spam');
  return false;
};

const determinePriority = (subject, message) => {
  const urgentKeywords = ['urgent', 'asap', 'emergency', 'immediately'];
  const highKeywords = ['important', 'priority', 'deadline'];
  
  const content = (subject + ' ' + message).toLowerCase();
  
  if (urgentKeywords.some(keyword => content.includes(keyword))) {
    return 'urgent';
  }
  
  if (highKeywords.some(keyword => content.includes(keyword))) {
    return 'high';
  }
  
  return 'medium';
};

// Helper function for stats (moved outside class)
const getSubmissionStats = async (includeSpam = false) => {
  try {
    const matchFilter = includeSpam ? {} : { isSpam: false };
    
    const [statusStats, priorityStats] = await Promise.all([
      ContactSubmission.aggregate([
        { $match: matchFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      ContactSubmission.aggregate([
        { $match: matchFilter },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ])
    ]);
    
    return {
      byStatus: statusStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      byPriority: priorityStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Error getting submission stats:', error);
    return { byStatus: {}, byPriority: {} };
  }
};

// Hàm gửi email tự động khi có contact submission
// Sử dụng function từ emailHelper thay vì duplicate code
async function sendContactEmails(submission, contactInfo) {
  const { sendContactEmails: sendEmails } = require('../utils/emailHelper');
  await sendEmails(submission);
}

class ContactController {
  
  // ==================== CONTACT INFO ====================
  
  async getContactInfo(req, res) {
    try {
      let contactInfo = await ContactInfo.findOne({ isActive: true });
      
      if (!contactInfo) {
        // Tạo contact info mới nếu chưa có
        contactInfo = new ContactInfo({
          bannerImage: "/uploads/images/contact-page/banner_contact.png",
          address1: "47 Đường số 17, Khu phố 3, P. Hiệp Bình Phước, TP. Thủ Đức, TP. HCM, Việt Nam",
          address2: "N2-D2 St, Nhon Trach Textile and Garment Industrial Park, Nhon Trach, Dong Nai Province, Vietnam",
          email: "hr@saigon3jean.com.vn",
          phone: "+84 28 3940 1234",
          workingHours: "Monday - Friday: 8:00 AM - 5:00 PM",
          mapEmbedUrl: "",
          socialLinks: {
            facebook: "https://facebook.com/saigon3jeans",
            instagram: "https://instagram.com/saigon3jeans",
            youtube: "https://youtube.com/@saigon3jeans"
          },
          isActive: true
        });
        await contactInfo.save();
        console.log('Created new ContactInfo record with default social links');
      }
      
      res.status(200).json({
        success: true,
        data: contactInfo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching contact info',
        error: error.message
      });
    }
  }

  // Thêm endpoint mới cho API /api/contact/data
  async getContactData(req, res) {
    try {
      let contactInfo = await ContactInfo.findOne({ isActive: true });
      
      if (!contactInfo) {
        return res.status(404).json({
          success: false,
          message: 'Contact info not found'
        });
      }
      
      res.status(200).json({
        success: true,
        contactInfo: contactInfo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching contact data',
        error: error.message
      });
    }
  }

  async updateContactInfo(req, res) {
    try {
      const { address1, address1Ja, address2, address2Ja, email, phone, workingHours, mapEmbedUrl, socialLinks, zaloId, messengerId, phoneForWidget } = req.body;
      const bannerImage = req.file ? `/uploads/images/${req.file.filename}` : undefined;
      
      console.log('Updating contact info with:', { address1, address2, email, phone, workingHours, mapEmbedUrl, socialLinks });
      console.log('Request body:', req.body);
      console.log('Request files:', req.files);
      
      let contactInfo = await ContactInfo.findOne({ isActive: true });
      
      if (!contactInfo) {
        // Tạo contact info mới nếu chưa có
        contactInfo = new ContactInfo({
          bannerImage: "/uploads/images/contact-page/banner_contact.png",
          address1: "47 Đường số 17, Khu phố 3, P. Hiệp Bình Phước, TP. Thủ Đức, TP. HCM, Việt Nam",
          address2: "N2-D2 St, Nhon Trach Textile and Garment Industrial Park, Nhon Trach, Dong Nai Province, Vietnam",
          email: "hr@saigon3jean.com.vn",
          phone: "+84 28 3940 1234",
          workingHours: "Monday - Friday: 8:00 AM - 5:00 PM",
          mapEmbedUrl: "",
          socialLinks: {
            facebook: "",
            instagram: "",
            youtube: ""
          },
          isActive: true
        });
        console.log('Created new ContactInfo record');
      }
      
      if (address1 !== undefined) contactInfo.address1 = address1;
      if (address1Ja !== undefined) contactInfo.address1Ja = address1Ja;
      if (address2 !== undefined) contactInfo.address2 = address2;
      if (address2Ja !== undefined) contactInfo.address2Ja = address2Ja;
      if (email) contactInfo.email = email;
      if (phone !== undefined) contactInfo.phone = phone;
      if (workingHours) contactInfo.workingHours = workingHours;
      if (mapEmbedUrl !== undefined) contactInfo.mapEmbedUrl = mapEmbedUrl;
      if (bannerImage) contactInfo.bannerImage = bannerImage;
      
      if (socialLinks) {
        const parsedSocialLinks = typeof socialLinks === 'string' 
          ? JSON.parse(socialLinks) 
          : socialLinks;
        contactInfo.socialLinks = { ...contactInfo.socialLinks, ...parsedSocialLinks };
      }
      // Xử lý các trường widget - cho phép set về empty string để xóa
      if (zaloId !== undefined) contactInfo.zaloId = zaloId || "";
      if (messengerId !== undefined) contactInfo.messengerId = messengerId || "";
      if (phoneForWidget !== undefined) contactInfo.phoneForWidget = phoneForWidget || "";
      
      await contactInfo.save();
      
      res.status(200).json({
        success: true,
        message: 'Contact info updated successfully',
        data: contactInfo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating contact info',
        error: error.message
      });
    }
  }

  // ==================== CONTACT SUBMISSIONS ====================
  
  async createSubmission(req, res) {
    try {
      const { name, company, email, phone, subject, message } = req.body;
      if (!name || !company || !email || !phone || !subject || !message) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required'
        });
      }
      const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
      const userAgent = req.get('User-Agent') || '';
      const isSpam = detectSpam(message, email, name);
      const priority = determinePriority(subject, message);
      const submission = new ContactSubmission({
        name: name.trim(),
        company: company.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
        ipAddress,
        userAgent,
        isSpam,
        priority
      });
      await submission.save();
      // Trả về response ngay sau khi lưu DB
      res.status(201).json({
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon!',
        data: {
          id: submission._id,
          submittedAt: submission.createdAt
        }
      });
      // Gửi email ở background (không block response)
      (async () => {
        try {
          const contactInfo = await ContactInfo.findOne({ isActive: true });
          await sendContactEmails(submission, contactInfo);
        } catch (err) {
          console.error('Send contact email error (background):', err);
        }
      })();
    } catch (error) {
      console.error('Contact form submission error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send message. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getSubmissions(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        status, 
        priority, 
        search, 
        startDate, 
        endDate,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        includeSpam = false
      } = req.query;
      
      const skip = (page - 1) * limit;
      
      // Build filter
      const filter = {};
      
      // Chỉ lọc spam nếu không yêu cầu include spam
      if (includeSpam !== 'true') {
        filter.isSpam = false;
      }
      
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }
      
      // Build sort
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
      
      const [submissions, total, stats] = await Promise.all([
        ContactSubmission.find(filter)
          .sort(sort)
          .limit(limit * 1)
          .skip(skip)
          .select('-userAgent -ipAddress'),
        ContactSubmission.countDocuments(filter),
        getSubmissionStats(includeSpam === 'true') // Pass includeSpam parameter
      ]);
      
      res.status(200).json({
        success: true,
        data: {
          submissions,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: parseInt(limit)
          },
          stats
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching submissions',
        error: error.message
      });
    }
  }

  async getSubmissionById(req, res) {
    try {
      const { id } = req.params;
      
      const submission = await ContactSubmission.findById(id);
      
      if (!submission) {
        return res.status(404).json({
          success: false,
          message: 'Submission not found'
        });
      }
      
      if (submission.status === 'new') {
        submission.status = 'read';
        await submission.save();
      }
      
      res.status(200).json({
        success: true,
        data: submission
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching submission',
        error: error.message
      });
    }
  }

  async updateSubmission(req, res) {
    try {
      const { id } = req.params;
      const { status, priority, tags, note, assignedTo } = req.body;
      
      const submission = await ContactSubmission.findById(id);
      
      if (!submission) {
        return res.status(404).json({
          success: false,
          message: 'Submission not found'
        });
      }
      
      if (status) {
        submission.status = status;
        if (status === 'replied') {
          submission.repliedAt = new Date();
        }
      }
      if (priority) submission.priority = priority;
      if (tags) submission.tags = Array.isArray(tags) ? tags : [tags];
      if (assignedTo !== undefined) submission.assignedTo = assignedTo;
      
      if (note) {
        submission.notes.push({
          note: note.trim(),
          createdBy: req.user?.name || 'admin',
          createdAt: new Date()
        });
      }
      
      await submission.save();
      
      res.status(200).json({
        success: true,
        message: 'Submission updated successfully',
        data: submission
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating submission',
        error: error.message
      });
    }
  }

  async deleteSubmission(req, res) {
    try {
      const { id } = req.params;
      const { permanent = false } = req.query;
      
      if (permanent === 'true') {
        const submission = await ContactSubmission.findByIdAndDelete(id);
        if (!submission) {
          return res.status(404).json({
            success: false,
            message: 'Submission not found'
          });
        }
      } else {
        const submission = await ContactSubmission.findByIdAndUpdate(
          id, 
          { isSpam: true }, 
          { new: true }
        );
        if (!submission) {
          return res.status(404).json({
            success: false,
            message: 'Submission not found'
          });
        }
      }
      
      res.status(200).json({
        success: true,
        message: permanent === 'true' ? 'Submission deleted permanently' : 'Submission marked as spam'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting submission',
        error: error.message
      });
    }
  }

  async bulkUpdateSubmissions(req, res) {
    try {
      const { ids, action, value } = req.body;
      
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or empty IDs array'
        });
      }
      
      let updateQuery = {};
      
      switch (action) {
        case 'status':
          updateQuery.status = value;
          if (value === 'replied') {
            updateQuery.repliedAt = new Date();
          }
          break;
        case 'priority':
          updateQuery.priority = value;
          break;
        case 'assignTo':
          updateQuery.assignedTo = value;
          break;
        case 'markSpam':
          updateQuery.isSpam = true;
          break;
        case 'delete':
          await ContactSubmission.deleteMany({ _id: { $in: ids } });
          return res.status(200).json({
            success: true,
            message: `${ids.length} submissions deleted successfully`
          });
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid action'
          });
      }
      
      const result = await ContactSubmission.updateMany(
        { _id: { $in: ids } },
        updateQuery
      );
      
      res.status(200).json({
        success: true,
        message: `${result.modifiedCount} submissions updated successfully`,
        data: { modifiedCount: result.modifiedCount }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error performing bulk update',
        error: error.message
      });
    }
  }

  async exportSubmissions(req, res) {
    try {
      const { format = 'csv', ...filters } = req.query;
      
      const filter = { isSpam: false };
      if (filters.status) filter.status = filters.status;
      if (filters.priority) filter.priority = filters.priority;
      if (filters.startDate || filters.endDate) {
        filter.createdAt = {};
        if (filters.startDate) filter.createdAt.$gte = new Date(filters.startDate);
        if (filters.endDate) filter.createdAt.$lte = new Date(filters.endDate);
      }
      
      const submissions = await ContactSubmission.find(filter)
        .sort({ createdAt: -1 })
        .select('-userAgent -ipAddress -notes');
      
      if (format === 'csv') {
        const csvHeaders = 'Name,Company,Email,Phone,Subject,Status,Priority,Created At,Replied At\n';
        const csvData = submissions.map(sub => [
          `"${sub.name}"`,
          `"${sub.company}"`,
          `"${sub.email}"`,
          `"${sub.phone}"`,
          `"${sub.subject}"`,
          sub.status,
          sub.priority,
          sub.createdAt.toISOString(),
          sub.repliedAt ? sub.repliedAt.toISOString() : ''
        ].join(',')).join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=contact-submissions-${Date.now()}.csv`);
        res.send(csvHeaders + csvData);
      } else {
        res.status(200).json({
          success: true,
          data: submissions,
          exportedAt: new Date(),
          totalItems: submissions.length
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error exporting submissions',
        error: error.message
      });
    }
  }
}

module.exports = {
  ContactController: new ContactController(),
  upload
};