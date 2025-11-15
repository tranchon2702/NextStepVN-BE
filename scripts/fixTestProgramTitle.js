const mongoose = require('mongoose');
const Program = require('../models/Program');
require('dotenv').config();

async function fixTestProgramTitle() {
  try {
    // Kết nối MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextstepvn';
    await mongoose.connect(mongoUri);
    console.log('✅ Đã kết nối MongoDB');

    // Tìm tất cả chương trình có title hoặc metaTitle là "TEST"
    const testPrograms = await Program.find({
      $or: [
        { title: 'TEST' },
        { 'seo.metaTitle': 'TEST' }
      ]
    });

    console.log(`\n📋 Tìm thấy ${testPrograms.length} chương trình có title hoặc metaTitle là "TEST":\n`);

    if (testPrograms.length === 0) {
      console.log('✅ Không tìm thấy chương trình nào có title là "TEST"');
      await mongoose.disconnect();
      return;
    }

    // Hiển thị thông tin các chương trình
    testPrograms.forEach((program, index) => {
      console.log(`${index + 1}. ID: ${program._id}`);
      console.log(`   Title: ${program.title}`);
      console.log(`   MetaTitle: ${program.seo?.metaTitle || 'N/A'}`);
      console.log(`   Slug: ${program.slug}`);
      console.log(`   Published: ${program.isPublished}`);
      console.log('');
    });

    // Hỏi người dùng có muốn sửa không
    console.log('⚠️  Để sửa các chương trình này, vui lòng:');
    console.log('   1. Vào admin panel: /admin/programs');
    console.log('   2. Tìm và chỉnh sửa chương trình có title hoặc metaTitle là "TEST"');
    console.log('   3. Cập nhật title và metaTitle thành giá trị phù hợp\n');

    // Nếu muốn tự động sửa, uncomment phần dưới:
    /*
    for (const program of testPrograms) {
      // Sửa title nếu là "TEST"
      if (program.title === 'TEST') {
        program.title = 'Chương trình - Next Step Vietnam';
        console.log(`✅ Đã sửa title của chương trình ${program._id}`);
      }
      
      // Sửa metaTitle nếu là "TEST"
      if (program.seo?.metaTitle === 'TEST') {
        if (!program.seo) {
          program.seo = {};
        }
        program.seo.metaTitle = program.title || 'Chương trình - Next Step Vietnam';
        console.log(`✅ Đã sửa metaTitle của chương trình ${program._id}`);
      }
      
      await program.save();
    }
    console.log('\n✅ Đã sửa tất cả các chương trình có title là "TEST"');
    */

    await mongoose.disconnect();
    console.log('✅ Đã đóng kết nối MongoDB');
  } catch (error) {
    console.error('❌ Lỗi:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Chạy script
fixTestProgramTitle();


