const mongoose = require('mongoose');
require('dotenv').config();

// Import ContactInfo model
const ContactInfo = require('./models/ContactInfo');

async function fixSocialLinksProduction() {
  try {
    // Sử dụng MONGODB_URI từ .env hoặc fallback về localhost
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/saigon3jeans';
    
    console.log('🔗 Connecting to MongoDB:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials in log
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully');

    // Tìm record ContactInfo hiện tại
    let contactInfo = await ContactInfo.findOne({ isActive: true });
    
    if (!contactInfo) {
      console.log('📝 No active ContactInfo found, creating default...');
      
      // Tạo record mặc định
      contactInfo = new ContactInfo({
        id: 'default',
        bannerImage: '/uploads/images/contact-page/banner_contact.png',
        address1: '47 Đường số 17, Khu phố 3, P. Hiệp Bình Phước, TP. Thủ Đức, TP. HCM, Việt Nam',
        address2: 'N2-D2 Street, Nhon Trach Textile and Garment Industrial Park, Nhon Trach, Dong Nai Province, Vietnam',
        email: 'hr@saigon3jean.com.vn',
        phone: '(+84) 28 3940 1234',
        workingHours: 'Monday - Friday: 8:00 AM - 5:00 PM',
        mapEmbedUrl: '',
        socialLinks: {
          facebook: 'https://facebook.com/saigon3jeans',
          instagram: 'https://instagram.com/saigon3jeans',
          youtube: 'https://youtube.com/@saigon3jeans'
        },
        isActive: true
      });
      
      await contactInfo.save();
      console.log('✅ Created default ContactInfo record');
    } else {
      console.log('📋 Found existing ContactInfo record');
      console.log('Current socialLinks:', JSON.stringify(contactInfo.socialLinks, null, 2));
      
      // Cập nhật socialLinks với schema mới
      contactInfo.socialLinks = {
        facebook: contactInfo.socialLinks?.facebook || 'https://facebook.com/saigon3jeans',
        instagram: contactInfo.socialLinks?.instagram || 'https://instagram.com/saigon3jeans', 
        youtube: contactInfo.socialLinks?.youtube || 'https://youtube.com/@saigon3jeans'
      };
      
      // Đảm bảo có address1 và address2
      if (!contactInfo.address1) {
        contactInfo.address1 = contactInfo.address || '47 Đường số 17, Khu phố 3, P. Hiệp Bình Phước, TP. Thủ Đức, TP. HCM, Việt Nam';
      }
      if (!contactInfo.address2) {
        contactInfo.address2 = 'N2-D2 Street, Nhon Trach Textile and Garment Industrial Park, Nhon Trach, Dong Nai Province, Vietnam';
      }
      
      await contactInfo.save();
      console.log('✅ Updated ContactInfo socialLinks');
    }
    
    // Kiểm tra kết quả cuối cùng
    const updatedRecord = await ContactInfo.findOne({ isActive: true });
    console.log('🎉 Final ContactInfo:');
    console.log('- ID:', updatedRecord.id);
    console.log('- Address1:', updatedRecord.address1);
    console.log('- Address2:', updatedRecord.address2);
    console.log('- Email:', updatedRecord.email);
    console.log('- SocialLinks:', JSON.stringify(updatedRecord.socialLinks, null, 2));
    console.log('- IsActive:', updatedRecord.isActive);
    
    console.log('✅ Social links fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing social links:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Chạy script
console.log('🚀 Starting social links fix for production...');
console.log('📍 Environment:', process.env.NODE_ENV || 'development');
fixSocialLinksProduction();
