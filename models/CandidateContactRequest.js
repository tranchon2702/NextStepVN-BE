const mongoose = require('mongoose');

const candidateContactRequestSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  candidateName: {
    type: String,
    required: true
  },
  requesterName: {
    type: String,
    required: true,
    trim: true
  },
  requesterEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  requesterPhone: {
    type: String,
    trim: true
  },
  companyName: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['NEW', 'CONTACTED', 'COMPLETED', 'CANCELLED'],
    default: 'NEW'
  },
  notes: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
candidateContactRequestSchema.index({ candidateId: 1, createdAt: -1 });
candidateContactRequestSchema.index({ requesterEmail: 1 });
candidateContactRequestSchema.index({ status: 1 });

module.exports = mongoose.model('CandidateContactRequest', candidateContactRequestSchema);

