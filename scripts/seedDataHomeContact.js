const mongoose = require('mongoose');
const { HomeContact } = require('../models');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for HomeContact seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

async function seedHomeContact() {
  try {
    // Check if HomeContact data already exists
    const existingHomeContact = await HomeContact.findOne({ isActive: true });
    
    if (existingHomeContact) {
      console.log('HomeContact data already exists. Skipping seeding.');
      return;
    }
    
    // Create default HomeContact data
    const homeContactData = {
      contact: {
        title: "CONTACT",
        description: "Seeking us and you'll get someone who can deliver consistent, high-quality products while minimizing their ecological footprint",
        buttonText: "CONTACT US",
        buttonLink: "/contact"
      },
      workWithUs: {
        title: "WORK WITH US",
        description: "We are looking for intelligent, passionate individuals who are ready to join us in building and growing the company",
        buttonText: "LEARN MORE",
        buttonLink: "/recruitment"
      },

      isActive: true
    };
    
    const homeContact = new HomeContact(homeContactData);
    await homeContact.save();
    
    console.log('HomeContact data seeded successfully');
  } catch (error) {
    console.error('Error seeding HomeContact data:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seed function
seedHomeContact();