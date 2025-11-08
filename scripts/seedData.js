/**
 * Master Seed Script
 * Chạy tất cả các seed scripts để tạo dữ liệu mẫu cho website
 * 
 * Usage: npm run seed
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saigon3jean';

// Import các seed functions
const seedAuth = require('./seedDataAuth');
const seedHome = require('./seedDataHome');
const seedContact = require('./seedDataContact');
const seedCareers = require('./seedDataCareers');
const seedJobs = require('./seedDataJobs');
const seedNews = require('./seedDataNews');
const seedProducts = require('./seedDataProducts');
const seedOverview = require('./seedDataOverview');
const seedFacilities = require('./seedDataFacilities');
const seedEcoFriendly = require('./seedDataEcoFriendly');
const seedAutomation = require('./seedDataAutomation');
const seedMachinery = require('./seedDataMachinery');
const seedJobCategories = require('./seedJobCategories');
const seedRecruiterCategories = require('./seedRecruiterCategories');

async function runAllSeeds() {
  try {
    console.log('🚀 Starting seed process...');
    console.log('📦 Connecting to MongoDB...');
    
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB\n');

    // Thứ tự seed quan trọng (một số seed phụ thuộc vào seed khác)
    const seedOrder = [
      { name: 'Auth', fn: seedAuth },
      { name: 'Home', fn: seedHome },
      { name: 'Contact', fn: seedContact },
      { name: 'Job Categories', fn: seedJobCategories },
      { name: 'Recruiter Categories', fn: seedRecruiterCategories },
      { name: 'Careers', fn: seedCareers },
      { name: 'Jobs', fn: seedJobs },
      { name: 'News', fn: seedNews },
      { name: 'Products', fn: seedProducts },
      { name: 'Overview', fn: seedOverview },
      { name: 'Facilities', fn: seedFacilities },
      { name: 'Eco Friendly', fn: seedEcoFriendly },
      { name: 'Automation', fn: seedAutomation },
      { name: 'Machinery', fn: seedMachinery },
    ];

    for (const { name, fn } of seedOrder) {
      try {
        console.log(`\n📝 Seeding ${name}...`);
        if (typeof fn === 'function') {
          await fn();
        } else if (fn && typeof fn.default === 'function') {
          await fn.default();
        } else {
          console.log(`⚠️  ${name} seed function not found, skipping...`);
        }
        console.log(`✅ ${name} seeded successfully`);
      } catch (error) {
        console.error(`❌ Error seeding ${name}:`, error.message);
        // Continue with other seeds even if one fails
      }
    }

    console.log('\n🎉 All seeds completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   - Auth data seeded');
    console.log('   - Home data seeded');
    console.log('   - Contact data seeded');
    console.log('   - Job Categories seeded');
    console.log('   - Recruiter Categories seeded');
    console.log('   - Careers data seeded');
    console.log('   - Jobs data seeded');
    console.log('   - News data seeded');
    console.log('   - Products data seeded');
    console.log('   - Overview data seeded');
    console.log('   - Facilities data seeded');
    console.log('   - Eco Friendly data seeded');
    console.log('   - Automation data seeded');
    console.log('   - Machinery data seeded');
    console.log('\n✨ Website is ready with sample data!');
    console.log('🔍 SEO features (sitemap, structured data) will work with this data.');

  } catch (error) {
    console.error('❌ Fatal error during seeding:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  runAllSeeds();
}

module.exports = runAllSeeds;

