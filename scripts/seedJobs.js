const mongoose = require('mongoose');
const Job = require('../models/Careers').Job;
const JobCategory = require('../models/JobCategory');
require('dotenv').config();

// Jobs data - 2 jobs per category
const jobsData = [
  // CƠ KHÍ (co-khi) - 2 jobs
  {
    title: 'Kỹ sư thiết kế cơ khí sản phẩm mềm Catia V5',
    titleJa: '機械製品設計エンジニア (Catia V5)',
    category: 'CƠ KHÍ',
    categoryId: 'co-khi',
    location: 'Shizuoka-ken, Nhật Bản',
    locationJa: '静岡県、日本',
    workType: 'Full-time',
    description: 'Thiết kế các sản phẩm mềm sử dụng phần mềm Catia V5. Tham gia vào quy trình thiết kế từ concept đến production. Làm việc trong môi trường chuyên nghiệp với các kỹ sư hàng đầu.',
    descriptionJa: 'Catia V5ソフトウェアを使用した機械製品の設計。コンセプトから生産までの設計プロセスに参加。一流のエンジニアと協力する専門的な環境で働きます。',
    requirements: [
      'Tốt nghiệp đại học chuyên ngành Cơ khí',
      'Có kinh nghiệm sử dụng Catia V5 (tối thiểu 2 năm)',
      'Tiếng Nhật N3 trở lên',
      'Có khả năng đọc bản vẽ kỹ thuật',
      'Kinh nghiệm làm việc tại Nhật Bản là lợi thế'
    ],
    requirementsJa: [
      '機械工学専攻の大学卒業',
      'Catia V5使用経験（最低2年）',
      '日本語N3以上',
      '技術図面を読む能力',
      '日本での勤務経験が優遇される'
    ],
    benefits: [
      'Lương tháng: ¥300,000 - ¥450,000',
      'Bảo hiểm đầy đủ (y tế, hưu trí, thất nghiệp)',
      'Nghỉ phép có lương: 10 ngày/năm',
      'Đào tạo tại chỗ và phát triển nghề nghiệp',
      'Hỗ trợ tìm nhà ở cho người nước ngoài'
    ],
    benefitsJa: [
      '月給：¥300,000 - ¥450,000',
      '完全な保険（医療、年金、失業）',
      '有給休暇：年間10日',
      '現場研修とキャリア開発',
      '外国人向け住居サポート'
    ],
    salary: {
      min: 300000,
      max: 450000,
      currency: '¥',
      note: 'Có thể thương lượng dựa trên kinh nghiệm'
    },
    experience: 'Tối thiểu 2 năm kinh nghiệm thiết kế cơ khí',
    language: 'Tiếng Nhật N3 trở lên',
    major: 'Cơ khí, Cơ khí chế tạo',
    recruitmentStatus: 'Đang tuyển',
    isActive: true,
    order: 1,
    jobImage: '' // Will use category image
  },
  {
    title: 'Kỹ sư cơ khí sản xuất',
    titleJa: '機械製造エンジニア',
    category: 'CƠ KHÍ',
    categoryId: 'co-khi',
    location: 'Tokyo, Nhật Bản',
    locationJa: '東京都、日本',
    workType: 'Full-time',
    description: 'Quản lý và giám sát quy trình sản xuất cơ khí. Đảm bảo chất lượng sản phẩm và tối ưu hóa hiệu suất sản xuất. Làm việc trực tiếp với đội ngũ sản xuất và kỹ sư chất lượng.',
    descriptionJa: '機械製造プロセスの管理と監督。製品品質を確保し、製造効率を最適化。生産チームと品質エンジニアと直接協力します。',
    requirements: [
      'Tốt nghiệp đại học Cơ khí',
      'Có kinh nghiệm 2-3 năm trong sản xuất',
      'Tiếng Nhật N2',
      'Hiểu biết về quy trình sản xuất công nghiệp',
      'Kỹ năng giải quyết vấn đề tốt'
    ],
    requirementsJa: [
      '機械工学の大学卒業',
      '製造業での2-3年の経験',
      '日本語N2',
      '産業製造プロセスの理解',
      '問題解決スキル'
    ],
    benefits: [
      'Lương tháng: ¥280,000 - ¥420,000',
      'Bảo hiểm y tế, hưu trí',
      'Phụ cấp làm thêm giờ',
      'Chương trình đào tạo nội bộ',
      'Cơ hội thăng tiến trong công ty'
    ],
    benefitsJa: [
      '月給：¥280,000 - ¥420,000',
      '医療・年金保険',
      '残業手当',
      '社内研修プログラム',
      '社内昇進の機会'
    ],
    salary: {
      min: 280000,
      max: 420000,
      currency: '¥',
      note: ''
    },
    experience: '2-3 năm kinh nghiệm',
    language: 'Tiếng Nhật N2',
    major: 'Cơ khí sản xuất',
    recruitmentStatus: 'Đang tuyển',
    isActive: true,
    order: 2,
    jobImage: '' // Will use category image
  },
  // Ô TÔ (o-to) - 2 jobs
  {
    title: 'Kỹ sư xuất chi tiết ô tô tại Shizuoka-ken',
    titleJa: '自動車部品エンジニア（静岡県）',
    category: 'Ô TÔ',
    categoryId: 'o-to',
    location: 'Shizuoka-ken, Nhật Bản',
    locationJa: '静岡県、日本',
    workType: 'Full-time',
    description: 'Thiết kế chi tiết các bộ phận ô tô sử dụng phần mềm CAD chuyên dụng. Phối hợp với các kỹ sư R&D và đội ngũ sản xuất để phát triển sản phẩm mới.',
    descriptionJa: '専用CADソフトウェアを使用した自動車部品の設計。R&Dエンジニアと生産チームと協力して新製品を開発します。',
    requirements: [
      'Tốt nghiệp đại học chuyên ngành Ô tô hoặc Cơ khí',
      'Có kinh nghiệm thiết kế ô tô (tối thiểu 2 năm)',
      'Tiếng Nhật N3 trở lên',
      'Thành thạo CATIA, SolidWorks hoặc NX',
      'Hiểu biết về tiêu chuẩn JIS và quy trình phát triển ô tô'
    ],
    requirementsJa: [
      '自動車工学または機械工学の大学卒業',
      '自動車設計経験（最低2年）',
      '日本語N3以上',
      'CATIA、SolidWorks、またはNXに精通',
      'JIS基準と自動車開発プロセスの理解'
    ],
    benefits: [
      'Lương tháng: ¥320,000 - ¥480,000',
      'Bảo hiểm đầy đủ',
      'Nghỉ phép: 12 ngày/năm',
      'Đào tạo chuyên môn',
      'Hỗ trợ chuyển nhà'
    ],
    benefitsJa: [
      '月給：¥320,000 - ¥480,000',
      '完全な保険',
      '有給休暇：年間12日',
      '専門研修',
      '転居サポート'
    ],
    salary: {
      min: 320000,
      max: 480000,
      currency: '¥',
      note: 'Theo năng lực và kinh nghiệm'
    },
    experience: 'Tối thiểu 2 năm',
    language: 'Tiếng Nhật N3 trở lên',
    major: 'Ô tô, Cơ khí ô tô',
    recruitmentStatus: 'Đang tuyển',
    isActive: true,
    order: 1,
    jobImage: '' // Will use category image
  },
  {
    title: 'Kỹ sư R&D Ô tô',
    titleJa: '自動車R&Dエンジニア',
    category: 'Ô TÔ',
    categoryId: 'o-to',
    location: 'Yokohama, Nhật Bản',
    locationJa: '横浜市、日本',
    workType: 'Full-time',
    description: 'Nghiên cứu và phát triển công nghệ ô tô mới. Tham gia vào các dự án đổi mới công nghệ, tối ưu hóa hiệu suất và giảm phát thải. Làm việc trong phòng thí nghiệm và môi trường R&D chuyên nghiệp.',
    descriptionJa: '新しい自動車技術の研究開発。技術革新プロジェクトに参加し、性能の最適化と排出ガス削減に取り組みます。研究所と専門的なR&D環境で働きます。',
    requirements: [
      'Thạc sĩ Cơ khí hoặc Ô tô (ưu tiên)',
      'Có kinh nghiệm R&D (tối thiểu 3 năm)',
      'Tiếng Nhật N2 hoặc tiếng Anh tốt',
      'Kiến thức về động cơ và hệ thống điện tử ô tô',
      'Kỹ năng phân tích và giải quyết vấn đề'
    ],
    requirementsJa: [
      '機械または自動車の修士号（優先）',
      'R&D経験（最低3年）',
      '日本語N2または英語能力',
      'エンジンと自動車電子システムの知識',
      '分析と問題解決スキル'
    ],
    benefits: [
      'Lương tháng: ¥350,000 - ¥500,000',
      'Bảo hiểm đầy đủ',
      'Nghỉ phép: 15 ngày/năm',
      'Chương trình nghiên cứu và phát triển',
      'Cơ hội công bố nghiên cứu'
    ],
    benefitsJa: [
      '月給：¥350,000 - ¥500,000',
      '完全な保険',
      '有給休暇：年間15日',
      '研究開発プログラム',
      '研究発表の機会'
    ],
    salary: {
      min: 350000,
      max: 500000,
      currency: '¥',
      note: 'Dựa trên trình độ học vấn và kinh nghiệm'
    },
    experience: 'Tối thiểu 3 năm R&D',
    language: 'Tiếng Nhật N2 hoặc tiếng Anh tốt',
    major: 'Ô tô, Cơ khí',
    recruitmentStatus: 'Đang tuyển',
    isActive: true,
    order: 2,
    jobImage: '' // Will use category image
  },
  // ĐIỆN, ĐIỆN TỬ (dien-dien-tu) - 2 jobs
  {
    title: 'Kỹ sư điện tử công nghiệp',
    titleJa: '産業電子エンジニア',
    category: 'ĐIỆN, ĐIỆN TỬ',
    categoryId: 'dien-dien-tu',
    location: 'Osaka, Nhật Bản',
    locationJa: '大阪府、日本',
    workType: 'Full-time',
    description: 'Thiết kế và bảo trì hệ thống điện tử công nghiệp. Phát triển các giải pháp tự động hóa và điều khiển cho nhà máy sản xuất. Làm việc với PLC, SCADA và các hệ thống nhúng.',
    descriptionJa: '産業電子システムの設計と保守。製造工場向けの自動化・制御ソリューションの開発。PLC、SCADA、組み込みシステムを扱います。',
    requirements: [
      'Tốt nghiệp đại học Điện - Điện tử',
      'Có kinh nghiệm 1-2 năm trong công nghiệp',
      'Tiếng Nhật N3',
      'Kiến thức về PLC, SCADA',
      'Kinh nghiệm với hệ thống tự động hóa'
    ],
    requirementsJa: [
      '電気・電子工学の大学卒業',
      '産業界での1-2年の経験',
      '日本語N3',
      'PLC、SCADAの知識',
      '自動化システムの経験'
    ],
    benefits: [
      'Lương tháng: ¥290,000 - ¥440,000',
      'Bảo hiểm đầy đủ',
      'Nghỉ phép: 10 ngày/năm',
      'Đào tạo kỹ thuật',
      'Hỗ trợ chứng chỉ chuyên môn'
    ],
    benefitsJa: [
      '月給：¥290,000 - ¥440,000',
      '完全な保険',
      '有給休暇：年間10日',
      '技術研修',
      '専門資格サポート'
    ],
    salary: {
      min: 290000,
      max: 440000,
      currency: '¥',
      note: ''
    },
    experience: '1-2 năm kinh nghiệm',
    language: 'Tiếng Nhật N3',
    major: 'Điện tử, Điện tử công nghiệp',
    recruitmentStatus: 'Đang tuyển',
    isActive: true,
    order: 1,
    jobImage: '' // Will use category image
  },
  {
    title: 'Kỹ sư điện lực',
    titleJa: '電力エンジニア',
    category: 'ĐIỆN, ĐIỆN TỬ',
    categoryId: 'dien-dien-tu',
    location: 'Fukuoka, Nhật Bản',
    locationJa: '福岡県、日本',
    workType: 'Full-time',
    description: 'Thiết kế và quản lý hệ thống điện lực cho các tòa nhà và nhà máy công nghiệp. Đảm bảo an toàn điện và tối ưu hóa hiệu suất năng lượng.',
    descriptionJa: '建物と産業工場向けの電力システムの設計と管理。電気安全を確保し、エネルギー効率を最適化します。',
    requirements: [
      'Tốt nghiệp đại học Điện',
      'Có kinh nghiệm thiết kế hệ thống điện (2-3 năm)',
      'Tiếng Nhật N2',
      'Có chứng chỉ hành nghề điện (ưu tiên)',
      'Kiến thức về quy chuẩn an toàn điện Nhật Bản'
    ],
    requirementsJa: [
      '電気工学の大学卒業',
      '電気システム設計経験（2-3年）',
      '日本語N2',
      '電気資格（優先）',
      '日本の電気安全規格の知識'
    ],
    benefits: [
      'Lương tháng: ¥310,000 - ¥460,000',
      'Bảo hiểm đầy đủ',
      'Nghỉ phép: 12 ngày/năm',
      'Đào tạo chuyên môn',
      'Hỗ trợ thi lấy chứng chỉ'
    ],
    benefitsJa: [
      '月給：¥310,000 - ¥460,000',
      '完全な保険',
      '有給休暇：年間12日',
      '専門研修',
      '資格試験サポート'
    ],
    salary: {
      min: 310000,
      max: 460000,
      currency: '¥',
      note: ''
    },
    experience: '2-3 năm kinh nghiệm',
    language: 'Tiếng Nhật N2',
    major: 'Điện, Điện lực',
    recruitmentStatus: 'Đang tuyển',
    isActive: true,
    order: 2,
    jobImage: '' // Will use category image
  },
  // IT - 2 jobs
  {
    title: 'Backend Developer (Java/Spring)',
    titleJa: 'バックエンド開発者（Java/Spring）',
    category: 'IT',
    categoryId: 'it',
    location: 'Tokyo, Nhật Bản',
    locationJa: '東京都、日本',
    workType: 'Full-time',
    description: 'Phát triển hệ thống backend cho các ứng dụng doanh nghiệp sử dụng Java và Spring Boot. Thiết kế API RESTful, xử lý database và tích hợp với các dịch vụ bên thứ ba.',
    descriptionJa: 'JavaとSpring Bootを使用したエンタープライズアプリケーションのバックエンドシステム開発。RESTful APIの設計、データベース処理、サードパーティサービスとの統合を行います。',
    requirements: [
      'Có kinh nghiệm Java, Spring Boot (tối thiểu 2 năm)',
      'Hiểu biết về microservices architecture',
      'Tiếng Nhật N3 hoặc tiếng Anh tốt',
      'Kinh nghiệm với SQL và NoSQL databases',
      'Kiến thức về Docker và CI/CD'
    ],
    requirementsJa: [
      'Java、Spring Boot経験（最低2年）',
      'マイクロサービスアーキテクチャの理解',
      '日本語N3または英語能力',
      'SQLおよびNoSQLデータベースの経験',
      'DockerとCI/CDの知識'
    ],
    benefits: [
      'Lương tháng: ¥350,000 - ¥550,000',
      'Bảo hiểm đầy đủ',
      'Nghỉ phép: 14 ngày/năm',
      'Đào tạo công nghệ mới',
      'Làm việc từ xa (một phần)'
    ],
    benefitsJa: [
      '月給：¥350,000 - ¥550,000',
      '完全な保険',
      '有給休暇：年間14日',
      '新技術研修',
      'リモートワーク（一部）'
    ],
    salary: {
      min: 350000,
      max: 550000,
      currency: '¥',
      note: 'Tùy theo kinh nghiệm và kỹ năng'
    },
    experience: 'Tối thiểu 2 năm',
    language: 'Tiếng Nhật N3 hoặc tiếng Anh tốt',
    major: 'Công nghệ thông tin, Khoa học máy tính',
    recruitmentStatus: 'Đang tuyển',
    isActive: true,
    order: 1,
    jobImage: '' // Will use category image
  },
  {
    title: 'Frontend Developer (React/Next.js)',
    titleJa: 'フロントエンド開発者（React/Next.js）',
    category: 'IT',
    categoryId: 'it',
    location: 'Tokyo, Nhật Bản',
    locationJa: '東京都、日本',
    workType: 'Full-time',
    description: 'Phát triển giao diện người dùng cho web applications sử dụng React và Next.js. Tối ưu hóa hiệu suất và trải nghiệm người dùng. Làm việc trong team Agile/Scrum.',
    descriptionJa: 'ReactとNext.jsを使用したWebアプリケーションのユーザーインターフェース開発。パフォーマンスとユーザーエクスペリエンスの最適化。アジャイル/スクラムチームで働きます。',
    requirements: [
      'Thành thạo React, Next.js, TypeScript (2+ năm)',
      'Có kinh nghiệm 2+ năm frontend development',
      'Tiếng Nhật N3',
      'Kiến thức về CSS, TailwindCSS',
      'Kinh nghiệm với Git và code review'
    ],
    requirementsJa: [
      'React、Next.js、TypeScriptに精通（2年以上）',
      'フロントエンド開発経験2年以上',
      '日本語N3',
      'CSS、TailwindCSSの知識',
      'Gitとコードレビューの経験'
    ],
    benefits: [
      'Lương tháng: ¥320,000 - ¥500,000',
      'Bảo hiểm đầy đủ',
      'Nghỉ phép: 14 ngày/năm',
      'Đào tạo công nghệ',
      'Flexible working hours'
    ],
    benefitsJa: [
      '月給：¥320,000 - ¥500,000',
      '完全な保険',
      '有給休暇：年間14日',
      '技術研修',
      'フレックスタイム制'
    ],
    salary: {
      min: 320000,
      max: 500000,
      currency: '¥',
      note: ''
    },
    experience: '2+ năm kinh nghiệm',
    language: 'Tiếng Nhật N3',
    major: 'Công nghệ thông tin, Web development',
    recruitmentStatus: 'Đang tuyển',
    isActive: true,
    order: 2,
    jobImage: '' // Will use category image
  },
  // XÂY DỰNG (xay-dung) - 2 jobs
  {
    title: 'Kỹ sư xây dựng dân dụng',
    titleJa: '土木建設エンジニア',
    category: 'XÂY DỰNG',
    categoryId: 'xay-dung',
    location: 'Saitama, Nhật Bản',
    locationJa: '埼玉県、日本',
    workType: 'Full-time',
    description: 'Thiết kế và giám sát thi công công trình dân dụng. Quản lý dự án xây dựng từ giai đoạn thiết kế đến hoàn thành. Đảm bảo chất lượng và tiến độ công trình.',
    descriptionJa: '土木建設プロジェクトの設計と施工監督。設計段階から完成まで建設プロジェクトを管理。品質と工程を確保します。',
    requirements: [
      'Tốt nghiệp đại học Xây dựng',
      'Có kinh nghiệm thiết kế (tối thiểu 2 năm)',
      'Tiếng Nhật N3',
      'Kiến thức về AutoCAD, Revit',
      'Có chứng chỉ hành nghề xây dựng (ưu tiên)'
    ],
    requirementsJa: [
      '建設工学の大学卒業',
      '設計経験（最低2年）',
      '日本語N3',
      'AutoCAD、Revitの知識',
      '建設資格（優先）'
    ],
    benefits: [
      'Lương tháng: ¥300,000 - ¥450,000',
      'Bảo hiểm đầy đủ',
      'Nghỉ phép: 10 ngày/năm',
      'Phụ cấp công trường',
      'Đào tạo chuyên môn'
    ],
    benefitsJa: [
      '月給：¥300,000 - ¥450,000',
      '完全な保険',
      '有給休暇：年間10日',
      '現場手当',
      '専門研修'
    ],
    salary: {
      min: 300000,
      max: 450000,
      currency: '¥',
      note: ''
    },
    experience: 'Tối thiểu 2 năm',
    language: 'Tiếng Nhật N3',
    major: 'Xây dựng, Xây dựng dân dụng',
    recruitmentStatus: 'Đang tuyển',
    isActive: true,
    order: 1,
    jobImage: '' // Will use category image
  },
  {
    title: 'Kỹ sư giám sát công trình',
    titleJa: '建設現場監督エンジニア',
    category: 'XÂY DỰNG',
    categoryId: 'xay-dung',
    location: 'Chiba, Nhật Bản',
    locationJa: '千葉県、日本',
    workType: 'Full-time',
    description: 'Giám sát thi công tại công trường, đảm bảo tuân thủ thiết kế và tiêu chuẩn chất lượng. Quản lý nhân công và vật liệu, giải quyết các vấn đề phát sinh trong quá trình thi công.',
    descriptionJa: '建設現場での施工監督。設計と品質基準の遵守を確保。労働者と資材の管理、施工過程で発生する問題の解決を行います。',
    requirements: [
      'Tốt nghiệp đại học Xây dựng',
      'Có kinh nghiệm giám sát công trường (2-3 năm)',
      'Tiếng Nhật N2',
      'Kiến thức về an toàn lao động',
      'Có thể làm việc tại công trường'
    ],
    requirementsJa: [
      '建設工学の大学卒業',
      '現場監督経験（2-3年）',
      '日本語N2',
      '労働安全の知識',
      '現場での作業が可能'
    ],
    benefits: [
      'Lương tháng: ¥290,000 - ¥430,000',
      'Bảo hiểm đầy đủ',
      'Phụ cấp công trường',
      'Nghỉ phép: 10 ngày/năm',
      'Đào tạo an toàn lao động'
    ],
    benefitsJa: [
      '月給：¥290,000 - ¥430,000',
      '完全な保険',
      '現場手当',
      '有給休暇：年間10日',
      '労働安全研修'
    ],
    salary: {
      min: 290000,
      max: 430000,
      currency: '¥',
      note: 'Bao gồm phụ cấp công trường'
    },
    experience: '2-3 năm kinh nghiệm',
    language: 'Tiếng Nhật N2',
    major: 'Xây dựng',
    recruitmentStatus: 'Đang tuyển',
    isActive: true,
    order: 2,
    jobImage: '' // Will use category image
  }
];

