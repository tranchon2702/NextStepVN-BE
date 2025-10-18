// Script to migrate old jobs to new schema with category field
const mongoose = require('mongoose');
require('dotenv').config();

const Job = require('../models/Careers').Job;

async function migrateOldJobs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/saigon3jean');
    console.log('✅ Connected to MongoDB');

    // Find all jobs without category
    const jobsWithoutCategory = await Job.find({
      $or: [
        { category: { $exists: false } },
        { category: null },
        { category: '' }
      ]
    });

    console.log(`Found ${jobsWithoutCategory.length} jobs without category`);

    if (jobsWithoutCategory.length === 0) {
      console.log('✅ All jobs already have category!');
      await mongoose.connection.close();
      return;
    }

    // Update each job
    let updateCount = 0;
    for (const job of jobsWithoutCategory) {
      // Auto-assign category based on job title keywords
      let category = 'CƠ KHÍ'; // Default

      const title = job.title.toLowerCase();
      
      if (title.includes('ô tô') || title.includes('auto') || title.includes('car')) {
        category = 'Ô TÔ';
      } else if (title.includes('điện') || title.includes('electric') || title.includes('electron')) {
        category = 'ĐIỆN, ĐIỆN TỬ';
      } else if (title.includes('it') || title.includes('software') || title.includes('developer') || title.includes('programmer')) {
        category = 'IT';
      } else if (title.includes('xây dựng') || title.includes('construction') || title.includes('civil')) {
        category = 'XÂY DỰNG';
      }

      // Update job
      job.category = category;
      
      // Add default values for other new fields if not exist
      if (!job.recruitmentStatus) {
        job.recruitmentStatus = 'Đang tuyển';
      }
      if (!job.workType && job.type) {
        job.workType = job.type;
      }
      
      await job.save();
      updateCount++;
      
      console.log(`✅ Updated: ${job.title} -> Category: ${category}`);
    }

    console.log(`\n✅ Migration completed! Updated ${updateCount} jobs.`);
    
    // Show summary
    const categoryCounts = await Job.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\n📊 Jobs by category:');
    categoryCounts.forEach(({ _id, count }) => {
      console.log(`   ${_id}: ${count} jobs`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run migration
migrateOldJobs();

