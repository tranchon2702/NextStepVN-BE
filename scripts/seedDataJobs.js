const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const { Job, CompanyInfo, ContactHR } = require('../models/Careers');

const MONGO_URI = 'mongodb://localhost:27017/saigon3jean';

async function seedJobs() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('📦 Connected to MongoDB');

    // Xóa tất cả jobs cũ
    await Job.deleteMany({});
    console.log('✅ Cleared old jobs');

    // Seed jobs mới với đầy đủ thông tin
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
          currency: '¥',
          note: 'Tùy theo năng lực và kinh nghiệm'
        },
        bonus: 'Thưởng theo hiệu suất công việc',
        allowance: 'Trợ cấp nhà ở, đi lại',
        otherBenefits: 'Hỗ trợ chi phí học tiếng Nhật, du lịch hàng năm',
        major: 'Kỹ thuật cơ khí',
        age: {
          min: 22,
          max: 35
        },
        experience: 'Có kinh nghiệm thiết kế mạch điện',
        language: 'Tiếng Nhật N3 trở lên hoặc có khả năng giao tiếp cơ bản',
        overtime: 'Có thể có overtime trong cao điểm',
        offTime: 'Thứ 7, Chủ nhật và các ngày lễ',
        interviewFormat: 'Online hoặc trực tiếp tại Việt Nam',
        interviewTime: 'Linh hoạt theo lịch ứng viên',
        otherInfo: 'Công ty hỗ trợ visa và chi phí sang Nhật',
        assignedTo: 'Đang cập nhật',
        recruitmentStatus: 'Đang tuyển',
        isActive: true,
        isFeatured: true,
        order: 1
      },
      {
        jobCode: 'KSX_2',
        title: 'Kỹ sư cơ khí sản xuất',
        category: 'CƠ KHÍ',
        location: 'Tokyo, Nhật Bản',
        workType: 'Full-time',
        description: 'Quản lý và giám sát quy trình sản xuất cơ khí, đảm bảo chất lượng sản phẩm',
        requirements: [
          'Tốt nghiệp đại học Cơ khí',
          'Có kinh nghiệm 2 năm trong sản xuất',
          'Tiếng Nhật N2'
        ],
        benefits: [
          'Lương cạnh tranh',
          'Bảo hiểm đầy đủ',
          'Thưởng cuối năm'
        ],
        salary: {
          min: 280000,
          max: 420000,
          currency: '¥'
        },
        major: 'Cơ khí',
        age: {
          min: 24,
          max: 40
        },
        language: 'Tiếng Nhật N2',
        recruitmentStatus: 'Đang tuyển',
        isActive: true,
        order: 2
      },

      // Ô TÔ
      {
        jobCode: 'OTO_1',
        title: 'Kỹ sư thiết kế chi tiết ô tô',
        category: 'Ô TÔ',
        location: 'Shizuoka-ken, Nhật Bản',
        workType: 'Full-time',
        description: 'Thiết kế chi tiết các bộ phận ô tô sử dụng phần mềm CAD',
        requirements: [
          'Tốt nghiệp đại học chuyên ngành Ô tô hoặc Cơ khí',
          'Có kinh nghiệm thiết kế ô tô',
          'Tiếng Nhật N3 trở lên'
        ],
        benefits: [
          'Bảo hiểm đầy đủ',
          'Hỗ trợ nhà ở',
          'Du lịch hàng năm'
        ],
        salary: {
          min: 320000,
          max: 480000,
          currency: '¥'
        },
        major: 'Ô tô / Cơ khí',
        age: {
          min: 23,
          max: 38
        },
        language: 'Tiếng Nhật N3 trở lên',
        recruitmentStatus: 'Đang tuyển',
        isActive: true,
        order: 3
      },
      {
        jobCode: 'RD_OTO_1',
        title: 'Kỹ sư R&D Ô tô',
        category: 'Ô TÔ',
        location: 'Yokohama, Nhật Bản',
        workType: 'Full-time',
        description: 'Nghiên cứu và phát triển công nghệ ô tô mới, xe điện',
        requirements: [
          'Thạc sĩ Cơ khí hoặc Ô tô',
          'Có kinh nghiệm R&D',
          'Tiếng Nhật N2 hoặc tiếng Anh tốt'
        ],
        benefits: [
          'Môi trường làm việc hiện đại',
          'Cơ hội phát triển nghề nghiệp',
          'Lương thưởng hấp dẫn'
        ],
        salary: {
          min: 350000,
          max: 500000,
          currency: '¥'
        },
        major: 'Cơ khí / Ô tô',
        age: {
          min: 25,
          max: 40
        },
        language: 'Tiếng Nhật N2 hoặc tiếng Anh tốt',
        recruitmentStatus: 'Đang tuyển',
        isActive: true,
        order: 4
      },

      // ĐIỆN - ĐIỆN TỬ
      {
        jobCode: 'DIEN_1',
        title: 'Kỹ sư điện tử công nghiệp',
        category: 'ĐIỆN, ĐIỆN TỬ',
        location: 'Osaka, Nhật Bản',
        workType: 'Full-time',
        description: 'Thiết kế và bảo trì hệ thống điện tử công nghiệp',
        requirements: [
          'Tốt nghiệp đại học Điện - Điện tử',
          'Có kinh nghiệm làm việc với PLC',
          'Tiếng Nhật N3'
        ],
        benefits: [
          'Bảo hiểm y tế, xã hội',
          'Thưởng theo hiệu suất',
          'Hỗ trợ đào tạo'
        ],
        salary: {
          min: 290000,
          max: 430000,
          currency: '¥'
        },
        major: 'Điện - Điện tử',
        age: {
          min: 22,
          max: 35
        },
        language: 'Tiếng Nhật N3',
        recruitmentStatus: 'Đang tuyển',
        isActive: true,
        order: 5
      },
      {
        jobCode: 'IOT_1',
        title: 'Kỹ sư IoT và tự động hóa',
        category: 'ĐIỆN, ĐIỆN TỬ',
        location: 'Nagoya, Nhật Bản',
        workType: 'Full-time',
        description: 'Phát triển giải pháp IoT cho nhà máy thông minh',
        requirements: [
          'Tốt nghiệp đại học Điện tử hoặc IT',
          'Có kinh nghiệm về IoT, sensors',
          'Tiếng Nhật N2'
        ],
        benefits: [
          'Môi trường công nghệ cao',
          'Đào tạo chuyên sâu',
          'Cơ hội thăng tiến'
        ],
        salary: {
          min: 330000,
          max: 470000,
          currency: '¥'
        },
        major: 'Điện tử / IT',
        age: {
          min: 24,
          max: 38
        },
        language: 'Tiếng Nhật N2',
        recruitmentStatus: 'Đang tuyển',
        isActive: true,
        order: 6
      },

      // IT
      {
        jobCode: 'DEV_1',
        title: 'Full Stack Developer',
        category: 'IT',
        location: 'Tokyo, Nhật Bản',
        workType: 'Full-time',
        description: 'Phát triển web application sử dụng React, Node.js',
        requirements: [
          'Tốt nghiệp đại học CNTT',
          'Thành thạo React, Node.js',
          'Tiếng Nhật N3 hoặc tiếng Anh tốt'
        ],
        benefits: [
          'Làm việc tại công ty IT hàng đầu',
          'Lương cao, thưởng hấp dẫn',
          'Work-life balance tốt'
        ],
        salary: {
          min: 350000,
          max: 550000,
          currency: '¥'
        },
        major: 'Công nghệ thông tin',
        age: {
          min: 22,
          max: 35
        },
        language: 'Tiếng Nhật N3 hoặc tiếng Anh tốt',
        recruitmentStatus: 'Đang tuyển',
        isActive: true,
        order: 7
      },
      {
        jobCode: 'AI_1',
        title: 'AI Engineer',
        category: 'IT',
        location: 'Tokyo, Nhật Bản',
        workType: 'Full-time',
        description: 'Phát triển giải pháp AI/ML cho các dự án công nghiệp',
        requirements: [
          'Thạc sĩ CNTT hoặc AI',
          'Kinh nghiệm Python, TensorFlow',
          'Tiếng Anh tốt'
        ],
        benefits: [
          'Môi trường làm việc quốc tế',
          'Package lương cao',
          'Cơ hội nghiên cứu'
        ],
        salary: {
          min: 400000,
          max: 600000,
          currency: '¥'
        },
        major: 'CNTT / AI',
        age: {
          min: 24,
          max: 40
        },
        language: 'Tiếng Anh tốt',
        recruitmentStatus: 'Đang tuyển',
        isActive: true,
        order: 8
      },

      // XÂY DỰNG
      {
        jobCode: 'XD_1',
        title: 'Kỹ sư xây dựng dân dụng',
        category: 'XÂY DỰNG',
        location: 'Saitama, Nhật Bản',
        workType: 'Full-time',
        description: 'Thiết kế và giám sát thi công các công trình dân dụng',
        requirements: [
          'Tốt nghiệp đại học Xây dựng',
          'Có kinh nghiệm 2 năm',
          'Tiếng Nhật N3'
        ],
        benefits: [
          'Bảo hiểm đầy đủ',
          'Thưởng dự án',
          'Hỗ trợ ở lại lâu dài'
        ],
        salary: {
          min: 300000,
          max: 450000,
          currency: '¥'
        },
        major: 'Xây dựng',
        age: {
          min: 24,
          max: 40
        },
        language: 'Tiếng Nhật N3',
        recruitmentStatus: 'Đang tuyển',
        isActive: true,
        order: 9
      },
      {
        jobCode: 'XD_2',
        title: 'Kỹ sư cầu đường',
        category: 'XÂY DỰNG',
        location: 'Kanagawa, Nhật Bản',
        workType: 'Full-time',
        description: 'Thiết kế và thi công cầu đường, hạ tầng giao thông',
        requirements: [
          'Tốt nghiệp đại học Xây dựng / Cầu đường',
          'Có kinh nghiệm về cầu đường',
          'Tiếng Nhật N2'
        ],
        benefits: [
          'Lương cao',
          'Dự án lớn',
          'Học hỏi công nghệ tiên tiến'
        ],
        salary: {
          min: 330000,
          max: 480000,
          currency: '¥'
        },
        major: 'Xây dựng / Cầu đường',
        age: {
          min: 25,
          max: 42
        },
        language: 'Tiếng Nhật N2',
        recruitmentStatus: 'Đang tuyển',
        isActive: true,
        order: 10
      },

      // Thêm một số job "Ngưng tuyển" và "Đã đóng"
      {
        jobCode: 'TEST_1',
        title: 'Quality Control Specialist',
        category: 'CƠ KHÍ',
        location: 'Ho Chi Minh City, Vietnam',
        workType: 'Full-time',
        description: 'Kiểm soát chất lượng sản phẩm cơ khí',
        requirements: [
          'Tốt nghiệp đại học',
          'Có kinh nghiệm QC'
        ],
        salary: {
          min: 250000,
          max: 350000,
          currency: '¥'
        },
        recruitmentStatus: 'Ngưng tuyển',
        isActive: true,
        order: 11
      },
      {
        jobCode: 'OLD_1',
        title: 'Senior Textile Engineer',
        category: 'CƠ KHÍ',
        location: 'Dong Nai, Vietnam',
        workType: 'Full-time',
        description: 'Kỹ sư dệt may cao cấp',
        requirements: [
          'Nhiều năm kinh nghiệm'
        ],
        salary: {
          min: 300000,
          max: 400000,
          currency: '¥'
        },
        recruitmentStatus: 'Đã đóng',
        isActive: false,
        order: 12
      }
    ];

    // Tạo jobs
    const createdJobs = await Job.insertMany(jobs);
    console.log(`✅ Created ${createdJobs.length} jobs successfully!`);

    // Hiển thị tổng hợp theo category
    const summary = await Job.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📊 Jobs by category:');
    summary.forEach(({ _id, count }) => {
      console.log(`   ${_id}: ${count} jobs`);
    });

    // Hiển thị tổng hợp theo trạng thái
    const statusSummary = await Job.aggregate([
      { $group: { _id: '$recruitmentStatus', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📊 Jobs by status:');
    statusSummary.forEach(({ _id, count }) => {
      console.log(`   ${_id}: ${count} jobs`);
    });

    console.log('\n✅ Seed completed successfully!');

    await mongoose.connection.close();
    console.log('🔒 Database connection closed');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

// Run seed
seedJobs();

