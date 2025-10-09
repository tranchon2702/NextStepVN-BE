const mongoose = require('mongoose');


// Define a schema for the contact section
const contactSchema = {
  title: {
    type: String,
    default: 'CONTACT'
  },
  description: {
    type: String,
    default: 'Seeking us and you\'ll get someone who can deliver consistent, high-quality products while minimizing their ecological footprint'
  },
  buttonText: {
    type: String,
    default: 'CONTACT US'
  },
  buttonLink: {
    type: String,
    default: '/contact'
  }
};

// Define a schema for the work with us section
const workWithUsSchema = {
  title: {
    type: String,
    default: 'WORK WITH US'
  },
  description: {
    type: String,
    default: 'We are looking for intelligent, passionate individuals who are ready to join us in building and growing the company'
  },
  buttonText: {
    type: String,
    default: 'LEARN MORE'
  },
  buttonLink: {
    type: String,
    default: '/recruitment'
  }
};

// Main schema for the HomeContact model
const homeContactSchema = new mongoose.Schema({
  contact: contactSchema,
  workWithUs: workWithUsSchema,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create and export the model
module.exports = mongoose.model('HomeContact', homeContactSchema);