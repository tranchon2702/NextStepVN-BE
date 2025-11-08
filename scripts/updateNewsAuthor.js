require('dotenv').config();
const mongoose = require('mongoose');
const News = require('../models/News');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saigon3jean';

async function updateNewsAuthor() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all news with author "Saigon 3 Jean"
    console.log('\n📰 Updating News author...');
    const result = await News.updateMany(
      { author: 'Saigon 3 Jean' },
      { $set: { author: 'Next Step Vietnam' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} news articles`);
    console.log(`   Matched: ${result.matchedCount} news articles`);
    
    if (result.modifiedCount > 0) {
      console.log('\n✅ All news authors updated successfully!');
    } else {
      console.log('\nℹ️  No news articles found with author "Saigon 3 Jean"');
    }

  } catch (error) {
    console.error('❌ Error updating news author:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
}

updateNewsAuthor();

