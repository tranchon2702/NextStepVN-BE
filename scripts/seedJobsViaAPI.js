// Seed jobs via API
const axios = require('axios');

const API_URL = 'http://localhost:5001/api/careers/jobs';

const jobs = [
  // CƠ KHÍ
  {
    jobCode: 'KSD_1',
    title: 'Kỹ sư thiết kế cơ khí sản phẩm mềm Catia V5',
    category: 'CƠ KHÍ',
    location: 'Shizuoka-ken, Nhật Bản',
    workType: 'Full-time',
    description: 'Thiết kế các sản phẩm mềm cho dây truyền sản xuất tự động sử dụng phần mềm Catia V5',
    requirements: [
      'Tốt nghiệp đại học chuyên ngành Cơ khí',
      'Có kinh nghiệm sử dụng Catia V5 tối thiểu 2 năm',
      'Có kinh nghiệm thiết kế mạch điện',
      'Tiếng Nhật N3 trở lên hoặc có khả năng giao tiếp cơ bản'
    ],
    benefits: [
      'Bảo hiểm y tế, xã hội đầy đủ',
      'Hỗ trợ nhà ở',
      'Xe đưa đón',
      'Tăng lương định kỳ'
    ],
    salary: {
      min: 300000,
      max: 450000,
      currency: '¥'
    },
    language: 'Tiếng Nhật N3 trở lên',
    recruitmentStatus: 'Đang tuyển',
    isActive: true
  },
  {
    jobCode: 'KSX_2',
    title: 'Kỹ sư cơ khí sản xuất',
    category: 'CƠ KHÍ',
    location: 'Tokyo, Nhật Bản',
    workType: 'Full-time',
    description: 'Quản lý và giám sát quy trình sản xuất cơ khí',
    requirements: [
      'Tốt nghiệp đại học Cơ khí',
      'Có kinh nghiệm 2 năm'
    ],
    salary: {
      min: 280000,
      max: 420000,
      currency: '¥'
    },
    language: 'Tiếng Nhật N2',
    recruitmentStatus: 'Đang tuyển',
    isActive: true
  },
  // Ô TÔ
  {
    jobCode: 'OTO_1',
    title: 'Kỹ sư thiết kế chi tiết ô tô',
    category: 'Ô TÔ',
    location: 'Shizuoka-ken, Nhật Bản',
    workType: 'Full-time',
    description: 'Thiết kế chi tiết các bộ phận ô tô',
    requirements: [
      'Tốt nghiệp đại học Ô tô hoặc Cơ khí',
      'Tiếng Nhật N3'
    ],
    salary: {
      min: 320000,
      max: 480000,
      currency: '¥'
    },
    recruitmentStatus: 'Đang tuyển',
    isActive: true
  }
];

async function seedViaAPI() {
  console.log('🚀 Starting seed via API...');
  
  for (const job of jobs) {
    try {
      const response = await axios.post(API_URL, job);
      if (response.data.success) {
        console.log(`✅ Created: ${job.jobCode} - ${job.title}`);
      }
    } catch (error) {
      console.error(`❌ Failed to create ${job.jobCode}:`, error.response?.data?.message || error.message);
    }
  }
  
  console.log('\n✅ Seed completed!');
}

seedViaAPI();













