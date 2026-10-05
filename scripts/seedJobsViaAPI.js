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
  {
    jobCode: 'KSB_3',
    title: 'Kỹ sư bảo trì máy móc công nghiệp',
    category: 'CƠ KHÍ',
    location: 'Osaka, Nhật Bản',
    workType: 'Full-time',
    description: 'Bảo trì và sửa chữa máy móc công nghiệp',
    requirements: [
      'Tốt nghiệp đại học Cơ khí hoặc Điện',
      'Có kinh nghiệm bảo trì máy móc',
      'Tiếng Nhật N3'
    ],
    salary: {
      min: 290000,
      max: 430000,
      currency: '¥'
    },
    language: 'Tiếng Nhật N3',
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
  },
  {
    jobCode: 'OTO_2',
    title: 'Kỹ sư phát triển hệ thống phanh ô tô',
    category: 'Ô TÔ',
    location: 'Aichi, Nhật Bản',
    workType: 'Full-time',
    description: 'Nghiên cứu và phát triển hệ thống phanh hiện đại cho ô tô',
    requirements: [
      'Tốt nghiệp đại học Ô tô hoặc Cơ khí',
      'Có kinh nghiệm thiết kế hệ thống phanh',
      'Tiếng Nhật N2 trở lên'
    ],
    salary: {
      min: 350000,
      max: 500000,
      currency: '¥'
    },
    language: 'Tiếng Nhật N2',
    recruitmentStatus: 'Đang tuyển',
    isActive: true
  },
  {
    jobCode: 'OTO_3',
    title: 'Kỹ sư kiểm định chất lượng ô tô',
    category: 'Ô TÔ',
    location: 'Kanagawa, Nhật Bản',
    workType: 'Full-time',
    description: 'Kiểm định và đảm bảo chất lượng sản phẩm ô tô',
    requirements: [
      'Tốt nghiệp đại học Ô tô hoặc Kỹ thuật',
      'Có kinh nghiệm kiểm định chất lượng',
      'Tiếng Nhật N3'
    ],
    salary: {
      min: 310000,
      max: 460000,
      currency: '¥'
    },
    language: 'Tiếng Nhật N3',
    recruitmentStatus: 'Đang tuyển',
    isActive: true
  },
  // ĐIỆN, ĐIỆN TỬ
  {
    jobCode: 'DTT_1',
    title: 'Kỹ sư thiết kế mạch điện tử',
    category: 'ĐIỆN, ĐIỆN TỬ',
    location: 'Tokyo, Nhật Bản',
    workType: 'Full-time',
    description: 'Thiết kế và phát triển mạch điện tử cho thiết bị công nghiệp',
    requirements: [
      'Tốt nghiệp đại học Điện, Điện tử',
      'Có kinh nghiệm thiết kế mạch',
      'Tiếng Nhật N3'
    ],
    salary: {
      min: 300000,
      max: 450000,
      currency: '¥'
    },
    language: 'Tiếng Nhật N3',
    recruitmentStatus: 'Đang tuyển',
    isActive: true
  },
  {
    jobCode: 'DTT_2',
    title: 'Kỹ sư tự động hóa hệ thống',
    category: 'ĐIỆN, ĐIỆN TỬ',
    location: 'Osaka, Nhật Bản',
    workType: 'Full-time',
    description: 'Thiết kế và lập trình hệ thống tự động hóa',
    requirements: [
      'Tốt nghiệp đại học Điện, Điện tử hoặc Tự động hóa',
      'Có kinh nghiệm lập trình PLC',
      'Tiếng Nhật N2'
    ],
    salary: {
      min: 320000,
      max: 470000,
      currency: '¥'
    },
    language: 'Tiếng Nhật N2',
    recruitmentStatus: 'Đang tuyển',
    isActive: true
  },
  // IT
  {
    jobCode: 'IT_1',
    title: 'Lập trình viên Python',
    category: 'IT',
    location: 'Tokyo, Nhật Bản',
    workType: 'Full-time',
    description: 'Phát triển ứng dụng web và hệ thống backend sử dụng Python',
    requirements: [
      'Tốt nghiệp đại học Công nghệ thông tin',
      'Có kinh nghiệm Python, Django/FastAPI',
      'Tiếng Nhật N3 trở lên'
    ],
    salary: {
      min: 350000,
      max: 550000,
      currency: '¥'
    },
    language: 'Tiếng Nhật N3',
    recruitmentStatus: 'Đang tuyển',
    isActive: true
  },
  {
    jobCode: 'IT_2',
    title: 'Frontend Developer React',
    category: 'IT',
    location: 'Tokyo, Nhật Bản',
    workType: 'Full-time',
    description: 'Phát triển giao diện người dùng sử dụng React',
    requirements: [
      'Tốt nghiệp đại học Công nghệ thông tin',
      'Có kinh nghiệm React, TypeScript',
      'Tiếng Nhật N3'
    ],
    salary: {
      min: 340000,
      max: 520000,
      currency: '¥'
    },
    language: 'Tiếng Nhật N3',
    recruitmentStatus: 'Đang tuyển',
    isActive: true
  },
  {
    jobCode: 'IT_3',
    title: 'DevOps Engineer',
    category: 'IT',
    location: 'Osaka, Nhật Bản',
    workType: 'Full-time',
    description: 'Quản lý và vận hành hệ thống cloud, CI/CD',
    requirements: [
      'Tốt nghiệp đại học Công nghệ thông tin',
      'Có kinh nghiệm AWS, Docker, Kubernetes',
      'Tiếng Nhật N2'
    ],
    salary: {
      min: 380000,
      max: 580000,
      currency: '¥'
    },
    language: 'Tiếng Nhật N2',
    recruitmentStatus: 'Đang tuyển',
    isActive: true
  },
  // XÂY DỰNG
  {
    jobCode: 'XD_1',
    title: 'Kỹ sư thiết kế kết cấu xây dựng',
    category: 'XÂY DỰNG',
    location: 'Tokyo, Nhật Bản',
    workType: 'Full-time',
    description: 'Thiết kế kết cấu cho các công trình xây dựng',
    requirements: [
      'Tốt nghiệp đại học Xây dựng',
      'Có kinh nghiệm thiết kế kết cấu',
      'Tiếng Nhật N3'
    ],
    salary: {
      min: 320000,
      max: 480000,
      currency: '¥'
    },
    language: 'Tiếng Nhật N3',
    recruitmentStatus: 'Đang tuyển',
    isActive: true
  },
  {
    jobCode: 'XD_2',
    title: 'Kỹ sư giám sát thi công',
    category: 'XÂY DỰNG',
    location: 'Osaka, Nhật Bản',
    workType: 'Full-time',
    description: 'Giám sát và quản lý thi công công trình',
    requirements: [
      'Tốt nghiệp đại học Xây dựng',
      'Có kinh nghiệm giám sát thi công',
      'Tiếng Nhật N2'
    ],
    salary: {
      min: 310000,
      max: 460000,
      currency: '¥'
    },
    language: 'Tiếng Nhật N2',
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



















