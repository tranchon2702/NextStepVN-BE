// scripts/seedOverview.js
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Models
const OverviewBanner = require('../models/OverviewBanner');
const Milestone = require('../models/Milestone');
const Message = require('../models/Message');
const VisionMission = require('../models/VisionMission');
const CoreValue = require('../models/CoreValue');

// const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saigon3jean';
const MONGO_URI = 'mongodb://localhost:27017/saigon3jean';

// Create necessary directories if they don't exist
const createDirectories = () => {
  const directories = [
    'uploads/images/overview-page'
  ];
  
  directories.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
};

const seedOverview = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Create necessary directories
    createDirectories();

    // Seed Overview Banner
    await OverviewBanner.deleteMany({});
    await OverviewBanner.create({
      title: 'SAIGON 3 JEAN GROUP',
      description:
        "Saigon 3 Jean Group is a leading manufacturer in Vietnam's textile and garment industry. We specialize in producing high-quality denim products, including jeans, jackets, and other garment items for both domestic and international markets. With modern facilities and skilled workforce, we are committed to delivering excellence in every product we create. Our company values sustainability, innovation, and customer satisfaction as we continue to grow and expand our presence in the global textile industry.",
      backgroundImage: '/uploads/images/overview-page/overview_banner.png'
    });
    console.log('✅ Seeded OverviewBanner');

    // Seed Milestones
    await Milestone.deleteMany({});
    await Milestone.create({
      milestones: [
        {
          year: 2019,
          title: 'Beginning',
          description:
            'Established the company with a vision to produce high-quality denim for both domestic and international markets',
          image: '/uploads/images/overview-page/overview_1.jpg',
          order: 1
        },
        {
          year: 2020,
          title: 'Expansion',
          description:
            'Expanded production capacity and modernized technology to meet increasing demand',
          image: '/uploads/images/overview-page/overview_2.jpg',
          order: 2
        },
        {
          year: 2021,
          title: 'Innovation',
          description:
            'Applied new technology and sustainable production processes, ensuring environmental friendliness',
          image: '/uploads/images/overview-page/overview_3.jpg',
          order: 3
        },
        {
          year: 2022,
          title: 'Globalization',
          description:
            'Expanded export markets and established strategic partnerships globally',
          image: '/uploads/images/overview-page/overview_4.jpg',
          order: 4
        },
        {
          year: 2023,
          title: '60 Hectares',
          description:
            'Expanded factory area to 60 hectares with modern production capacity',
          image: '/uploads/images/overview-page/overview_5.jpg',
          order: 5
        },
        {
          year: 2024,
          title: 'Expansion',
          description:
            'Expanded production capacity and modernized technology to meet increasing demand',
          image: '/uploads/images/overview-page/overview_4.jpg', // Using an existing image since overview_6.jpg doesn't exist
          order: 6
        }
      ]
    });
    console.log('✅ Seeded Milestones');

    // Seed Message
    await Message.deleteMany({});
    await Message.create({
      ceoName: 'CEO',
      ceoImage: '/uploads/images/overview-page/CEO.jpg',
      content: [
        {
          paragraph:
            '"Saigon 3 will always be associated with the core value of \"Quality creates the difference\"..."',
          order: 1
        },
        {
          paragraph:
            '"Saigon 3 also positions itself as a pioneer in applying modern, sustainable, and eco-friendly technologies..."',
          order: 2
        },
        {
          paragraph:
            '"Our culture is demonstrated through the talent, ethics, and passion of our leaders..."',
          order: 3
        }
      ]
    });
    console.log('✅ Seeded Message');

    // Seed VisionMission
    await VisionMission.deleteMany({});
    await VisionMission.create({
      vision: {
        icon: 'fas fa-eye',
        title: 'VISION',
        content:
          'To assert our position as a pioneer in sustainable garment production, driving innovation and environmental responsibility within the industry. Saigon 3 will continue to lead in denim garment supplier services and champion eco-friendly.'
      },
      mission: {
        icon: 'fas fa-bullseye',
        title: 'MISSION',
        content:
          'To provide the highest quality denim garments and denim washing services, ensuring excellence in every product. Saigon 3 aims to be a second home for all of our employees, fostering a supportive and thriving work environment.'
      }
    });
    console.log('✅ Seeded Vision & Mission');

    // Seed Core Values
    await CoreValue.deleteMany({});
    await CoreValue.create({
      values: [
        {
          title: 'Partnership & Trust',
          content: 'Building long-term relationships through mutual trust and respect.',
          icon: 'fas fa-handshake',
          order: 1
        },
        {
          title: 'Innovation',
          content: 'Constantly exploring new ideas and technologies.',
          icon: 'fas fa-lightbulb',
          order: 2
        },
        {
          title: 'Sustainability',
          content: 'Commitment to sustainable and environmentally friendly production.',
          icon: 'fas fa-leaf',
          order: 3
        },
        {
          title: 'Community',
          content: 'Supporting our employees and local communities.',
          icon: 'fas fa-users',
          order: 4
        },
        {
          title: 'Growth',
          content: 'Pursuing excellence and growth for a better future.',
          icon: 'fas fa-chart-line',
          order: 5
        }
      ]
    });
    console.log('✅ Seeded Core Values');

    console.log('🎉 Completed seeding overview data');
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding overview data:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedOverview();
