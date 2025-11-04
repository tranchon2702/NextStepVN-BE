const mongoose = require('mongoose');
require('dotenv').config();

const { Job } = require('../models/Careers');
const JobCategory = require('../models/JobCategory');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saigon3jean';

async function updateJobCategoryIds() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Get all categories
    const categories = await JobCategory.find({ isActive: true });
    console.log(`📦 Found ${categories.length} categories`);

    // Create mapping from category enum to categoryId
    const categoryMapping = {
      'CƠ KHÍ': 'co-khi',
      'Ô TÔ': 'o-to',
      'ĐIỆN, ĐIỆN TỬ': 'dien-dien-tu',
      'IT': 'it',
      'XÂY DỰNG': 'xay-dung'
    };

    // Also build mapping from category names in DB
    categories.forEach(cat => {
      const name = cat.name.toLowerCase();
      if (name.includes('cơ khí')) categoryMapping['CƠ KHÍ'] = cat.categoryId;
      else if (name.includes('ôtô') || name.includes('ô tô')) categoryMapping['Ô TÔ'] = cat.categoryId;
      else if (name.includes('điện')) categoryMapping['ĐIỆN, ĐIỆN TỬ'] = cat.categoryId;
      else if (name.includes('it')) categoryMapping['IT'] = cat.categoryId;
      else if (name.includes('xây dựng')) categoryMapping['XÂY DỰNG'] = cat.categoryId;
    });

    console.log('📋 Category mapping:', categoryMapping);

    // Find all jobs without categoryId or with empty categoryId
    const jobs = await Job.find({
      $or: [
        { categoryId: { $exists: false } },
        { categoryId: null },
        { categoryId: '' }
      ]
    });

    console.log(`📋 Found ${jobs.length} jobs without categoryId`);

    if (jobs.length === 0) {
      console.log('✅ All jobs already have categoryId!');
      await mongoose.connection.close();
      return;
    }

    // Update each job
    let updateCount = 0;
    for (const job of jobs) {
      if (job.category && categoryMapping[job.category]) {
        job.categoryId = categoryMapping[job.category];
        await job.save();
        updateCount++;
        console.log(`✅ Updated: ${job.title} -> ${job.categoryId} (${job.category})`);
      } else {
        console.log(`⚠️  Skipped: ${job.title} - category "${job.category}" not found in mapping`);
      }
    }

    console.log(`\n✅ Update completed! Updated ${updateCount} jobs.`);

    // Show summary
    const summary = await Job.aggregate([
      { 
        $group: { 
          _id: { category: '$category', categoryId: '$categoryId' }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { '_id.category': 1 } }
    ]);

    console.log('\n📊 Jobs by category:');
    summary.forEach(({ _id, count }) => {
      console.log(`   ${_id.category} (${_id.categoryId || 'NO CATEGORY ID'}): ${count} jobs`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run update
updateJobCategoryIds();
