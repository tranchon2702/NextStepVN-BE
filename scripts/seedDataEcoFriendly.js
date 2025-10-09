const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
dotenv.config();

const EcoFriendly = require('../models/EcoFriendly'); 

// const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saigon3jean';
const MONGO_URI = 'mongodb://localhost:27017/saigon3jean';

// Create eco-friendly directory if it doesn't exist
const ensureDirectoriesExist = () => {
  const dir = path.join(__dirname, '../uploads/images/eco-friendly');
  if (!fs.existsSync(dir)) {
    console.log('Creating eco-friendly directory...');
    fs.mkdirSync(dir, { recursive: true });
  }
};

async function seedEcoFriendly() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔗 Connected to MongoDB');
    
    // Ensure the eco-friendly directory exists
    ensureDirectoriesExist();

    // Check for existing data
    const existingData = await EcoFriendly.findOne();
    if (existingData) {
      console.log('⚠️ Eco-friendly data already exists. Deleting...');
      await EcoFriendly.deleteMany({});
    }
    console.log('🧹 Cleared old eco-friendly data');
    
    // Since the files don't exist yet, we'll use placeholder paths
    // In a real environment, you would copy the actual files to the directory
    
    // Dữ liệu mẫu cho phần features
    const features = [
      {
        title: 'Sustainable Operations',
        points: [
          'Utilizing solar energy for production',
          'Water recycling systems in place',
          'Waste management and reduction',
          'Eco-friendly product materials'
        ],
        order: 1,
        isActive: true
      },
      {
        title: 'Green Technologies',
        points: [
          'Using renewable energy sources',
          'Optimized machinery for energy savings',
          'Energy-efficient lighting',
          'Reduction of carbon footprint'
        ],
        order: 2,
        isActive: true
      },
      {
        title: 'Sustainable Sourcing',
        points: [
          'Ethical sourcing of raw materials',
          'Support local suppliers',
          'Minimize transportation emissions',
          'Zero waste production process'
        ],
        order: 3,
        isActive: true
      }
    ];

    // Dữ liệu mẫu cho phần sections with corrected paths
    const sections = [
      {
        title: 'Solar Energy Systems',
        description: 'We have installed solar panels that contribute to 40% of our energy needs.',
        image: '/uploads/images/home_banner-section3.png', // Use an existing image
        imageAlt: 'Solar Panels',
        stats: [
          { value: '40%', label: 'Energy provided by solar power' },
          { value: '1500kW', label: 'Total solar energy generated annually' }
        ],
        order: 1,
        isActive: true
      },
      {
        title: 'AI Revolution in Manufacturing',
        description: 'AI technology optimizes our production lines, ensuring minimal waste and higher efficiency.',
        image: '/uploads/images/home_banner-section2.jpg', // Use an existing image
        imageAlt: 'AI Technology in Manufacturing',
        stats: [
          { value: '80%', label: 'Production efficiency increased by AI' },
          { value: '95%', label: 'Waste reduction using AI technology' }
        ],
        order: 2,
        isActive: true
      },
      {
        title: 'Biomass Boiler Technology',
        description: 'Our biomass boilers convert waste into energy, providing a sustainable heating solution for our facilities.',
        image: '/uploads/images/certification/certificate.png', // Use an existing image
        imageAlt: 'Biomass Boiler Technology',
        stats: [
          { value: '25%', label: 'Energy sourced from biomass' },
          { value: '300 tons', label: 'Waste used annually for biomass production' }
        ],
        order: 3,
        isActive: true
      }
    ];

    // Dữ liệu mẫu cho phần EcoFriendly with corrected paths
    const ecoFriendlyData = new EcoFriendly({
      hero: {
        image: '/uploads/images/home_banner-section3.png', // Use an existing image
        imageAlt: 'Eco-friendly facilities'
      },
      mainImage: '/uploads/images/home_banner-section2.jpg', // Use an existing image
      mainImageAlt: 'Eco-friendly operations',
      features: features,
      sections: sections,
      pageTitle: 'Eco-Friendly - Saigon 3 Jean',
      pageDescription: 'Our sustainable production practices and eco-friendly technologies',
      seo: {
        metaTitle: 'Eco-Friendly - Saigon 3 Jean',
        metaDescription: 'Discover Saigon 3 Jean sustainable and eco-friendly production practices, including solar energy, water recycling, and green technologies.',
        keywords: ['eco-friendly', 'sustainable', 'solar energy', 'water recycling', 'green manufacturing']
      },
      isActive: true
    });

    await ecoFriendlyData.save();
    console.log('✅ Eco-friendly data seeded successfully');

    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the seed function
seedEcoFriendly(); 