async function seedJobs() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/saigon3jean';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get all categories to map categoryId
    const categories = await JobCategory.find({});
    const categoryMap = new Map();
    categories.forEach(cat => {
      categoryMap.set(cat.categoryId, cat);
      categoryMap.set(cat.name, cat);
    });

    // Insert jobs
    for (const jobData of jobsData) {
      // Generate slug from title
      const slug = jobData.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      // Check if job already exists by title
      const existing = await Job.findOne({ title: jobData.title });
      
      if (existing) {
        console.log(`⚠️  Job "${jobData.title}" already exists, updating...`);
        // Update existing job - ensure categoryId is set
        Object.assign(existing, {
          ...jobData,
          slug: slug,
          categoryId: jobData.categoryId || existing.categoryId // Keep existing if new one not provided
        });
        await existing.save();
        console.log(`✅ Updated job "${jobData.title}" (categoryId: ${existing.categoryId || 'none'})`);
      } else {
        const job = new Job({
          ...jobData,
          slug: slug
        });
        await job.save();
        console.log(`✅ Created job "${jobData.title}" (categoryId: ${job.categoryId || 'none'})`);
      }
    }

    // Update all existing jobs to have categoryId if missing
    console.log('\n🔄 Updating existing jobs without categoryId...');
    const jobsWithoutCategoryId = await Job.find({ 
      $or: [
        { categoryId: { $exists: false } },
        { categoryId: '' },
        { categoryId: null }
      ]
    });
    
    for (const job of jobsWithoutCategoryId) {
      // Try to match with category by name
      const matchedCategory = categories.find(cat => cat.name === job.category);
      if (matchedCategory) {
        job.categoryId = matchedCategory.categoryId;
        await job.save();
        console.log(`✅ Updated job "${job.title}" with categoryId: ${job.categoryId}`);
      } else {
        // Map old category names to new categoryIds
        const categoryMap = {
          'CƠ KHÍ': 'co-khi',
          'Ô TÔ': 'o-to',
          'ĐIỆN, ĐIỆN TỬ': 'dien-dien-tu',
          'IT': 'it',
          'XÂY DỰNG': 'xay-dung'
        };
        if (categoryMap[job.category]) {
          job.categoryId = categoryMap[job.category];
          await job.save();
          console.log(`✅ Updated job "${job.title}" with categoryId: ${job.categoryId}`);
        }
      }
    }

    console.log('\n✅ Seed completed successfully!');
    console.log(`📊 Total: ${jobsData.length} jobs (${categories.length} categories)`);
    if (jobsWithoutCategoryId.length > 0) {
      console.log(`🔄 Updated ${jobsWithoutCategoryId.length} existing jobs with categoryId`);
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
    process.exit(1);
  }
}

// Run seed
seedJobs();

