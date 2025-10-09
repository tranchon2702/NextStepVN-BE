const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Automation = require('../models/Automation');

// Sử dụng chuỗi kết nối không yêu cầu xác thực
const MONGO_URI = 'mongodb://localhost:27017/saigon3jean';

async function seedAutomation() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔗 Connected to MongoDB');

    await Automation.deleteMany({});
    console.log('🧹 Cleared old automation data');

    await Automation.create({
      pageTitle: 'AUTOMATION',
      pageDescription: 'Advanced automation systems driving efficiency and precision in our manufacturing processes',
      automationItems: [
        {
          title: 'Smart Manufacturing',
          description: 'Advanced robotic systems for precision manufacturing processes.',
          image: '/uploads/images/automation/automation_1.png',
          imageAlt: 'Smart Manufacturing Robotics',
          order: 1,
          isActive: true,
          contentItems: [
            {
              title: 'SMART MANUFACTURING',
              description: 'Intelligent manufacturing processes with IoT integration and data analytics for optimal efficiency and productivity. Our smart manufacturing system uses real-time monitoring and adaptive control to ensure consistent quality.',
              order: 1,
              isActive: true
            },
            {
              title: 'ROBOTIC PRECISION',
              description: 'Automated robotic systems that ensure millimeter precision in cutting and assembly operations, reducing material waste and improving consistency across production runs.',
              order: 2,
              isActive: true
            },
            {
              title: 'IOT INTEGRATION',
              description: 'Connected devices throughout our factory floor communicate seamlessly to optimize workflow and identify potential issues before they impact production.',
              order: 3,
              isActive: true
            }
          ]
        },
        {
          title: 'Process Automation',
          description: 'Streamlined production with automated material handling and processing systems.',
          image: '/uploads/images/automation/automation_2.jpg',
          imageAlt: 'Process Automation Machinery',
          order: 2,
          isActive: true,
          contentItems: [
            {
              title: 'PROCESS AUTOMATION',
              description: 'Streamlined production workflows with automated material handling and processing for increased productivity. Our automated systems manage material flow from receiving to shipping, minimizing handling time and maximizing throughput.',
              order: 1,
              isActive: true
            },
            {
              title: 'CONTINUOUS FLOW',
              description: 'Automated conveyor systems and smart transfer stations ensure materials move efficiently between production stages with minimal downtime.',
              order: 2,
              isActive: true
            },
            {
              title: 'QUALITY CONTROL',
              description: 'Integrated inspection systems automatically identify and flag quality issues, ensuring only perfect products reach our customers.',
              order: 3,
              isActive: true
            }
          ]
        },
        {
          title: 'Digital Integration',
          description: 'Seamless integration of digital technologies for enhanced communication and coordination.',
          image: '/uploads/images/automation/automation_3.png',
          imageAlt: 'Digital Integration Analytics',
          order: 3,
          isActive: true,
          contentItems: [
            {
              title: 'DIGITAL INTEGRATION',
              description: 'Seamless integration of digital technologies for enhanced communication and coordination across all production stages. Our digital systems connect design, planning, production, and logistics into one unified workflow.',
              order: 1,
              isActive: true
            },
            {
              title: 'DATA STORAGE AND ANALYSIS',
              description: 'Comprehensive data collection and analytics provide actionable insights for continuous process improvement and strategic decision making.',
              order: 2,
              isActive: true
            },
            {
              title: 'SUPPLY CHAIN VISIBILITY',
              description: 'End-to-end digital tracking provides complete transparency from raw material sourcing to finished product delivery.',
              order: 3,
              isActive: true
            }
          ]
        }
      ],
      sliderSettings: {
        autoplay: true,
        autoplaySpeed: 3000,
        showArrows: true,
        showDots: true,
        infinite: true,
        slidesToShow: {
          desktop: 3,
          tablet: 2,
          mobile: 1
        }
      },
      seo: {
        metaTitle: 'Automation - Saigon 3 Jean',
        metaDescription: 'Discover Saigon 3 Jean advanced automation systems: smart manufacturing, process automation, and digital integration for sustainable denim production.',
        keywords: ['automation', 'manufacturing', 'smart manufacturing', 'process automation', 'digital integration']
      },
      isActive: true
    });
    console.log('✅ Automation data seeded');

    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    await mongoose.disconnect();
  }
}

seedAutomation(); 