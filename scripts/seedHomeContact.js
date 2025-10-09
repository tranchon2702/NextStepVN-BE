const mongoose = require('mongoose');
require('dotenv').config();

// Import the HomeContact model
const { HomeContact } = require('../models');

async function seedHomeContact() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if HomeContact data already exists
    const existingContact = await HomeContact.findOne({ isActive: true });
    
    if (existingContact) {
      console.log('HomeContact data already exists:', existingContact);
      console.log('Updating existing HomeContact data...');
      
      // Update the existing data
      existingContact.contact = {
        title: 'CONTACT',
        description: 'Seeking us and you\'ll get someone who can deliver consistent, high-quality products while minimizing their ecological footprint',
        buttonText: 'CONTACT US',
        buttonLink: '/contact'
      };
      
      existingContact.workWithUs = {
        title: 'WORK WITH US',
        description: 'We are looking for intelligent, passionate individuals who are ready to join us in building and growing the company',
        buttonText: 'LEARN MORE',
        buttonLink: '/recruitment'
      };
      
      await existingContact.save();
      console.log('HomeContact data updated successfully');
    } else {
      console.log('Creating new HomeContact data...');
      
      // Create new HomeContact data
      const newHomeContact = new HomeContact({
        contact: {
          title: 'CONTACT',
          description: 'Seeking us and you\'ll get someone who can deliver consistent, high-quality products while minimizing their ecological footprint',
          buttonText: 'CONTACT US',
          buttonLink: '/contact'
        },
        workWithUs: {
          title: 'WORK WITH US',
          description: 'We are looking for intelligent, passionate individuals who are ready to join us in building and growing the company',
          buttonText: 'LEARN MORE',
          buttonLink: '/recruitment'
        },
        isActive: true
      });
      
      await newHomeContact.save();
      console.log('HomeContact data created successfully');
    }
    
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error seeding HomeContact data:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seed function
seedHomeContact();