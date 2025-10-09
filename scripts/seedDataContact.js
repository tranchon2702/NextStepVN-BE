const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const ContactInfo = require('../models/ContactInfo');

// const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saigon3jean';
const MONGO_URI = 'mongodb://localhost:27017/saigon3jean';
async function seedContact() {
  await mongoose.connect(MONGO_URI);
  console.log('🔗 Connected to MongoDB');

  await ContactInfo.deleteMany({});
  console.log('🧹 Cleared old contact info');

  await ContactInfo.create({
    bannerImage: '/uploads/images/contact-page/banner_contact.png',
    address: ' N2-D2 Street, Nhon Trach Textile and Garment Industrial Park, Nhon Trach, Dong Nai Province, Vietnam',
    email: 'hr@saigon3jean.com.vn',
    phone: '(+84) 28 3940 1234',
    workingHours: 'Monday - Friday: 8:00 AM - 5:00 PM',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.3933362245784!2d106.92286539678953!3d10.704114100000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31751974e66285bb%3A0xb82adb6375242b08!2zU8OgaSBHw7JuIDM!5e0!3m2!1svi!2s!4v1751858584832!5m2!1svi!2s',
    socialLinks: {
      facebook: 'https://facebook.com/saigon3jean',
      linkedin: 'https://linkedin.com/company/saigon3jean',
      twitter: ''
    },
    isActive: true
  });
  console.log('✅ Contact info seeded');

  await mongoose.disconnect();
  console.log('📡 Disconnected from MongoDB');
}

seedContact(); 