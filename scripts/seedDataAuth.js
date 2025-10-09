require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('../models');

// Connect to MongoDB without authentication
mongoose.connect('mongodb://localhost:27017/saigon3jean', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  try {
    console.log('Connected to MongoDB, seeding auth data...');
    
    // Check if users collection exists
    const userCount = await User.countDocuments();
    
    // Create default admin if no users exist
    if (userCount === 0) {
      console.log('Creating default admin user...');
      
      const adminUser = new User({
        username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
        password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
        name: 'System Administrator',
        role: 'admin',
        isActive: true
      });
      
      await adminUser.save();
      console.log('Default admin user created.');
    } else {
      console.log('Users already exist, skipping admin creation.');
    }
    
    console.log('Auth data seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding auth data:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
}); 