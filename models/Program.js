const mongoose = require('mongoose');

const ProgramSectionSchema = new mongoose.Schema({
  heading: { type: String, required: false, default: '' },
  content: { type: String, required: false, default: '' },
  image: { type: String, required: false, default: '' },
  order: { type: Number, required: false, default: 0 }
}, { _id: true });

const ProgramFaqSchema = new mongoose.Schema({
  question: { type: String, default: '' },
  answer: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { _id: true });

const ProgramSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  content: { type: String, default: '' },
  sections: [ProgramSectionSchema],
  faq: [ProgramFaqSchema],
  attachments: [{
    label: { type: String, default: '' },
    url: { type: String, default: '' }
  }],
  seoMeta: {
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    keywords: { type: [String], default: [] }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true, collection: 'programs' });

module.exports = mongoose.model('Program', ProgramSchema);


