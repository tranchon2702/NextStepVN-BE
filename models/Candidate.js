const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
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
  major: {
    type: String,
    required: true,
    enum: ['CƠ KHÍ', 'Ô TÔ', 'ĐIỆN, ĐIỆN TỬ', 'IT', 'XÂY DỰNG']
  },
  jlpt: {
    type: String,
    required: true,
    enum: ['N5', 'N4', 'N3', 'N2', 'N1']
  },
  maritalStatus: {
    type: String,
    required: true,
    enum: ['ĐỘC THÂN', 'ĐÃ KẾT HÔN']
  },
  cvUrl: {
    type: String,
    default: null
  },
  cvFileName: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    trim: true
  },
  skills: {
    type: [String],
    default: []
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'HIRED'],
    default: 'ACTIVE'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for searching
candidateSchema.index({ name: 'text', email: 'text' });
candidateSchema.index({ major: 1 });
candidateSchema.index({ jlpt: 1 });
candidateSchema.index({ maritalStatus: 1 });
candidateSchema.index({ status: 1 });

module.exports = mongoose.model('Candidate', candidateSchema);

