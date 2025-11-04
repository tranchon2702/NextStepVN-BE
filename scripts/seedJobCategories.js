const mongoose = require('mongoose');
const JobCategory = require('../models/JobCategory');
require('dotenv').config();

// Data từ trang forEngineers hiện tại
const categoriesData = [
  {
    categoryId: 'co-khi',
    name: 'Kỹ sư cơ khí',
    nameJa: '機械エンジニア',
    description: 'Thiết kế, phát triển và bảo trì các hệ thống cơ khí',
    descriptionJa: '機械システムの設計・開発・保守',
    color: '#dc2626',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
    order: 1,
    isActive: true
  },
  {
    categoryId: 'o-to',
    name: 'Kỹ sư ôtô',
    nameJa: '自動車エンジニア',
    description: 'Nghiên cứu, thiết kế và sản xuất phương tiện ô tô',
    descriptionJa: '自動車の研究・設計・製造',
    color: '#991b1b',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop',
    order: 2,
    isActive: true
  },
  {
    categoryId: 'dien-dien-tu',
    name: 'Kỹ sư điện - điện tử',
    nameJa: '電気・電子エンジニア',
    description: 'Thiết kế và quản lý các hệ thống điện và điện tử',
    descriptionJa: '電気・電子システムの設計・管理',
    color: '#dc2626',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop',
    order: 3,
    isActive: true
  },
  {
    categoryId: 'it',
    name: 'Kỹ sư IT',
    nameJa: 'ITエンジニア',
    description: 'Lập trình, phát triển phần mềm, Web, Game',
    descriptionJa: 'プログラミング・ソフトウェア開発・Web・ゲーム',
    color: '#991b1b',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
    order: 4,
    isActive: true
  },
  {
    categoryId: 'xay-dung',
    name: 'Kỹ sư xây dựng',
    nameJa: '建設エンジニア',
    description: 'Thiết kế nhà, cầu đường, thuỷ điện',
    descriptionJa: '建築・橋梁・水力発電の設計',
    color: '#dc2626',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop',
    order: 5,
    isActive: true
  }
];

async function seedJobCategories() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/saigon3jean';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Insert categories
    for (const categoryData of categoriesData) {
      // Check if category already exists
      const existing = await JobCategory.findOne({ categoryId: categoryData.categoryId });
      
      if (existing) {
        console.log(`⚠️  Category "${categoryData.categoryId}" already exists, skipping...`);
        // Update existing category
        await JobCategory.findByIdAndUpdate(existing._id, categoryData, { new: true });
        console.log(`✅ Updated category "${categoryData.categoryId}"`);
      } else {
        const category = new JobCategory(categoryData);
        await category.save();
        console.log(`✅ Created category "${categoryData.categoryId}"`);
      }
    }

    console.log('\n✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
}

// Run seed
seedJobCategories();



