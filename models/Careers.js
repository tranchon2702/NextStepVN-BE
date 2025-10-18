const mongoose = require('mongoose');

// Company Info Schema
const CompanyInfoSchema = new mongoose.Schema({
  logo: {
    type: String,
    default: '/uploads/images/sg3jeans_logo.png'
  },
  title: {
    type: String,
    default: 'ABOUT SAIGON 3 JEAN'
  },
  description: [{
    type: String,
    required: true
  }],
  stats: {
    employees: {
      number: { type: String, default: '1000+' },
      label: { type: String, default: 'Employees' }
    },
    experience: {
      number: { type: String, default: '15+' },
      label: { type: String, default: 'Years Experience' }
    },
    partners: {
      number: { type: String, default: '50+' },
      label: { type: String, default: 'Global Partners' }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Job Schema
const JobSchema = new mongoose.Schema({
  // Mã công việc
  jobCode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  // Tên công việc
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  // Nhóm ngành nghề
  category: {
    type: String,
    enum: ['CƠ KHÍ', 'Ô TÔ', 'ĐIỆN, ĐIỆN TỬ', 'IT', 'XÂY DỰNG'],
    required: true
  },
  // Địa điểm làm việc
  location: {
    type: String,
    required: true,
    trim: true
  },
  // Hình thức làm việc
  workType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time'
  },
  // Nội dung công việc
  description: {
    type: String,
    required: true
  },
  // Yêu cầu ứng tuyển
  requirements: [{
    type: String
  }],
  // Quyền lợi
  benefits: [{
    type: String
  }],
  // Lương cơ bản (range)
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: '¥' },
    note: { type: String }
  },
  // Thưởng
  bonus: {
    type: String,
    trim: true
  },
  // Trợ cấp
  allowance: {
    type: String,
    trim: true
  },
  // Phúc lợi khác
  otherBenefits: {
    type: String,
    trim: true
  },
  // Chuyên ngành
  major: {
    type: String,
    trim: true
  },
  // Tuổi
  age: {
    min: { type: Number },
    max: { type: Number }
  },
  // Kinh nghiệm
  experience: {
    type: String,
    trim: true
  },
  // Ngoại ngữ
  language: {
    type: String,
    trim: true
  },
  // Thời gian làm thêm
  overtime: {
    type: String,
    trim: true
  },
  // Thời gian nghỉ
  offTime: {
    type: String,
    trim: true
  },
  // Hình thức phỏng vấn
  interviewFormat: {
    type: String,
    trim: true
  },
  // Thời gian phỏng vấn
  interviewTime: {
    type: String,
    trim: true
  },
  // Thông tin khác
  otherInfo: {
    type: String,
    trim: true
  },
  // Người phụ trách
  assignedTo: {
    type: String,
    trim: true
  },
  // Trạng thái tuyển dụng
  recruitmentStatus: {
    type: String,
    enum: ['Đang tuyển', 'Ngưng tuyển', 'Đã đóng'],
    default: 'Đang tuyển'
  },
  // Hiển thị trên website
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  applicationCount: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Contact HR Schema
const ContactHRSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'CONTACT HR DEPARTMENT'
  },
  description: {
    type: String,
    default: 'Do you have questions about career opportunities at Saigon 3 Jean? Don\'t hesitate to contact us!'
  },
  email: {
    type: String,
    required: true,
    default: 'hr@saigon3jean.com'
  },
  phone: {
    type: String,
    required: true,
    default: '(+84) 28 1234 5678'
  },
  submitResumeText: {
    type: String,
    default: 'Submit Your Resume'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Job Application Schema
const JobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  jobLocation: {
    type: String,
    required: true
  },
  personalInfo: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      trim: true
    }
  },
  cvFile: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'interviewed', 'accepted', 'rejected'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  reviewedBy: {
    type: String,
    trim: true
  },
  reviewedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Pre-save middleware for Job slug generation
JobSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  next();
});

// Virtual for getting time since posting
JobSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const postedDate = this.createdAt;
  const diffTime = Math.abs(now - postedDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) return `Posted ${diffDays} days ago`;
  if (diffDays <= 30) return `Posted ${Math.ceil(diffDays / 7)} weeks ago`;
  return `Posted ${Math.ceil(diffDays / 30)} months ago`;
});

// Static methods for Jobs
JobSchema.statics.getActiveJobs = async function() {
  return this.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
};

JobSchema.statics.getFeaturedJobs = async function() {
  return this.find({ isActive: true, isFeatured: true }).sort({ order: 1 });
};

JobSchema.statics.getJobsWithPagination = async function(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const jobs = await this.find({ isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await this.countDocuments({ isActive: true });
  const totalPages = Math.ceil(total / limit);
  
  return {
    jobs,
    pagination: {
      currentPage: page,
      totalPages,
      totalJobs: total,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      startIndex: skip + 1,
      endIndex: Math.min(skip + limit, total)
    }
  };
};

JobSchema.statics.findBySlug = async function(slug) {
  return this.findOne({ slug, isActive: true });
};

// Instance methods for Job Applications
JobApplicationSchema.methods.updateStatus = async function(status, reviewedBy = null, notes = null) {
  this.status = status;
  this.reviewedBy = reviewedBy;
  this.notes = notes;
  this.reviewedAt = new Date();
  await this.save();
  return this;
};

// Static methods for Job Applications
JobApplicationSchema.statics.getApplicationsByJob = async function(jobId) {
  return this.find({ jobId }).sort({ createdAt: -1 }).populate('jobId', 'title location');
};

JobApplicationSchema.statics.getApplicationsWithPagination = async function(page = 1, limit = 20, filter = {}) {
  const skip = (page - 1) * limit;
  const applications = await this.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('jobId', 'title location');
  
  const total = await this.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);
  
  return {
    applications,
    pagination: {
      currentPage: page,
      totalPages,
      totalApplications: total,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

// Create models
const CompanyInfo = mongoose.model('CompanyInfo', CompanyInfoSchema);
const Job = mongoose.model('Job', JobSchema);
const ContactHR = mongoose.model('ContactHR', ContactHRSchema);
const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);

module.exports = {
  CompanyInfo,
  Job,
  ContactHR,
  JobApplication
};