const mongoose = require('mongoose');
const RecruiterCategory = require('../models/RecruiterCategory');
require('dotenv').config();

// Data từ trang forRecruiters hiện tại
const categoriesData = [
  {
    categoryId: 'auto',
    name: 'Kỹ sư Ô tô',
    nameJa: '自動車エンジニア',
    icon: 'fas fa-car',
    description: 'Thiết kế – sản xuất – QA/QC linh kiện/xe hoàn chỉnh theo tiêu chuẩn Nhật.',
    descriptionJa: '日本基準に基づく部品/完成車の設計・製造・QA/QC',
    details: 'Thành thạo CAD/CAE (CATIA, NX, SolidWorks), hiểu JIS, APQP/PPAP; kinh nghiệm lắp ráp, thử nghiệm, quản lý chất lượng chuỗi cung ứng.',
    detailsJa: 'CAD/CAE（CATIA、NX、SolidWorks）に精通、JIS、APQP/PPAPを理解。組立、試験、サプライチェーン品質管理の経験あり。',
    requirements: 'Ưu tiên JLPT N2–N3, sẵn sàng làm việc tại Nhật; có thể onboard trong 2–4 tuần.',
    requirementsJa: 'JLPT N2-N3を優先。日本での就労準備ができており、2-4週間以内に入社可能な方。',
    color: '#dc2626',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop',
    order: 1,
    isActive: true
  },
  {
    categoryId: 'mechanical',
    name: 'Kỹ sư Cơ khí',
    nameJa: '機械エンジニア',
    icon: 'fas fa-cogs',
    description: 'Thiết kế máy, jig/fixture, khuôn – tự động hóa và tối ưu hóa sản xuất.',
    descriptionJa: '機械設計、ジグ/治具、金型設計。自動化と生産最適化。',
    details: 'SolidWorks/Inventor/AutoCAD, tính bền – dung sai, BOM/BoP, FMEA; đã triển khai dự án tại nhà máy quy mô vừa & lớn.',
    detailsJa: 'SolidWorks/Inventor/AutoCAD、強度計算・公差、BOM/BoP、FMEA。中規模・大規模工場でのプロジェクト実装経験あり。',
    requirements: 'JLPT N2 trở lên là lợi thế; kỹ năng giao tiếp nhóm, báo cáo kỹ thuật tiếng Nhật/Anh tốt.',
    requirementsJa: 'JLPT N2以上が有利。チームコミュニケーション能力、日本語/英語での技術報告スキルが優れている方。',
    color: '#991b1b',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
    order: 2,
    isActive: true
  },
  {
    categoryId: 'construction',
    name: 'Kỹ sư Xây dựng',
    nameJa: '建設エンジニア',
    icon: 'fas fa-hard-hat',
    description: 'Thiết kế – giám sát – quản lý tiến độ & chất lượng công trình dân dụng/nhà xưởng.',
    descriptionJa: '土木/工場建設プロジェクトの設計・監理・工程・品質管理',
    details: 'AutoCAD/Revit, kiểm soát khối lượng, hồ sơ nghiệm thu, an toàn lao động; kinh nghiệm phối hợp MEP và nhà thầu phụ.',
    detailsJa: 'AutoCAD/Revit、数量管理、受入書類、労働安全。MEPおよび下請け業者との調整経験あり。',
    requirements: 'Ưu tiên có chứng chỉ hành nghề; JLPT N3+, sẵn sàng công tác/đi công trường dài ngày.',
    requirementsJa: '資格保有者を優先。JLPT N3以上、長期出張・現場勤務可能な方。',
    color: '#dc2626',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop',
    order: 3,
    isActive: true
  },
  {
    categoryId: 'electrical',
    name: 'Kỹ sư Điện – Điện tử',
    nameJa: '電気・電子エンジニア',
    icon: 'fas fa-bolt',
    description: 'Thiết kế mạch – tủ điện – PLC/SCADA – nhúng/IoT cho công nghiệp.',
    descriptionJa: '回路設計・電気盤・PLC/SCADA・組込み/IoTの産業向け設計',
    details: 'PLC (Mitsubishi/Omron/Siemens), HMI, P&ID, EMC/ESD; thiết kế PCB, vi điều khiển (STM32/ESP), chuẩn hóa an toàn điện.',
    detailsJa: 'PLC（三菱/オムロン/シーメンス）、HMI、P&ID、EMC/ESD。PCB設計、マイコン（STM32/ESP）、電気安全規格対応。',
    requirements: 'JLPT N2–N3; ưu tiên có chứng chỉ an toàn điện, kinh nghiệm commissioning tại nhà máy Nhật.',
    requirementsJa: 'JLPT N2-N3。電気安全資格保有者を優先。日本の工場での試運転経験あり。',
    color: '#991b1b',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop',
    order: 4,
    isActive: true
  },
  {
    categoryId: 'it',
    name: 'Kỹ sư IT',
    nameJa: 'ITエンジニア',
    icon: 'fas fa-laptop-code',
    description: 'Phát triển Web/Mobile, hệ thống doanh nghiệp và giải pháp Cloud/AI.',
    descriptionJa: 'Web/Mobile開発、エンタープライズシステム、Cloud/AIソリューション',
    details: 'Java/.NET/Node.js, React/Vue, SQL/NoSQL; CI/CD, Docker/K8s, AWS/Azure/GCP; quy trình Agile/Scrum, code review chuẩn.',
    detailsJa: 'Java/.NET/Node.js、React/Vue、SQL/NoSQL。CI/CD、Docker/K8s、AWS/Azure/GCP。Agile/Scrumプロセス、コードレビュー標準。',
    requirements: 'JLPT N2+ cho onsite; tiếng Nhật giao tiếp dự án; có kinh nghiệm offshore/BrSE là lợi thế mạnh.',
    requirementsJa: 'オンプレミスはJLPT N2以上。プロジェクトコミュニケーション日本語。オフショア/BrSE経験は強み。',
    color: '#dc2626',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
    order: 5,
    isActive: true
  }
];

async function seedRecruiterCategories() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/saigon3jean';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing categories (optional - comment out if you want to keep existing data)
    // await RecruiterCategory.deleteMany({});
    // console.log('✅ Cleared existing categories');

    // Insert categories
    for (const categoryData of categoriesData) {
      // Check if category already exists
      const existing = await RecruiterCategory.findOne({ categoryId: categoryData.categoryId });
      
      if (existing) {
        console.log(`⚠️  Category "${categoryData.categoryId}" already exists, skipping...`);
        // Update existing category
        await RecruiterCategory.findByIdAndUpdate(existing._id, categoryData, { new: true });
        console.log(`✅ Updated category "${categoryData.categoryId}"`);
      } else {
        const category = new RecruiterCategory(categoryData);
        await category.save();
        console.log(`✅ Created category "${categoryData.categoryId}"`);
      }
    }

    console.log('\n✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
}

// Run seed
seedRecruiterCategories();



