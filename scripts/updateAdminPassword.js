require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Connection string với authentication
const mongoUri = process.env.MONGODB_URI || 'mongodb://administrator:2702002%40123456@localhost:27017/nextstepviet?authSource=admin';

// Thông tin user cần update
const OLD_USERNAME = 'admin';  // Tài khoản ban đầu
const NEW_USERNAME = 'nextstepAdmin';  // Username mới
const NEW_PASSWORD = 'hoainextstep@2026';  // Password mới

async function updateAdminPassword() {
  try {
    // Connect to MongoDB
    console.log('Đang kết nối MongoDB...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Đã kết nối MongoDB thành công');

    // Tìm user cũ
    console.log(`\n🔍 Đang tìm user: ${OLD_USERNAME}...`);
    const user = await User.findOne({ username: OLD_USERNAME });

    if (!user) {
      console.error(`❌ Không tìm thấy user với username: ${OLD_USERNAME}`);
      console.log('\n📋 Danh sách users hiện có:');
      const allUsers = await User.find({}, { username: 1, role: 1, isActive: 1 });
      allUsers.forEach(u => {
        console.log(`  - ${u.username} (${u.role}, active: ${u.isActive})`);
      });
      process.exit(1);
    }

    console.log(`✅ Tìm thấy user: ${user.username}`);
    console.log(`   - Role: ${user.role}`);
    console.log(`   - Active: ${user.isActive}`);
    console.log(`   - Name: ${user.name}`);

    // Kiểm tra xem username mới đã tồn tại chưa
    const existingUser = await User.findOne({ username: NEW_USERNAME });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      console.error(`❌ Username "${NEW_USERNAME}" đã tồn tại!`);
      process.exit(1);
    }

    // Update username và password
    console.log(`\n🔄 Đang cập nhật thông tin...`);
    console.log(`   - Username: ${OLD_USERNAME} → ${NEW_USERNAME}`);
    console.log(`   - Password: [đã ẩn] → ${NEW_PASSWORD}`);
    
    user.username = NEW_USERNAME;
    user.password = NEW_PASSWORD;
    // Pre-save middleware sẽ tự động hash password
    await user.save();

    console.log(`\n✅ Đã cập nhật thành công!`);
    console.log(`   - Username mới: ${NEW_USERNAME}`);
    console.log(`   - Password mới: ${NEW_PASSWORD}`);

  } catch (error) {
    console.error('❌ Lỗi khi đổi mật khẩu:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Đã đóng kết nối database');
    process.exit(0);
  }
}

// Chạy script
updateAdminPassword();

