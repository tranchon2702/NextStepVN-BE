/*
 * Seed "Careers" – đầy đủ & nhiều dữ liệu
 * --------------------------------------
 * 1. Xóa sạch dữ liệu cũ
 * 2. Tạo CompanyInfo, ContactHR
 * 3. Tạo 12 Job đa dạng (4 featured, 2 inactive)
 * 4. Tạo 8 đơn ứng tuyển mẫu cho 3 job đầu
 */

const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

const {
  CompanyInfo,
  ContactHR,
  Job,
  JobApplication,
} = require('../models/Careers');   // chỉnh path nếu cần

// const MONGO_URI =
//   process.env.MONGODB_URI || 'mongodb://localhost:27017/saigon3jean';
  const MONGO_URI = 'mongodb://localhost:27017/saigon3jean';
// -----------------------------------------------------------------------------
// Helper
// -----------------------------------------------------------------------------
function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

async function seedCareers() {
  await mongoose.connect(MONGO_URI);
  console.log('🔗  Đã kết nối MongoDB');

  /* ---------------------------- 1. CLEAR OLD ------------------------------- */
  await Promise.all([
    CompanyInfo.deleteMany({}),
    ContactHR.deleteMany({}),
    Job.deleteMany({}),
    JobApplication.deleteMany({}),
  ]);
  console.log('🧹  Đã xoá dữ liệu Careers cũ');

  /* --------------------------- 2. COMPANY INFO ----------------------------- */
  await CompanyInfo.create({
    logo: '/uploads/images/sg3jeans_logo.png',
    title: 'ABOUT SAIGON 3 JEAN',
    description: [
      'Saigon 3 Jean was established with a vision of sustainable development, harnessing internal strengths and advanced technologies to adapt flexibly to economic fluctuations.',
      'As an industry-leading garment-finishing company, we constantly innovate, improve quality, and optimize technology for sustainable production.',
      'We believe people are the heart of our success, so we invest heavily in up-skilling and creating a green, friendly work environment.'
    ],
    stats: {
      employees:   { number: '1,500+',  label: 'Employees' },
      experience:  { number: '20+',    label: 'Years Experience' },
      partners:    { number: '100+',   label: 'Global Partners' },
      factories:   { number: '4',      label: 'Factories' },
      countries:   { number: '25',     label: 'Export Countries' },
      awards:      { number: '15',     label: 'Industry Awards' }
    }
  });

  /* ------------------------------ 3. CONTACT HR ---------------------------- */
  await ContactHR.create({
    title: 'CONTACT HR DEPARTMENT',
    description:
      'Have questions about opportunities at Saigon 3 Jean? Reach out – we are happy to help!',
    email: 'recruitment@saigon3jean.com',
    phone: '(+84) 28 3940 1234',
    submitResumeText: 'Submit Your Resume',
  });

  /* -------------------------------- 4. JOBS -------------------------------- */
  const jobsRaw = [
    // ----- FEATURED -----
    {
      title: 'Production Manager',
      location: 'Ho Chi Minh City, Vietnam',
      type: 'Full-time',
      featured: true,
    },
    {
      title: 'Quality Control Specialist',
      location: 'Ho Chi Minh City, Vietnam',
      type: 'Full-time',
      featured: true,
    },
    {
      title: 'Senior Textile Engineer',
      location: 'Dong Nai, Vietnam',
      type: 'Full-time',
      featured: true,
    },
    {
      title: 'Global Sales Director',
      location: 'Bangkok, Thailand',
      type: 'Full-time',
      featured: true,
    },
    // ----- ACTIVE (non-featured) -----
    {
      title: 'Merchandiser',
      location: 'Ho Chi Minh City, Vietnam',
      type: 'Full-time',
    },
    {
      title: 'Industrial Engineer (IE)',
      location: 'Binh Duong, Vietnam',
      type: 'Full-time',
    },
    {
      title: 'HR & Admin Officer',
      location: 'Ho Chi Minh City, Vietnam',
      type: 'Part-time',
    },
    {
      title: 'Garment Pattern Maker',
      location: 'Ho Chi Minh City, Vietnam',
      type: 'Contract',
    },
    {
      title: 'Sustainability Intern',
      location: 'Remote – VN',
      type: 'Internship',
    },
    {
      title: 'Graphic Designer',
      location: 'Ho Chi Minh City, Vietnam',
      type: 'Full-time',
    },
    // ----- INACTIVE (để test) -----
    {
      title: 'Logistics Coordinator',
      location: 'Ho Chi Minh City, Vietnam',
      type: 'Full-time',
      active: false,
    },
    {
      title: 'IT Support Technician',
      location: 'Ho Chi Minh City, Vietnam',
      type: 'Full-time',
      active: false,
    },
  ];

  // Mẫu mô tả / yêu cầu / benefit – dùng chung cho demo
  const commonDesc =
    'Join our dynamic team and contribute to our mission of delivering world-class denim products sustainably.';
  const commonReqs = [
    'Relevant degree or equivalent experience',
    'Strong communication & teamwork skills',
    'Passion for continuous improvement',
  ];
  const commonBenefits = [
    'Competitive salary & bonuses',
    'Health & accident insurance',
    'Annual leave + public holidays',
    'Modern, safe working environment',
  ];

  const jobDocs = [];

  for (let i = 0; i < jobsRaw.length; i++) {
    const jr = jobsRaw[i];
    jobDocs.push({
      title: jr.title,
      slug: toSlug(jr.title),
      type: jr.type,
      location: jr.location,
      description: commonDesc,
      requirements: commonReqs,
      benefits: commonBenefits,
      isFeatured: !!jr.featured,
      isActive: jr.active === false ? false : true,
      order: i + 1,
    });
  }

  const insertedJobs = await Job.insertMany(jobDocs);
  console.log(`📝  Đã tạo ${insertedJobs.length} job`);

  /* ------------------------- 5. JOB APPLICATIONS (8) ------------------------ */
  const cvMock = (idx) => ({
    filename: `cv-${idx}.pdf`,
    originalName: `Applicant-${idx}.pdf`,
    path: `/uploads/cvs/cv-${idx}.pdf`,
    size: 250000,
    mimetype: 'application/pdf',
  });

  const applicationsSeed = [
    // gắn với Production Manager
    {
      job: insertedJobs[0],
      info: {
        fullName: 'Nguyễn Văn A',
        email: 'nva@example.com',
        phone: '0901234567',
        address: 'District 1, HCMC',
      },
      status: 'pending',
    },
    {
      job: insertedJobs[0],
      info: {
        fullName: 'Trần Thị B',
        email: 'ttb@example.com',
        phone: '0902345678',
        address: 'Go Vap, HCMC',
      },
      status: 'reviewing',
    },
    // gắn với Quality Control Specialist
    {
      job: insertedJobs[1],
      info: {
        fullName: 'Lê Văn C',
        email: 'lvc@example.com',
        phone: '0903456789',
        address: 'Thu Duc City',
      },
      status: 'interviewed',
    },
    {
      job: insertedJobs[1],
      info: {
        fullName: 'Phạm Thị D',
        email: 'ptd@example.com',
        phone: '0904567890',
        address: 'District 7, HCMC',
      },
      status: 'accepted',
    },
    // gắn với Senior Textile Engineer
    {
      job: insertedJobs[2],
      info: {
        fullName: 'Bùi Văn E',
        email: 'bve@example.com',
        phone: '0905678901',
        address: 'Bien Hoa, Dong Nai',
      },
      status: 'pending',
    },
    {
      job: insertedJobs[2],
      info: {
        fullName: 'Đỗ Thị F',
        email: 'dtf@example.com',
        phone: '0906789012',
        address: 'Long Khanh, Dong Nai',
      },
      status: 'pending',
    },
    {
      job: insertedJobs[2],
      info: {
        fullName: 'Võ Văn G',
        email: 'vvg@example.com',
        phone: '0907890123',
        address: 'District 2, HCMC',
      },
      status: 'reviewing',
    },
    {
      job: insertedJobs[2],
      info: {
        fullName: 'Hoàng Thị H',
        email: 'hth@example.com',
        phone: '0908901234',
        address: 'Remote',
      },
      status: 'interviewed',
    },
  ];

  for (let i = 0; i < applicationsSeed.length; i++) {
    const app = applicationsSeed[i];
    await JobApplication.create({
      jobId: app.job._id,
      jobTitle: app.job.title,
      jobLocation: app.job.location,
      personalInfo: app.info,
      cvFile: cvMock(i + 1),
      status: app.status,
    });
    // tăng applicationCount
    app.job.applicationCount += 1;
  }
  // lưu lại applicationCount mới
  await Promise.all(insertedJobs.map((j) => j.save()));

  console.log(`📑  Đã tạo ${applicationsSeed.length} ứng tuyển mẫu`);

  /* ------------------------------------------------------------------------- */
  console.log('✅  Careers seed FULL completed');
  await mongoose.disconnect();
}

seedCareers().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
