const mongoose = require('mongoose');
const News = require('../models/News');
require('dotenv').config();

async function checkNewsSeo() {
  try {
    // Kết nối MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/saigon3jean';
    await mongoose.connect(mongoUri);
    console.log('✅ Đã kết nối MongoDB');

    // Lấy tất cả news
    const allNews = await News.find({}).select('title seo').limit(10);
    
    console.log(`\n📋 Tìm thấy ${allNews.length} tin tức:\n`);

    allNews.forEach((news, index) => {
      console.log(`${index + 1}. Title: ${news.title}`);
      console.log(`   Has SEO: ${!!news.seo}`);
      if (news.seo) {
        console.log(`   MetaTitle: ${news.seo.metaTitle || 'N/A'}`);
        console.log(`   MetaDescription: ${news.seo.metaDescription || 'N/A'}`);
        console.log(`   MetaKeywords: ${news.seo.metaKeywords?.join(', ') || 'N/A'}`);
        console.log(`   OGImage: ${news.seo.ogImage || 'N/A'}`);
      } else {
        console.log(`   SEO: null hoặc undefined`);
      }
      console.log('');
    });

    await mongoose.disconnect();
    console.log('✅ Đã đóng kết nối MongoDB');
  } catch (error) {
    console.error('❌ Lỗi:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Chạy script
checkNewsSeo();

