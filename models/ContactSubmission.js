const mongoose = require('mongoose');

const contactSubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: [{
    note: { type: String, required: true },
    createdBy: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now }
  }],
  ipAddress: {
    type: String,
    default: ""
  },
  userAgent: {
    type: String,
    default: ""
  },
  source: {
    type: String,
    default: "contact_form"
  },
  isSpam: {
    type: Boolean,
    default: false
  },
  repliedAt: {
    type: Date
  },
  assignedTo: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

// Indexes for better query performance
contactSubmissionSchema.index({ status: 1, createdAt: -1 });
contactSubmissionSchema.index({ email: 1 });
contactSubmissionSchema.index({ company: 1 });
contactSubmissionSchema.index({ priority: 1, status: 1 });

module.exports = mongoose.model('ContactSubmission', contactSubmissionSchema);