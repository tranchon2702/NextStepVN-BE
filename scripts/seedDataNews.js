const mongoose = require('mongoose');
const { News } = require('../models');
const fs = require('fs');
const path = require('path');

// Kết nối đến MongoDB
mongoose.connect('mongodb://localhost:27017/saigon3jean', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Tạo thư mục uploads/images/news nếu chưa tồn tại
const newsImageDir = path.join(__dirname, '../uploads/images/news');
if (!fs.existsSync(newsImageDir)) {
  fs.mkdirSync(newsImageDir, { recursive: true });
  console.log('✅ Created directory for news images');
}

// Tạo dữ liệu mẫu cho tin tức
async function seedNewsData() {
  try {
    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      console.log('Seeding news data...');
      
      const newsItems = [
        {
          title: 'Saigon 3 Jean tham gia hội chợ dệt may quốc tế 2023',
          content: 'Saigon 3 Jean đã tham gia hội chợ dệt may quốc tế 2023 và giới thiệu các sản phẩm mới nhất của công ty.',
          excerpt: 'Saigon 3 Jean đã tham gia hội chợ dệt may quốc tế 2023...',
          image: '/uploads/images/news/post_1.jpg',
          slug: 'saigon-3-jean-tham-gia-hoi-cho-det-may-quoc-te-2023',
          publishDate: new Date('2023-10-15'),
          isPublished: true,
          isFeatured: false,
          views: 0,
          tags: ['hội chợ', 'dệt may', 'sự kiện'],
          author: 'Saigon 3 Jean'
        },
        {
          title: 'SAIGON 3 JEAN ACHIEVES LEED GOLD CERTIFICATION FOR GREEN MANUFACTURING',
          content: 'Our state-of-the-art denim manufacturing facility officially receives LEED Gold certification, reinforcing our commitment to sustainable development and environmental responsibility.',
          excerpt: 'Our state-of-the-art denim manufacturing facility officially receives LEED Gold certification...',
          image: '/uploads/images/news/post_2.png',
          slug: 'leed-gold-certification',
          publishDate: new Date('2023-05-08'),
          isPublished: true,
          isFeatured: true,
          views: 0,
          tags: ['sustainability', 'certification'],
          author: 'Saigon 3 Jean'
        },
        {
          title: 'Saigon 3 Jean ra mắt dòng sản phẩm denim thân thiện với môi trường',
          content: 'Saigon 3 Jean vừa ra mắt dòng sản phẩm denim mới thân thiện với môi trường, sử dụng công nghệ tiết kiệm nước và năng lượng.',
          excerpt: 'Saigon 3 Jean vừa ra mắt dòng sản phẩm denim mới thân thiện với môi trường...',
          image: '/uploads/images/news/post_3.jpg',
          slug: 'saigon-3-jean-ra-mat-dong-san-pham-denim-than-thien-voi-moi-truong',
          publishDate: new Date('2023-08-20'),
          isPublished: true,
          isFeatured: false,
          views: 0,
          tags: ['sản phẩm mới', 'thân thiện môi trường', 'denim'],
          author: 'Saigon 3 Jean'
        },
        {
          title: 'Saigon 3 Jean hợp tác với các thương hiệu thời trang hàng đầu',
          content: 'Saigon 3 Jean đã ký kết hợp tác với nhiều thương hiệu thời trang hàng đầu thế giới để cung cấp vải denim chất lượng cao.',
          excerpt: 'Saigon 3 Jean đã ký kết hợp tác với nhiều thương hiệu thời trang hàng đầu thế giới...',
          image: '/uploads/images/news/post_4.png',
          slug: 'saigon-3-jean-hop-tac-voi-cac-thuong-hieu-thoi-trang-hang-dau',
          publishDate: new Date('2023-09-05'),
          isPublished: true,
          isFeatured: false,
          views: 0,
          tags: ['hợp tác', 'thương hiệu', 'thời trang'],
          author: 'Saigon 3 Jean'
        }
      ];
      
      await News.insertMany(newsItems);
      console.log(`✅ Created ${newsItems.length} news items`);
    } else {
      console.log(`✅ News data already exists (${newsCount} items)`);
    }
  } catch (error) {
    console.error('❌ Error seeding news data:', error);
  } finally {
    mongoose.disconnect();
    console.log('✅ Database connection closed');
  }
}

// Chạy seed
seedNewsData(); 