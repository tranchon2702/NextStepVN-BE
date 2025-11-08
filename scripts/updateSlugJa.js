require('dotenv').config();
const mongoose = require('mongoose');
const Program = require('../models/Program');
const News = require('../models/News');
const Job = require('../models/Careers').Job;

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saigon3jean';

async function updateSlugJa() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Wait a bit for kuroshiro to initialize
    console.log('⏳ Waiting for kuroshiro to initialize...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Update Programs
    console.log('\n📝 Updating Programs...');
    const programs = await Program.find({ titleJa: { $exists: true, $ne: '' } });
    console.log(`Found ${programs.length} programs with titleJa`);
    
    for (const program of programs) {
      const oldSlugJa = program.slugJa;
      // Trigger pre-save hook by marking titleJa as modified
      program.markModified('titleJa');
      await program.save();
      
      if (oldSlugJa !== program.slugJa) {
        console.log(`  ✅ Updated: ${program.title} - ${oldSlugJa} → ${program.slugJa}`);
      } else {
        console.log(`  ⏭️  No change: ${program.title} - ${program.slugJa}`);
      }
    }

    // Update News
    console.log('\n📰 Updating News...');
    const newsArticles = await News.find({ titleJa: { $exists: true, $ne: '' } });
    console.log(`Found ${newsArticles.length} news articles with titleJa`);
    
    for (const news of newsArticles) {
      const oldSlugJa = news.slugJa;
      // Trigger pre-save hook by marking titleJa as modified
      news.markModified('titleJa');
      await news.save();
      
      if (oldSlugJa !== news.slugJa) {
        console.log(`  ✅ Updated: ${news.title} - ${oldSlugJa} → ${news.slugJa}`);
      } else {
        console.log(`  ⏭️  No change: ${news.title} - ${news.slugJa}`);
      }
    }

    // Update Jobs
    console.log('\n💼 Updating Jobs...');
    const jobs = await Job.find({ titleJa: { $exists: true, $ne: '' } });
    console.log(`Found ${jobs.length} jobs with titleJa`);
    
    for (const job of jobs) {
      const oldSlugJa = job.slugJa;
      // Trigger pre-save hook by marking titleJa as modified
      job.markModified('titleJa');
      await job.save();
      
      if (oldSlugJa !== job.slugJa) {
        console.log(`  ✅ Updated: ${job.title} - ${oldSlugJa} → ${job.slugJa}`);
      } else {
        console.log(`  ⏭️  No change: ${job.title} - ${job.slugJa}`);
      }
    }

    console.log('\n✅ All slugJa updates completed!');
  } catch (error) {
    console.error('❌ Error updating slugJa:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

updateSlugJa();


