const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Machinery = require('../models/Machinery');

// const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saigon3jean';
const MONGO_URI = 'mongodb://localhost:27017/saigon3jean';

async function seedMachinery() {
  await mongoose.connect(MONGO_URI);
  console.log('🔧 Connected to MongoDB');

  await Machinery.deleteMany({});
  console.log('🧹 Old machinery data cleared');

  // Define helper to generate image array
  const generateImages = (imagePath, altText) => {
    return [
      { url: imagePath, alt: altText, order: 0 },
      { url: imagePath, alt: altText, order: 1 },
      { url: imagePath, alt: altText, order: 2 }
    ];
  };

  await Machinery.create({
    pageTitle: 'APPLICATION OF PRECISE PROGRAMMING, ENSURING CONSISTENCY IN PRODUCTION',
    pageDescription: 'Advanced machinery and precise programming systems for consistent, high-quality denim production',
    stages: [
      {
        stageNumber: 1,
        title: 'STAGE 1',
        description: 'Application of precise programming, ensuring consistency in production',
        order: 1,
        isActive: true,
        machines: [
          {
            name: 'LAZER MACHINE',
            description: 'Lazer machine with advanced technology, helping to optimize production processes and ensure the highest quality of products.',
            image: '/uploads/images/machinery-page/lazer_machine.png',
            imageAlt: 'Lazer Machine',
            images: generateImages('/uploads/images/machinery-page/lazer_machine.png', 'Lazer Machine'),
            order: 1,
            isActive: true
          },
          {
            name: 'WASH MACHINE',
            description: 'Industrial wash machine with advanced technology, helping to optimize production processes and ensure the highest quality of products.',
            image: '/uploads/images/machinery-page/wash_machine.png',
            imageAlt: 'Wash Machine',
            images: generateImages('/uploads/images/machinery-page/wash_machine.png', 'Wash Machine'),
            order: 2,
            isActive: true
          }
        ]
      },
      {
        stageNumber: 2,
        title: 'STAGE 2',
        description: 'Application of precise programming, ensuring consistency in production',
        order: 2,
        isActive: true,
        machines: [
          {
            name: 'CUTTING MACHINE',
            description: 'Precision cutting machine for accurate fabric preparation and minimal waste.',
            image: '/uploads/images/machinery-page/cutting_machine.png',
            imageAlt: 'Cutting Machine',
            images: generateImages('/uploads/images/machinery-page/cutting_machine.png', 'Cutting Machine'),
            order: 1,
            isActive: true
          }
        ]
      },
      {
        stageNumber: 3,
        title: 'STAGE 3',
        description: 'Application of precise programming, ensuring consistency in production',
        order: 3,
        isActive: true,
        machines: [
          {
            name: 'SEWING MACHINE',
            description: 'High-speed industrial sewing machines for consistent stitching quality.',
            image: '/uploads/images/machinery-page/sewing_machine.png',
            imageAlt: 'Sewing Machine',
            images: generateImages('/uploads/images/machinery-page/sewing_machine.png', 'Sewing Machine'),
            order: 1,
            isActive: true
          }
        ]
      },
      {
        stageNumber: 4,
        title: 'STAGE 4',
        description: 'Application of precise programming, ensuring consistency in production',
        order: 4,
        isActive: true,
        machines: [
          {
            name: 'FINISHING MACHINE',
            description: 'Final processing machines for product finishing and quality assurance.',
            image: '/uploads/images/machinery-page/finishing_machine.png',
            imageAlt: 'Finishing Machine',
            images: generateImages('/uploads/images/machinery-page/finishing_machine.png', 'Finishing Machine'),
            order: 1,
            isActive: true
          }
        ]
      }
    ],
    seo: {
      metaTitle: 'Machinery - Saigon 3 Jean',
      metaDescription: 'Discover Saigon 3 Jean advanced machinery: laser machines, wash machines, and precision programming systems for consistent denim production.',
      keywords: ['machinery', 'laser machine', 'wash machine', 'precision programming', 'denim production']
    },
    isActive: true
  });

  console.log('✅ Machinery seed completed');
  await mongoose.disconnect();
}

seedMachinery();
