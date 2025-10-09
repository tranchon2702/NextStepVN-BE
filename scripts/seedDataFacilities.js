const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Facilities = require('../models/Facilities');

// const MONGO_URI =
//   process.env.MONGODB_URI || 'mongodb://localhost:27017/saigon3jean';
const MONGO_URI = 'mongodb://localhost:27017/saigon3jean';

// Helper: sinh mảng 3 ảnh giống nhau
const generateImages = (alt) => [
  { url: '/uploads/images/facilities-page/section_2-office.jpg', alt: `${alt} 1`, order: 1 },
  { url: '/uploads/images/facilities-page/section_2-office.jpg', alt: `${alt} 2`, order: 2 },
  { url: '/uploads/images/facilities-page/section_2-office.jpg', alt: `${alt} 3`, order: 3 }
];

async function seedFacilities() {
  await mongoose.connect(MONGO_URI);
  console.log('🔗 Connected to MongoDB');

  await Facilities.deleteMany({});
  console.log('🧹 Cleared old facilities data');

  await Facilities.create({
    pageTitle: 'FACILITIES',
    pageDescription:
      'Discover our state-of-the-art manufacturing facilities and capabilities',

    // ───── Key Metrics ─────
    keyMetrics: [
      {
        icon: 'fas fa-expand-arrows-alt',
        value: '50.000',
        unit: 'm²',
        label: 'Area',
        order: 1
      },
      {
        icon: 'fas fa-users',
        value: '240',
        unit: '',
        label: 'Employees',
        order: 2
      },
      {
        icon: 'fas fa-boxes',
        value: '120.000',
        unit: '',
        label: 'pcs/year',
        order: 3
      }
    ],

    // ───── Facility Features ─────
    facilityFeatures: [
      {
        title: 'OUT DOOR',
        description:
          'We are committed to creating a green, clean, and friendly working environment, contributing to the development of a sustainable ecosystem around the business.',
        image: '/uploads/images/facilities-page/section_2-office.jpg',
        imageAlt: 'Outdoor Facilities',
        images: generateImages('Outdoor Facilities'),
        order: 1,
        layout: 'left'
      },
      {
        title: 'OFFICE',
        description:
          'The workspace is optimized to create a clean, safe, and comfortable environment, enhancing health, boosting productivity, and providing comfort for employees.',
        image: '/uploads/images/facilities-page/section_2-office.jpg',
        imageAlt: 'Office Facilities',
        images: generateImages('Office Facilities'),
        order: 2,
        layout: 'right'
      },
      {
        title: 'FACILITIES',
        description:
          'The modern infrastructure system is comprehensively invested, from advanced production lines and automation technology to strict quality control processes.',
        image: '/uploads/images/facilities-page/section_2-office.jpg',
        imageAlt: 'Manufacturing Facilities',
        images: generateImages('Manufacturing Facilities'),
        order: 3,
        layout: 'left'
      },
      {
        title: 'TALENTED WORKFORCE',
        description:
          'People are the core factor that drives the success and sustainable development of the business. Therefore, investing in training and skill development is always a priority to enhance capabilities and create sustainable value.',
        image: '/uploads/images/facilities-page/section_2-office.jpg',
        imageAlt: 'Talented Workforce',
        images: generateImages('Talented Workforce'),
        order: 4,
        layout: 'right'
      }
    ],

    // ───── SEO ─────
    seo: {
      metaTitle: 'Facilities - Saigon 3 Jean',
      metaDescription:
        'Explore Saigon 3 Jean modern facilities, advanced technology, and talented workforce driving sustainable denim manufacturing excellence.',
      keywords: ['facilities', 'manufacturing', 'denim', 'sustainable', 'technology']
    },

    isActive: true
  });

  console.log('✅ Facilities seed completed');
  await mongoose.disconnect();
}

seedFacilities();
