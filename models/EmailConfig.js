const mongoose = require('mongoose');

const emailConfigSchema = new mongoose.Schema({
  // SMTP Settings
  smtpHost: {
    type: String,
    default: 'smtp.gmail.com'
  },
  smtpPort: {
    type: Number,
    default: 465
  },
  smtpUser: {
    type: String,
    required: true
  },
  smtpPass: {
    type: String,
    required: true
  },
  
  // Email Recipients
  cskhEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid CSKH email']
  },
  hrEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid HR email']
  },
  
  // Email From Settings
  companyName: {
    type: String,
    default: 'Saigon 3 Jean'
  },
  
  // Active config (chỉ có 1 config active)
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Metadata
  updatedBy: {
    type: String,
    default: 'admin'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure only one active config
emailConfigSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

module.exports = mongoose.model('EmailConfig', emailConfigSchema);
