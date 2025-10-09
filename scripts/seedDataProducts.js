const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('../models/Products');

// const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saigon3jean';
const MONGO_URI = 'mongodb://localhost:27017/saigon3jean';

async function seedProducts() {
  await mongoose.connect(MONGO_URI);
  console.log('🔗 Connected to MongoDB');

  await Product.deleteMany({});
  console.log('🧹 Cleared old product data');

  const applicationImages = [
    { url: '/uploads/images/product-page/knit_1.png', alt: 'Application Image 1', order: 1 },
    { url: '/uploads/images/product-page/knit_1.png', alt: 'Application Image 2', order: 2 },
    { url: '/uploads/images/product-page/knit_1.png', alt: 'Application Image 3', order: 3 }
  ];

  await Product.create([
    {
      name: 'DENIM',
      slug: 'denim',
      description: 'High-quality denim products with advanced fabric technology.',
      mainImage: '/uploads/images/product-page/denim_main.jpg',
      mainImageAlt: 'Denim Main Image',
      order: 1,
      carouselSettings: {
        interval: 3000,
        autoplay: true,
        showIndicators: true,
        showControls: false
      },
      galleryImages: [
        { url: '/uploads/images/product-page/denim_1.png', alt: 'Denim Gallery 1', order: 1 },
        { url: '/uploads/images/product-page/denim_2.png', alt: 'Denim Gallery 2', order: 2 },
        { url: '/uploads/images/product-page/denim_3.png', alt: 'Denim Gallery 3', order: 3 }
      ],
      features: [
        { icon: 'fas fa-cogs', text: 'Advanced stitching technology', order: 1 },
        { icon: 'fas fa-leaf', text: 'Eco-friendly materials', order: 2 },
        { icon: 'fas fa-tachometer-alt', text: 'Fast production cycles', order: 3 },
        { icon: 'fas fa-shield-alt', text: 'Durability and performance', order: 4 }
      ],
      applications: [
        {
          title: 'Urban Wear',
          order: 1,
          isActive: true,
          content: {
            heading: 'Urban Denim Fashion',
            description: 'Designed for modern street style with durability.',
            features: ['Breathable material', 'Fade-resistant', 'Durable seams'],
            image: '/uploads/images/product-page/knit_1.png',
            imageAlt: 'Urban Denim',
            images: applicationImages
          }
        },
        {
          title: 'Workwear Applications',
          order: 2,
          isActive: true,
          content: {
            heading: 'Durable Denim for Workwear',
            description: 'Engineered for strength and flexibility in demanding work environments.',
            features: ['Reinforced stitching', 'Comfort-fit design', 'Heavy-duty fabric'],
            image: '/uploads/images/product-page/knit_1.png',
            imageAlt: 'Workwear Denim',
            images: applicationImages
          }
        }
      ],
      seo: {
        metaTitle: 'Denim Products - Saigon 3 Jean',
        metaDescription: 'Explore high-quality denim products made with eco-friendly materials and modern technology.',
        keywords: ['denim', 'jeans', 'eco-friendly', 'durable', 'streetwear', 'workwear']
      },
      isActive: true,
      isFeatured: true
    },
    {
      name: 'KNIT',
      slug: 'knit',
      description: 'Premium knit fabrics crafted with cutting-edge circular knitting technology.',
      mainImage: '/uploads/images/product-page/knit_main.jpg',
      mainImageAlt: 'Knit Main Image',
      order: 2,
      carouselSettings: {
        interval: 3500,
        autoplay: true,
        showIndicators: false,
        showControls: true
      },
      galleryImages: [
        { url: '/uploads/images/product-page/knit_1.png', alt: 'Knit Gallery 1', order: 1 },
        { url: '/uploads/images/product-page/knit_2.png', alt: 'Knit Gallery 2', order: 2 },
        { url: '/uploads/images/product-page/knit_3.png', alt: 'Knit Gallery 3', order: 3 }
      ],
      features: [
        { icon: 'fas fa-tshirt', text: 'Superior elasticity and comfort', order: 1 },
        { icon: 'fas fa-recycle', text: 'Sustainable fiber usage', order: 2 }
      ],
      applications: [
        {
          title: 'Athleisure Wear',
          order: 1,
          isActive: true,
          content: {
            heading: 'Comfort for Movement',
            description: 'Knit fabrics ideal for performance and leisure, supporting active lifestyles.',
            features: ['Four-way stretch', 'Soft touch', 'Moisture-wicking'],
            image: '/uploads/images/product-page/knit_1.png',
            imageAlt: 'Athleisure Knit',
            images: applicationImages
          }
        }
      ],
      seo: {
        metaTitle: 'Knit Products - Saigon 3 Jean',
        metaDescription: 'Explore comfortable and sustainable knitwear from Saigon 3 Jean.',
        keywords: ['knit', 'athleisure', 'stretch fabric', 'sustainable knit']
      },
      isActive: true,
      isFeatured: false
    },
    {
      name: 'WOVEN',
      slug: 'woven',
      description: 'Woven fabric garments combining structure, strength, and style.',
      mainImage: '/uploads/images/product-page/woven_main.jpg',
      mainImageAlt: 'Woven Main Image',
      order: 3,
      carouselSettings: {
        interval: 4000,
        autoplay: true,
        showIndicators: true,
        showControls: true
      },
      galleryImages: [
        { url: '/uploads/images/product-page/woven_1.png', alt: 'Woven Gallery 1', order: 1 },
        { url: '/uploads/images/product-page/woven_2.png', alt: 'Woven Gallery 2', order: 2 },
        { url: '/uploads/images/product-page/woven_3.png', alt: 'Woven Gallery 3', order: 3 }
      ],
      features: [
        { icon: 'fas fa-ruler-combined', text: 'Structured tailoring', order: 1 },
        { icon: 'fas fa-bolt', text: 'Durable yarn blends', order: 2 }
      ],
      applications: [
        {
          title: 'Formal Wear',
          order: 1,
          isActive: true,
          content: {
            heading: 'Stylish Woven Fabrics for Formal Wear',
            description: 'Perfect for shirts, blazers, and trousers with excellent shape retention.',
            features: ['Crisp finish', 'Wrinkle resistance', 'Tailored fit'],
            image: '/uploads/images/product-page/knit_1.png',
            imageAlt: 'Formal Woven',
            images: applicationImages
          }
        }
      ],
      seo: {
        metaTitle: 'Woven Products - Saigon 3 Jean',
        metaDescription: 'Explore durable and stylish woven garments by Saigon 3 Jean.',
        keywords: ['woven', 'formal wear', 'durable fabric', 'tailored clothing']
      },
      isActive: true,
      isFeatured: false
    }
  ]);

  console.log('✅ Product seed completed');
  await mongoose.disconnect();
}

seedProducts();
