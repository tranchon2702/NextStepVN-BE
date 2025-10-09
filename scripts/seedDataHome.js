const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
dotenv.config();

const Hero = require('../models/Hero');
const HomeSection = require('../models/HomeSection');
const Customer = require('../models/Customer');
const Certification = require('../models/Certification');
const News = require('../models/News');

// const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saigon3jean';
const MONGO_URI = 'mongodb://localhost:27017/saigon3jean';

// Create necessary directories if they don't exist
const createDirectories = () => {
  const directories = [
    'uploads/images/branding_our_customer',
    'uploads/images/certification',
    'uploads/images/news',
    'uploads/videos'
  ];
  
  directories.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('📦 Connected to MongoDB');
    
    // Create necessary directories
    createDirectories();

    // HERO
    await Hero.deleteMany({});
    await Hero.create({
      title: 'A QUALITY-ORIENTED WASHING FACTORY DRIVING BY SUSTAINABILITY',
      subtitle: '',
      backgroundImage: '/uploads/images/home_banner-section2.jpg',
      videoUrl: '/uploads/videos/HeroVideo.mp4',
      isActive: true
    });
    console.log('✅ Hero data seeded');

    // SECTION (3 cards)
    await HomeSection.deleteMany({});
    await HomeSection.create({
      sections: [
        {
          title: 'INSIDE THE LAUNDRY',
          content: 'Certigied with LEED GOLD standard, our factory was established in 2018 at Nhon Trach, Dong Nai, Viet Nam',
          mediaType: 'video',
          mediaUrl: '/uploads/videos/SAIGON_3_JEAN.mp4',
          buttonText: 'WATCH VIDEO',
          buttonLink: '#',
          backgroundColor: '#1e40af',
          order: 1
        },
        {
          title: 'Quality makes difference',
          content: 'Deliver finest experience to our customers throughout every garment we made',
          mediaType: 'image',
          mediaUrl: '/uploads/images/home_banner-section2.jpg',
          backgroundColor: '#059669',
          order: 2
        },
        {
          title: 'Green commitment',
          content: 'Optimized energy solutions for efficient and sustainable manufacturing',
          mediaType: 'image',
          mediaUrl: '/uploads/images/home_banner-section3.png',
          backgroundColor: '#dc2626',
          order: 3
        }
      ]
    });
    console.log('✅ Home sections seeded');

    // CUSTOMERS
    await Customer.deleteMany({});
    await Customer.create({
      categories: {
        denimWoven: [
          { name: 'RODD & GUNN', logo: '/uploads/images/branding_our_customer/rodd&gunn.png', order: 1 },
          { name: 'GAZ MAN', logo: '/uploads/images/branding_our_customer/gazman.png', order: 2 },
          { name: 'UNIQLO', logo: '/uploads/images/branding_our_customer/uniqlo.png', order: 3 },
          { name: 'MUJI', logo: '/uploads/images/branding_our_customer/muji.png', order: 4 },
          { name: 'RODD & GUNN (copy)', logo: '/uploads/images/branding_our_customer/rodd&gunn.png', order: 5 },
          { name: 'GAZ MAN (copy)', logo: '/uploads/images/branding_our_customer/gazman.png', order: 6 }
        ],
        knit: [
          { name: 'THE LOYALIST', logo: '/uploads/images/branding_our_customer/the_loyalist.png', order: 1 },
          { name: 'GOLF', logo: '/uploads/images/branding_our_customer/golf.png', order: 2 },
          { name: "chico's", logo: '/uploads/images/branding_our_customer/chico.png', order: 3 },
          { name: 'drew house', logo: '/uploads/images/branding_our_customer/drewhouse.png', order: 4 },
          { name: 'THE LOYALIST (copy)', logo: '/uploads/images/branding_our_customer/the_loyalist.png', order: 5 },
          { name: 'GOLF (copy)', logo: '/uploads/images/branding_our_customer/golf.png', order: 6 }
        ]
      }
    });
    console.log('✅ Customer data seeded');

    // CERTIFICATIONS
    await Certification.deleteMany({});
    await Certification.create({
      certifications: [
        {
          name: 'LEED GOLD',
          description: 'Leadership in Energy & Environmental Design',
          image: '/uploads/images/certification/leed_gold.png',
          category: 'environmental',
          order: 1
        },
        {
          name: 'ISO 9001:2015',
          description: 'Quality Management System',
          image: '/uploads/images/certification/certificate.png',
          category: 'quality',
          order: 2
        },
        {
          name: 'HIGG INDEX',
          description: 'SUSTAINABLE MANUFACTURING',
          image: '/uploads/images/certification/higg_index.png',
          category: 'sustainability',
          order: 3
        },
        {
          name: 'OEKO-TEX',
          description: 'SAFE & CARING PRODUCTS',
          image: '/uploads/images/certification/oeko_tex.png',
          category: 'safety',
          order: 4
        },
        {
          name: 'EIM SCORE',
          description: 'SUSTAINABLE TECHNOLOGY',
          image: '/uploads/images/certification/eim_score.png',
          category: 'technology',
          order: 5
        },
        {
          name: 'SEDEX',
          description: 'SOCIAL RESPONSIBILITY',
          image: '/uploads/images/certification/sedex.png',
          category: 'social',
          order: 6
        },
        {
          name: 'FAST RETAILING',
          description: 'CERTIFIED SUB-CONTRACTOR',
          image: '/uploads/images/certification/fast_retailing.png',
          category: 'partner',
          order: 7
        }
      ]
    });
    console.log('✅ Certification data seeded');

    // NEWS
    await News.deleteMany({});
    await News.insertMany([
      {
        title: 'SAIGON 3 JEAN ACHIEVES LEED GOLD CERTIFICATION FOR GREEN MANUFACTURING',
        content: 'Our state-of-the-art denim manufacturing facility officially receives LEED Gold certification, reinforcing our commitment to sustainable development and environmental responsibility.',
        excerpt: 'Our state-of-the-art denim manufacturing facility officially receives LEED Gold certification...',
        image: '/uploads/images/news/post_2.png',
        slug: 'leed-gold-certification',
        publishDate: '2025-05-08',
        isPublished: true,
        isFeatured: true,
        tags: ['sustainability', 'certification']
      },
      {
        title: 'LAUNCHING ECO-FRIENDLY DENIM COLLECTION FALL 2025',
        content: 'Our new denim collection features 100% organic cotton and non-toxic dyeing technology...',
        excerpt: 'Our new denim collection features 100% organic cotton and non-toxic dyeing technology...',
        image: '/uploads/images/news/post_1.jpg',
        slug: 'eco-friendly-denim',
        publishDate: '2025-03-15',
        isPublished: true,
        isFeatured: false
      },
      {
        title: 'GRAND OPENING OF SAIGON 3 JEAN CAMPUS',
        content: 'The company just began operations at the end of 2018. It was built on a 5-hectare campus...',
        excerpt: 'It was built on a 5-hectare campus with a construction floor area of over 51,000m².',
        image: '/uploads/images/news/post_3.jpg',
        slug: 'grand-opening-campus',
        publishDate: '2025-02-01',
        isPublished: true,
        isFeatured: false
      },
      {
        title: 'PARTNERING WITH GLOBAL BRANDS FOR SUSTAINABLE GROWTH',
        content: 'We collaborate with world-renowned brands to lead the green garment movement.',
        excerpt: 'We collaborate with world-renowned brands to lead the green garment movement.',
        image: '/uploads/images/news/post_4.png',
        slug: 'partnering-sustainable-growth',
        publishDate: '2025-01-01',
        isPublished: true,
        isFeatured: false
      }
    ]);
    console.log('✅ News data seeded');

    console.log('✅ All home data seed completed successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    mongoose.disconnect();
    process.exit(1);
  }
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
  }
}

// Thêm dòng này vào mảng seedFunctions
seedFunctions.push(seedNewsData);

seed();
