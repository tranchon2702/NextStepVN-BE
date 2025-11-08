require('dotenv').config();
const mongoose = require('mongoose');
const { News } = require('../models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/saigon3jean';

/**
 * Seed script cho 4 tin tức chuyên nghiệp về tuyển dụng kỹ sư Việt Nam - Nhật Bản
 * 
 * Usage: node scripts/seedNewsRecruitment.js
 */

async function seedRecruitmentNews() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB\n');

    // Wait for kuroshiro to initialize (for slugJa generation)
    console.log('⏳ Waiting for kuroshiro to initialize...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    const newsItems = [
      {
        title: 'Cơ Hội Nghề Nghiệp Cho Kỹ Sư Việt Nam Tại Nhật Bản - Tương Lai Tươi Sáng',
        titleJa: 'ベトナムエンジニアの日本でのキャリア機会 - 明るい未来',
        content: `
          <h2>Mở Rộng Cơ Hội Nghề Nghiệp Cho Kỹ Sư Việt Nam</h2>
          <p>Nhật Bản đang đối mặt với tình trạng thiếu hụt nhân lực kỹ thuật trầm trọng, đặc biệt trong các lĩnh vực công nghệ thông tin, kỹ thuật phần mềm, và tự động hóa. Đây là cơ hội vàng cho các kỹ sư Việt Nam có tay nghề cao và mong muốn phát triển sự nghiệp tại một trong những quốc gia công nghệ hàng đầu thế giới.</p>
          
          <h3>Nhu Cầu Nhân Lực Kỹ Thuật Tại Nhật Bản</h3>
          <p>Theo báo cáo mới nhất của Bộ Kinh tế, Thương mại và Công nghiệp Nhật Bản (METI), quốc gia này cần thêm khoảng 800.000 kỹ sư công nghệ thông tin vào năm 2030. Sự thiếu hụt này tạo ra nhiều cơ hội việc làm hấp dẫn cho kỹ sư Việt Nam với mức lương cạnh tranh và môi trường làm việc chuyên nghiệp.</p>
          
          <h3>Lợi Ích Khi Làm Việc Tại Nhật Bản</h3>
          <ul>
            <li><strong>Mức lương cao:</strong> Kỹ sư Việt Nam có thể nhận mức lương từ 4-8 triệu Yên/năm (tương đương 800 triệu - 1.6 tỷ VNĐ/năm) tùy theo kinh nghiệm và chuyên môn.</li>
            <li><strong>Môi trường làm việc chuyên nghiệp:</strong> Tiếp cận với công nghệ tiên tiến nhất và quy trình làm việc chuẩn quốc tế.</li>
            <li><strong>Cơ hội phát triển:</strong> Nhiều cơ hội thăng tiến và học hỏi từ các chuyên gia hàng đầu thế giới.</li>
            <li><strong>Phúc lợi xã hội:</strong> Bảo hiểm y tế, bảo hiểm xã hội đầy đủ, và các chế độ nghỉ phép hợp lý.</li>
            <li><strong>Văn hóa đa dạng:</strong> Trải nghiệm văn hóa Nhật Bản độc đáo và mở rộng tầm nhìn quốc tế.</li>
          </ul>
          
          <h3>Các Lĩnh Vực Đang Cần Nhân Lực</h3>
          <p>Các lĩnh vực có nhu cầu tuyển dụng cao nhất bao gồm:</p>
          <ul>
            <li>Kỹ sư phần mềm (Software Engineer)</li>
            <li>Kỹ sư phát triển ứng dụng di động (Mobile App Developer)</li>
            <li>Kỹ sư AI/Machine Learning</li>
            <li>Kỹ sư DevOps và Cloud Computing</li>
            <li>Kỹ sư tự động hóa và Robotics</li>
            <li>Kỹ sư hệ thống nhúng (Embedded Systems Engineer)</li>
          </ul>
          
          <h3>Yêu Cầu Cơ Bản</h3>
          <p>Để có cơ hội làm việc tại Nhật Bản, kỹ sư Việt Nam cần:</p>
          <ul>
            <li>Bằng đại học chuyên ngành kỹ thuật hoặc công nghệ thông tin</li>
            <li>Kinh nghiệm làm việc từ 2-5 năm trong lĩnh vực liên quan</li>
            <li>Kỹ năng tiếng Nhật cơ bản (N3 trở lên) hoặc tiếng Anh tốt</li>
            <li>Kỹ năng chuyên môn vững vàng và khả năng thích ứng nhanh</li>
          </ul>
          
          <h3>Kết Luận</h3>
          <p>Nhật Bản đang mở rộng cánh cửa cho các kỹ sư Việt Nam tài năng. Với sự hỗ trợ từ các công ty tuyển dụng chuyên nghiệp như Next Step Vietnam, bạn có thể biến giấc mơ làm việc tại Nhật Bản thành hiện thực. Hãy bắt đầu hành trình nghề nghiệp quốc tế của bạn ngay hôm nay!</p>
        `,
        contentJa: `
          <h2>ベトナムエンジニアのキャリア機会の拡大</h2>
          <p>日本は深刻な技術人材不足に直面しており、特に情報技術、ソフトウェア工学、自動化の分野で顕著です。これは、高いスキルを持ち、世界有数の技術先進国でキャリアを発展させたいベトナムのエンジニアにとって絶好の機会です。</p>
          
          <h3>日本の技術人材需要</h3>
          <p>経済産業省（METI）の最新報告によると、日本は2030年までに約80万人のITエンジニアを追加で必要としています。この不足は、競争力のある給与と専門的な職場環境を提供する魅力的な就業機会をベトナムのエンジニアに創出しています。</p>
          
          <h3>日本で働く利点</h3>
          <ul>
            <li><strong>高給与:</strong> ベトナムのエンジニアは、経験と専門性に応じて年間400〜800万円（約8億〜16億ベトナムドン）の給与を受け取ることができます。</li>
            <li><strong>専門的な職場環境:</strong> 最先端技術と国際標準の業務プロセスにアクセスできます。</li>
            <li><strong>成長機会:</strong> 世界トップクラスの専門家から学び、昇進の機会が多数あります。</li>
            <li><strong>社会福祉:</strong> 健康保険、社会保険が充実し、合理的な休暇制度があります。</li>
            <li><strong>多様な文化:</strong> 独特な日本文化を体験し、国際的な視野を広げることができます。</li>
          </ul>
          
          <h3>人材需要が高い分野</h3>
          <p>最も高い採用需要がある分野には以下が含まれます：</p>
          <ul>
            <li>ソフトウェアエンジニア</li>
            <li>モバイルアプリ開発者</li>
            <li>AI/機械学習エンジニア</li>
            <li>DevOpsおよびクラウドコンピューティングエンジニア</li>
            <li>自動化およびロボティクスエンジニア</li>
            <li>組み込みシステムエンジニア</li>
          </ul>
          
          <h3>基本的な要件</h3>
          <p>日本で働く機会を得るために、ベトナムのエンジニアは以下が必要です：</p>
          <ul>
            <li>工学または情報技術の学士号</li>
            <li>関連分野での2〜5年の実務経験</li>
            <li>基本的な日本語スキル（N3以上）または優れた英語力</li>
            <li>強固な専門スキルと迅速な適応能力</li>
          </ul>
          
          <h3>結論</h3>
          <p>日本は才能あるベトナムのエンジニアに門戸を開いています。Next Step Vietnamのような専門的な採用会社のサポートにより、日本で働く夢を現実にすることができます。今日からあなたの国際的なキャリアの旅を始めましょう！</p>
        `,
        excerpt: 'Nhật Bản đang đối mặt với tình trạng thiếu hụt nhân lực kỹ thuật trầm trọng, tạo ra nhiều cơ hội việc làm hấp dẫn cho kỹ sư Việt Nam với mức lương cạnh tranh và môi trường làm việc chuyên nghiệp.',
        excerptJa: '日本は深刻な技術人材不足に直面しており、競争力のある給与と専門的な職場環境を提供する魅力的な就業機会をベトナムのエンジニアに創出しています。',
        mainImage: '/images/news/recruitment-opportunity.jpg',
        publishDate: new Date('2024-01-15'),
        isPublished: true,
        isFeatured: true,
        onHome: true,
        views: 0,
        tags: ['tuyển dụng', 'kỹ sư', 'Nhật Bản', 'cơ hội nghề nghiệp', 'IT', 'エンジニア', '日本', '採用'],
        author: 'Next Step Vietnam',
        seo: {
          metaTitle: 'Cơ Hội Nghề Nghiệp Cho Kỹ Sư Việt Nam Tại Nhật Bản | Next Step Vietnam',
          metaDescription: 'Khám phá cơ hội nghề nghiệp hấp dẫn cho kỹ sư Việt Nam tại Nhật Bản. Mức lương cao, môi trường chuyên nghiệp, và nhiều cơ hội phát triển. Tìm hiểu ngay!',
          metaKeywords: ['tuyển dụng kỹ sư', 'kỹ sư Việt Nam', 'làm việc tại Nhật', 'IT engineer Japan', 'ベトナムエンジニア', '日本就職', 'エンジニア採用'],
          ogImage: '/images/news/recruitment-opportunity.jpg'
        }
      },
      {
        title: 'Chương Trình Đào Tạo Kỹ Sư Việt Nam Làm Việc Tại Nhật Bản - Hành Trình Chuyên Nghiệp',
        titleJa: 'ベトナムエンジニアの日本就職トレーニングプログラム - プロフェッショナルな旅',
        content: `
          <h2>Chương Trình Đào Tạo Toàn Diện Cho Kỹ Sư Việt Nam</h2>
          <p>Next Step Vietnam tự hào giới thiệu chương trình đào tạo chuyên sâu, được thiết kế đặc biệt để chuẩn bị cho các kỹ sư Việt Nam sẵn sàng làm việc tại môi trường chuyên nghiệp của Nhật Bản. Chương trình này không chỉ trang bị kỹ năng kỹ thuật mà còn phát triển kỹ năng giao tiếp, văn hóa làm việc và ngôn ngữ cần thiết.</p>
          
          <h3>Nội Dung Đào Tạo</h3>
          <h4>1. Đào Tạo Kỹ Thuật Chuyên Sâu</h4>
          <ul>
            <li><strong>Lập trình và phát triển phần mềm:</strong> Cập nhật các công nghệ mới nhất như React, Node.js, Python, Java, và các framework phổ biến tại Nhật Bản.</li>
            <li><strong>Quy trình phát triển phần mềm:</strong> Học Agile, Scrum, và các phương pháp quản lý dự án chuẩn Nhật Bản.</li>
            <li><strong>Best practices:</strong> Code review, testing, documentation theo tiêu chuẩn quốc tế.</li>
            <li><strong>Cloud và DevOps:</strong> AWS, Azure, Docker, Kubernetes - các công nghệ đang được sử dụng rộng rãi tại Nhật.</li>
          </ul>
          
          <h4>2. Đào Tạo Ngôn Ngữ</h4>
          <ul>
            <li><strong>Tiếng Nhật chuyên ngành IT:</strong> Từ vựng và thuật ngữ kỹ thuật cần thiết trong môi trường làm việc.</li>
            <li><strong>Giao tiếp trong công việc:</strong> Cách trình bày ý tưởng, tham gia meeting, và viết email chuyên nghiệp.</li>
            <li><strong>Chứng chỉ JLPT:</strong> Hỗ trợ đạt chứng chỉ N3-N2, mức yêu cầu phổ biến của các công ty Nhật.</li>
            <li><strong>Tiếng Anh kỹ thuật:</strong> Nâng cao khả năng giao tiếp với đồng nghiệp quốc tế.</li>
          </ul>
          
          <h4>3. Văn Hóa Làm Việc Nhật Bản</h4>
          <ul>
            <li><strong>Văn hóa doanh nghiệp:</strong> Hiểu về cách làm việc, giao tiếp, và ứng xử trong môi trường công ty Nhật.</li>
            <li><strong>Quy tắc và nghi thức:</strong> Business etiquette, cách chào hỏi, trao danh thiếp, và tham gia các sự kiện công ty.</li>
            <li><strong>Quản lý thời gian:</strong> Học cách làm việc hiệu quả và đúng deadline theo văn hóa Nhật.</li>
            <li><strong>Làm việc nhóm:</strong> Kỹ năng hợp tác và giao tiếp trong team đa văn hóa.</li>
          </ul>
          
          <h3>Thời Gian và Hình Thức Đào Tạo</h3>
          <ul>
            <li><strong>Thời gian:</strong> 3-6 tháng tùy theo chương trình và trình độ đầu vào</li>
            <li><strong>Hình thức:</strong> Kết hợp online và offline, linh hoạt cho người đi làm</li>
            <li><strong>Giảng viên:</strong> Chuyên gia có kinh nghiệm làm việc tại Nhật Bản</li>
            <li><strong>Thực hành:</strong> Dự án thực tế và case study từ các công ty Nhật</li>
          </ul>
          
          <h3>Hỗ Trợ Sau Đào Tạo</h3>
          <ul>
            <li><strong>Tư vấn việc làm:</strong> Hỗ trợ tìm kiếm và ứng tuyển vào các công ty phù hợp</li>
            <li><strong>Chuẩn bị phỏng vấn:</strong> Mock interview và feedback chi tiết</li>
            <li><strong>Hỗ trợ visa:</strong> Tư vấn và hỗ trợ thủ tục xin visa làm việc</li>
            <li><strong>Định hướng nghề nghiệp:</strong> Career counseling và roadmap phát triển dài hạn</li>
          </ul>
          
          <h3>Kết Quả Mong Đợi</h3>
          <p>Sau khi hoàn thành chương trình, học viên sẽ:</p>
          <ul>
            <li>Có đủ kỹ năng kỹ thuật để làm việc tại các công ty Nhật Bản</li>
            <li>Thành thạo giao tiếp bằng tiếng Nhật trong môi trường công việc</li>
            <li>Hiểu và thích ứng với văn hóa làm việc Nhật Bản</li>
            <li>Sẵn sàng ứng tuyển và làm việc tại Nhật Bản</li>
            <li>Có network và mối quan hệ với các chuyên gia trong ngành</li>
          </ul>
          
          <h3>Đăng Ký Ngay</h3>
          <p>Chương trình đào tạo của Next Step Vietnam đã giúp hàng trăm kỹ sư Việt Nam thành công trong việc tìm kiếm và làm việc tại Nhật Bản. Hãy bắt đầu hành trình chuyên nghiệp của bạn ngay hôm nay!</p>
        `,
        contentJa: `
          <h2>ベトナムエンジニアの包括的なトレーニングプログラム</h2>
          <p>Next Step Vietnamは、ベトナムのエンジニアが日本の専門的な職場環境で働く準備ができるよう、特別に設計された集中的なトレーニングプログラムを誇りを持って紹介します。このプログラムは、技術スキルだけでなく、必要なコミュニケーションスキル、職場文化、言語も開発します。</p>
          
          <h3>トレーニング内容</h3>
          <h4>1. 集中的な技術トレーニング</h4>
          <ul>
            <li><strong>プログラミングとソフトウェア開発:</strong> React、Node.js、Python、Javaなど、日本で人気の最新技術を更新します。</li>
            <li><strong>ソフトウェア開発プロセス:</strong> アジャイル、スクラム、日本の標準的なプロジェクト管理方法を学びます。</li>
            <li><strong>ベストプラクティス:</strong> 国際標準に基づくコードレビュー、テスト、ドキュメント作成。</li>
            <li><strong>クラウドとDevOps:</strong> AWS、Azure、Docker、Kubernetes - 日本で広く使用されている技術。</li>
          </ul>
          
          <h4>2. 言語トレーニング</h4>
          <ul>
            <li><strong>IT専門日本語:</strong> 職場環境で必要な技術用語と語彙。</li>
            <li><strong>職場でのコミュニケーション:</strong> アイデアの提示、会議への参加、専門的なメールの書き方。</li>
            <li><strong>JLPT証明書:</strong> N3-N2レベルの取得をサポート（日本の企業で一般的に要求されるレベル）。</li>
            <li><strong>技術英語:</strong> 国際的な同僚とのコミュニケーション能力を向上させます。</li>
          </ul>
          
          <h4>3. 日本の職場文化</h4>
          <ul>
            <li><strong>企業文化:</strong> 日本の会社での働き方、コミュニケーション、行動様式を理解します。</li>
            <li><strong>ルールとエチケット:</strong> ビジネスエチケット、挨拶の仕方、名刺交換、会社イベントへの参加。</li>
            <li><strong>時間管理:</strong> 日本の文化に基づいた効率的な働き方と期限厳守を学びます。</li>
            <li><strong>チームワーク:</strong> 多文化チームでの協力とコミュニケーションスキル。</li>
          </ul>
          
          <h3>期間とトレーニング形式</h3>
          <ul>
            <li><strong>期間:</strong> プログラムと初期レベルに応じて3〜6ヶ月</li>
            <li><strong>形式:</strong> オンラインとオフラインの組み合わせ、働きながらでも柔軟に対応</li>
            <li><strong>講師:</strong> 日本での実務経験を持つ専門家</li>
            <li><strong>実践:</strong> 日本の企業からの実際のプロジェクトとケーススタディ</li>
          </ul>
          
          <h3>トレーニング後のサポート</h3>
          <ul>
            <li><strong>就職相談:</strong> 適切な企業の検索と応募をサポート</li>
            <li><strong>面接準備:</strong> 模擬面接と詳細なフィードバック</li>
            <li><strong>ビザサポート:</strong> 就労ビザ申請手続きの相談とサポート</li>
            <li><strong>キャリアガイダンス:</strong> キャリアカウンセリングと長期的な開発ロードマップ</li>
          </ul>
          
          <h3>期待される結果</h3>
          <p>プログラム完了後、受講者は以下を達成します：</p>
          <ul>
            <li>日本の企業で働くのに十分な技術スキル</li>
            <li>職場環境での日本語コミュニケーションに習熟</li>
            <li>日本の職場文化を理解し適応</li>
            <li>日本での応募と就職の準備が整う</li>
            <li>業界の専門家とのネットワークと関係を構築</li>
          </ul>
          
          <h3>今すぐ登録</h3>
          <p>Next Step Vietnamのトレーニングプログラムは、数百人のベトナムエンジニアが日本での就職と就業に成功するのを支援してきました。今日からあなたの専門的な旅を始めましょう！</p>
        `,
        excerpt: 'Chương trình đào tạo chuyên sâu được thiết kế đặc biệt để chuẩn bị cho các kỹ sư Việt Nam sẵn sàng làm việc tại môi trường chuyên nghiệp của Nhật Bản, bao gồm kỹ năng kỹ thuật, ngôn ngữ và văn hóa làm việc.',
        excerptJa: 'ベトナムのエンジニアが日本の専門的な職場環境で働く準備ができるよう、特別に設計された集中的なトレーニングプログラム。技術スキル、言語、職場文化を含みます。',
        mainImage: '/images/news/training-program.jpg',
        publishDate: new Date('2024-01-20'),
        isPublished: true,
        isFeatured: true,
        onHome: true,
        views: 0,
        tags: ['đào tạo', 'kỹ sư', 'Nhật Bản', 'chương trình', 'トレーニング', 'エンジニア', 'プログラム'],
        author: 'Next Step Vietnam',
        seo: {
          metaTitle: 'Chương Trình Đào Tạo Kỹ Sư Việt Nam Làm Việc Tại Nhật Bản | Next Step Vietnam',
          metaDescription: 'Khám phá chương trình đào tạo toàn diện cho kỹ sư Việt Nam làm việc tại Nhật Bản. Kỹ năng kỹ thuật, ngôn ngữ, văn hóa làm việc. Đăng ký ngay!',
          metaKeywords: ['đào tạo kỹ sư', 'chương trình đào tạo', 'kỹ sư Nhật Bản', 'IT training Japan', 'エンジニアトレーニング', '日本就職プログラム'],
          ogImage: '/images/news/training-program.jpg'
        }
      },
      {
        title: 'Lương Và Phúc Lợi Cho Kỹ Sư Việt Nam Tại Nhật Bản - Mức Đãi Ngộ Hấp Dẫn',
        titleJa: 'ベトナムエンジニアの日本での給与と福利厚生 - 魅力的な待遇',
        content: `
          <h2>Mức Lương và Phúc Lợi Cạnh Tranh Cho Kỹ Sư Việt Nam</h2>
          <p>Nhật Bản không chỉ nổi tiếng với công nghệ tiên tiến mà còn với mức đãi ngộ hấp dẫn dành cho các kỹ sư. Bài viết này sẽ cung cấp thông tin chi tiết về mức lương, phúc lợi và các khoản trợ cấp mà kỹ sư Việt Nam có thể nhận được khi làm việc tại Nhật Bản.</p>
          
          <h3>Mức Lương Theo Kinh Nghiệm</h3>
          <h4>Kỹ Sư Mới Ra Trường (0-2 năm kinh nghiệm)</h4>
          <ul>
            <li><strong>Mức lương cơ bản:</strong> 3.5 - 5 triệu Yên/năm (khoảng 700 triệu - 1 tỷ VNĐ/năm)</li>
            <li><strong>Lương tháng:</strong> 290,000 - 420,000 Yên/tháng</li>
            <li><strong>Bonus:</strong> Thường có 2 lần bonus/năm, mỗi lần từ 1-3 tháng lương</li>
          </ul>
          
          <h4>Kỹ Sư Có Kinh Nghiệm (3-5 năm)</h4>
          <ul>
            <li><strong>Mức lương cơ bản:</strong> 5 - 7 triệu Yên/năm (khoảng 1 - 1.4 tỷ VNĐ/năm)</li>
            <li><strong>Lương tháng:</strong> 420,000 - 580,000 Yên/tháng</li>
            <li><strong>Bonus:</strong> 2-4 tháng lương/năm tùy theo hiệu suất công ty</li>
          </ul>
          
          <h4>Kỹ Sư Senior (5+ năm kinh nghiệm)</h4>
          <ul>
            <li><strong>Mức lương cơ bản:</strong> 7 - 12 triệu Yên/năm (khoảng 1.4 - 2.4 tỷ VNĐ/năm)</li>
            <li><strong>Lương tháng:</strong> 580,000 - 1,000,000 Yên/tháng</li>
            <li><strong>Bonus:</strong> Có thể lên đến 6 tháng lương/năm</li>
          </ul>
          
          <h3>Phúc Lợi Xã Hội</h3>
          <h4>Bảo Hiểm</h4>
          <ul>
            <li><strong>Bảo hiểm y tế (健康保険):</strong> Công ty đóng 50%, nhân viên đóng 50%. Chi phí y tế được hỗ trợ 70-90%.</li>
            <li><strong>Bảo hiểm xã hội (厚生年金):</strong> Hưu trí và các chế độ xã hội khác. Công ty đóng 50%.</li>
            <li><strong>Bảo hiểm thất nghiệp (雇用保険):</strong> Hỗ trợ khi mất việc, công ty đóng phần lớn.</li>
            <li><strong>Bảo hiểm tai nạn lao động (労災保険):</strong> Hoàn toàn do công ty đóng.</li>
          </ul>
          
          <h4>Nghỉ Phép và Ngày Lễ</h4>
          <ul>
            <li><strong>Nghỉ phép có lương:</strong> Từ 10-20 ngày/năm tùy theo thâm niên</li>
            <li><strong>Ngày lễ quốc gia:</strong> Khoảng 16 ngày/năm</li>
            <li><strong>Nghỉ ốm:</strong> Có chế độ nghỉ ốm có lương</li>
            <li><strong>Nghỉ thai sản/Chăm sóc con:</strong> Có chế độ nghỉ phép đặc biệt</li>
          </ul>
          
          <h3>Trợ Cấp và Phụ Cấp</h3>
          <ul>
            <li><strong>Trợ cấp đi lại (交通費):</strong> Công ty chi trả toàn bộ chi phí đi lại từ nhà đến công ty</li>
            <li><strong>Trợ cấp nhà ở (住宅手当):</strong> Một số công ty hỗ trợ 20,000 - 50,000 Yên/tháng</li>
            <li><strong>Trợ cấp ăn trưa (食事手当):</strong> Hỗ trợ bữa trưa tại canteen công ty</li>
            <li><strong>Trợ cấp phụ thuộc (家族手当):</strong> Hỗ trợ cho người phụ thuộc</li>
            <li><strong>Trợ cấp làm thêm giờ (残業手当):</strong> Trả lương làm thêm giờ theo quy định</li>
          </ul>
          
          <h3>Phúc Lợi Bổ Sung</h3>
          <ul>
            <li><strong>Đào tạo và phát triển:</strong> Công ty tài trợ các khóa học, chứng chỉ, và hội thảo</li>
            <li><strong>Thể thao và giải trí:</strong> Phòng gym, câu lạc bộ thể thao, và các hoạt động team building</li>
            <li><strong>Y tế định kỳ:</strong> Khám sức khỏe miễn phí hàng năm</li>
            <li><strong>Hỗ trợ tài chính:</strong> Vay vốn mua nhà, xe với lãi suất ưu đãi</li>
            <li><strong>Quà tặng và phần thưởng:</strong> Quà sinh nhật, quà năm mới, và các phần thưởng hiệu suất</li>
          </ul>
          
          <h3>So Sánh Với Thị Trường Việt Nam</h3>
          <p>Mức lương tại Nhật Bản thường cao hơn 2-3 lần so với cùng vị trí tại Việt Nam, kèm theo phúc lợi xã hội tốt hơn và cơ hội phát triển nghề nghiệp rộng mở hơn.</p>
          
          <h3>Thuế và Chi Phí Sinh Hoạt</h3>
          <ul>
            <li><strong>Thuế thu nhập:</strong> Từ 5-45% tùy theo mức lương, có nhiều khoản giảm trừ</li>
            <li><strong>Chi phí sinh hoạt:</strong> Khoảng 150,000 - 250,000 Yên/tháng cho một người (ăn uống, đi lại, tiện ích)</li>
            <li><strong>Tiền thuê nhà:</strong> 50,000 - 150,000 Yên/tháng tùy theo khu vực và loại nhà</li>
          </ul>
          
          <h3>Kết Luận</h3>
          <p>Làm việc tại Nhật Bản không chỉ mang lại mức lương cao mà còn nhiều phúc lợi xã hội và cơ hội phát triển. Với sự hỗ trợ từ Next Step Vietnam, bạn có thể tìm được công việc phù hợp với mức đãi ngộ tốt nhất.</p>
        `,
        contentJa: `
          <h2>ベトナムエンジニアの競争力のある給与と福利厚生</h2>
          <p>日本は先進技術で有名なだけでなく、エンジニアへの魅力的な待遇でも知られています。この記事では、ベトナムのエンジニアが日本で働く際に受け取ることができる給与、福利厚生、手当の詳細情報を提供します。</p>
          
          <h3>経験に基づく給与</h3>
          <h4>新卒エンジニア（0-2年の経験）</h4>
          <ul>
            <li><strong>基本給:</strong> 年間350〜500万円（約7億〜10億ベトナムドン）</li>
            <li><strong>月給:</strong> 月額29万〜42万円</li>
            <li><strong>ボーナス:</strong> 通常年2回、各1〜3ヶ月分の給与</li>
          </ul>
          
          <h4>経験豊富なエンジニア（3-5年）</h4>
          <ul>
            <li><strong>基本給:</strong> 年間500〜700万円（約10億〜14億ベトナムドン）</li>
            <li><strong>月給:</strong> 月額42万〜58万円</li>
            <li><strong>ボーナス:</strong> 会社の業績に応じて年2〜4ヶ月分の給与</li>
          </ul>
          
          <h4>シニアエンジニア（5年以上の経験）</h4>
          <ul>
            <li><strong>基本給:</strong> 年間700〜1200万円（約14億〜24億ベトナムドン）</li>
            <li><strong>月給:</strong> 月額58万〜100万円</li>
            <li><strong>ボーナス:</strong> 年6ヶ月分の給与まで可能</li>
          </ul>
          
          <h3>社会福祉</h3>
          <h4>保険</h4>
          <ul>
            <li><strong>健康保険:</strong> 会社が50%、従業員が50%を負担。医療費の70-90%が補助されます。</li>
            <li><strong>厚生年金:</strong> 年金とその他の社会制度。会社が50%を負担。</li>
            <li><strong>雇用保険:</strong> 失業時の支援、会社が大部分を負担。</li>
            <li><strong>労災保険:</strong> 完全に会社が負担。</li>
          </ul>
          
          <h4>休暇と祝日</h4>
          <ul>
            <li><strong>有給休暇:</strong> 勤続年数に応じて年間10〜20日</li>
            <li><strong>祝日:</strong> 年間約16日</li>
            <li><strong>病欠:</strong> 有給病欠制度あり</li>
            <li><strong>産休/育児休暇:</strong> 特別な休暇制度あり</li>
          </ul>
          
          <h3>手当と補助</h3>
          <ul>
            <li><strong>交通費:</strong> 会社が自宅から会社までの全交通費を負担</li>
            <li><strong>住宅手当:</strong> 一部の会社が月2万〜5万円を支援</li>
            <li><strong>食事手当:</strong> 会社食堂での昼食を支援</li>
            <li><strong>家族手当:</strong> 扶養家族への支援</li>
            <li><strong>残業手当:</strong> 規定に従った残業代</li>
          </ul>
          
          <h3>追加福利厚生</h3>
          <ul>
            <li><strong>研修と開発:</strong> 会社がコース、証明書、セミナーを支援</li>
            <li><strong>スポーツとレクリエーション:</strong> ジム、スポーツクラブ、チームビルディング活動</li>
            <li><strong>定期健康診断:</strong> 年1回の無料健康診断</li>
            <li><strong>財務支援:</strong> 住宅・車購入の優遇金利ローン</li>
            <li><strong>ギフトと報酬:</strong> 誕生日プレゼント、新年の贈り物、業績報酬</li>
          </ul>
          
          <h3>ベトナム市場との比較</h3>
          <p>日本の給与は、ベトナムの同じポジションと比較して通常2〜3倍高く、より良い社会福祉とより広いキャリア発展の機会が伴います。</p>
          
          <h3>税金と生活費</h3>
          <ul>
            <li><strong>所得税:</strong> 給与に応じて5〜45%、多くの控除あり</li>
            <li><strong>生活費:</strong> 1人あたり月15万〜25万円（食費、交通費、光熱費）</li>
            <li><strong>家賃:</strong> 地域と住宅タイプに応じて月5万〜15万円</li>
          </ul>
          
          <h3>結論</h3>
          <p>日本で働くことは、高給与だけでなく、多くの社会福祉と発展機会をもたらします。Next Step Vietnamのサポートにより、最適な待遇の仕事を見つけることができます。</p>
        `,
        excerpt: 'Khám phá mức lương và phúc lợi hấp dẫn cho kỹ sư Việt Nam tại Nhật Bản. Từ 3.5-12 triệu Yên/năm tùy kinh nghiệm, cùng nhiều phúc lợi xã hội và cơ hội phát triển.',
        excerptJa: 'ベトナムのエンジニアの日本での魅力的な給与と福利厚生を発見。経験に応じて年間350〜1200万円、多くの社会福祉と発展機会を提供。',
        mainImage: '/images/news/salary-benefits.jpg',
        publishDate: new Date('2024-01-25'),
        isPublished: true,
        isFeatured: true,
        onHome: false,
        views: 0,
        tags: ['lương', 'phúc lợi', 'đãi ngộ', 'Nhật Bản', '給与', '福利厚生', '待遇'],
        author: 'Next Step Vietnam',
        seo: {
          metaTitle: 'Lương Và Phúc Lợi Cho Kỹ Sư Việt Nam Tại Nhật Bản | Next Step Vietnam',
          metaDescription: 'Tìm hiểu mức lương và phúc lợi chi tiết cho kỹ sư Việt Nam tại Nhật Bản. Từ 3.5-12 triệu Yên/năm, bảo hiểm đầy đủ, và nhiều phúc lợi khác.',
          metaKeywords: ['lương kỹ sư Nhật', 'phúc lợi Nhật Bản', 'đãi ngộ kỹ sư', 'engineer salary Japan', 'エンジニア給与', '日本福利厚生'],
          ogImage: '/images/news/salary-benefits.jpg'
        }
      },
      {
        title: 'Hướng Dẫn Xin Visa Làm Việc Cho Kỹ Sư Tại Nhật Bản - Quy Trình Chi Tiết',
        titleJa: 'エンジニアの日本就労ビザ申請ガイド - 詳細なプロセス',
        content: `
          <h2>Hướng Dẫn Toàn Diện Về Visa Làm Việc Tại Nhật Bản</h2>
          <p>Xin visa làm việc tại Nhật Bản là bước quan trọng đầu tiên trong hành trình nghề nghiệp của các kỹ sư Việt Nam. Bài viết này sẽ cung cấp hướng dẫn chi tiết về các loại visa, quy trình xin visa, và các giấy tờ cần thiết.</p>
          
          <h3>Các Loại Visa Phổ Biến Cho Kỹ Sư</h3>
          <h4>1. Visa Kỹ Thuật - Nhân Văn - Nghiệp Vụ Quốc Tế (技術・人文知識・国際業務)</h4>
          <p>Đây là loại visa phổ biến nhất cho kỹ sư làm việc tại Nhật Bản. Visa này dành cho:</p>
          <ul>
            <li>Kỹ sư phần mềm (Software Engineer)</li>
            <li>Kỹ sư hệ thống (Systems Engineer)</li>
            <li>Kỹ sư phát triển ứng dụng (Application Developer)</li>
            <li>Kỹ sư AI/Machine Learning</li>
            <li>Kỹ sư DevOps</li>
            <li>Kỹ sư QA/Testing</li>
          </ul>
          <p><strong>Thời hạn:</strong> 1 năm, 3 năm, hoặc 5 năm tùy theo hồ sơ</p>
          <p><strong>Điều kiện:</strong> Bằng đại học chuyên ngành liên quan hoặc 10 năm kinh nghiệm làm việc</p>
          
          <h4>2. Visa Kỹ Sư (エンジニア)</h4>
          <p>Dành cho các kỹ sư có chuyên môn kỹ thuật cụ thể:</p>
          <ul>
            <li>Kỹ sư điện tử</li>
            <li>Kỹ sư cơ khí</li>
            <li>Kỹ sư xây dựng</li>
            <li>Kỹ sư tự động hóa</li>
          </ul>
          
          <h4>3. Visa Nội Bộ Công Ty (企業内転勤)</h4>
          <p>Dành cho nhân viên được chuyển từ công ty mẹ tại Việt Nam sang chi nhánh tại Nhật Bản.</p>
          
          <h3>Quy Trình Xin Visa</h3>
          <h4>Bước 1: Tìm Công Ty Tuyển Dụng</h4>
          <ul>
            <li>Tìm công ty Nhật Bản phù hợp với chuyên môn của bạn</li>
            <li>Ứng tuyển và vượt qua vòng phỏng vấn</li>
            <li>Nhận được offer letter từ công ty</li>
          </ul>
          
          <h4>Bước 2: Công Ty Nộp Đơn Xin Giấy Chứng Nhận Tư Cách Lưu Trú (COE)</h4>
          <p>Công ty tuyển dụng sẽ nộp đơn xin COE tại Cục Quản lý Xuất nhập cảnh Nhật Bản. Thời gian xử lý: 1-3 tháng.</p>
          <p><strong>Giấy tờ cần thiết:</strong></p>
          <ul>
            <li>Bằng đại học (bản dịch tiếng Nhật hoặc tiếng Anh có công chứng)</li>
            <li>Bảng điểm (nếu cần)</li>
            <li>CV/Resume</li>
            <li>Hợp đồng lao động hoặc offer letter</li>
            <li>Mô tả công việc chi tiết</li>
            <li>Giấy tờ chứng minh kinh nghiệm làm việc</li>
            <li>Chứng chỉ tiếng Nhật (nếu có)</li>
          </ul>
          
          <h4>Bước 3: Nhận COE và Xin Visa</h4>
          <ul>
            <li>Công ty nhận COE và gửi cho bạn</li>
            <li>Bạn nộp đơn xin visa tại Đại sứ quán/Lãnh sự quán Nhật Bản tại Việt Nam</li>
            <li>Thời gian xử lý: 5-7 ngày làm việc</li>
          </ul>
          
          <h4>Bước 4: Nhập Cảnh và Làm Thẻ Cư Trú</h4>
          <ul>
            <li>Nhập cảnh Nhật Bản với visa</li>
            <li>Làm thẻ cư trú (在留カード) tại văn phòng xuất nhập cảnh địa phương trong vòng 14 ngày</li>
            <li>Đăng ký địa chỉ tại tòa thị chính địa phương</li>
          </ul>
          
          <h3>Giấy Tờ Cần Chuẩn Bị</h3>
          <h4>Từ Phía Ứng Viên</h4>
          <ul>
            <li><strong>Bằng đại học:</strong> Bản gốc + bản dịch tiếng Nhật/Anh có công chứng</li>
            <li><strong>Bảng điểm:</strong> Bản gốc + bản dịch (nếu yêu cầu)</li>
            <li><strong>CV/Resume:</strong> Bằng tiếng Nhật hoặc tiếng Anh</li>
            <li><strong>Chứng chỉ tiếng Nhật:</strong> JLPT N3 trở lên (nếu có)</li>
            <li><strong>Chứng chỉ chuyên môn:</strong> Các chứng chỉ IT, công nghệ (nếu có)</li>
            <li><strong>Giấy tờ chứng minh kinh nghiệm:</strong> Hợp đồng lao động cũ, giấy xác nhận công việc</li>
            <li><strong>Hộ chiếu:</strong> Còn hiệu lực ít nhất 6 tháng</li>
            <li><strong>Ảnh thẻ:</strong> 4.5cm x 4.5cm, nền trắng, chụp trong 3 tháng gần nhất</li>
          </ul>
          
          <h4>Từ Phía Công Ty</h4>
          <ul>
            <li>Giấy đăng ký kinh doanh (登記簿謄本)</li>
            <li>Báo cáo tài chính</li>
            <li>Danh sách nhân viên</li>
            <li>Mô tả công việc chi tiết</li>
            <li>Hợp đồng lao động</li>
            <li>Bảng lương dự kiến</li>
          </ul>
          
          <h3>Chi Phí</h3>
          <ul>
            <li><strong>Phí xin COE:</strong> Miễn phí</li>
            <li><strong>Phí xin visa:</strong> 3,000 Yên (khoảng 600,000 VNĐ)</li>
            <li><strong>Phí làm thẻ cư trú:</strong> Miễn phí</li>
            <li><strong>Phí dịch thuật:</strong> 500,000 - 2,000,000 VNĐ tùy số lượng giấy tờ</li>
            <li><strong>Phí công chứng:</strong> 100,000 - 500,000 VNĐ</li>
          </ul>
          
          <h3>Lưu Ý Quan Trọng</h3>
          <ul>
            <li><strong>Thời gian:</strong> Toàn bộ quy trình mất khoảng 3-6 tháng, nên bắt đầu sớm</li>
            <li><strong>Độ chính xác:</strong> Tất cả giấy tờ phải chính xác 100%, sai sót có thể làm chậm quá trình</li>
            <li><strong>Dịch thuật:</strong> Nên sử dụng dịch vụ dịch thuật chuyên nghiệp có công chứng</li>
            <li><strong>Hỗ trợ:</strong> Công ty tuyển dụng thường hỗ trợ toàn bộ quy trình</li>
            <li><strong>Gia hạn visa:</strong> Visa có thể được gia hạn trước khi hết hạn</li>
          </ul>
          
          <h3>Hỗ Trợ Từ Next Step Vietnam</h3>
          <p>Next Step Vietnam cung cấp dịch vụ hỗ trợ toàn diện cho quy trình xin visa:</p>
          <ul>
            <li>Tư vấn về loại visa phù hợp</li>
            <li>Hỗ trợ chuẩn bị và dịch thuật giấy tờ</li>
            <li>Hướng dẫn điền đơn và nộp hồ sơ</li>
            <li>Theo dõi tiến độ xử lý</li>
            <li>Hỗ trợ sau khi nhập cảnh</li>
          </ul>
          
          <h3>Kết Luận</h3>
          <p>Xin visa làm việc tại Nhật Bản là quy trình phức tạp nhưng hoàn toàn có thể thực hiện được với sự chuẩn bị kỹ lưỡng và hỗ trợ chuyên nghiệp. Với Next Step Vietnam, bạn sẽ được hướng dẫn từng bước để đảm bảo thành công.</p>
        `,
        contentJa: `
          <h2>日本就労ビザの包括的なガイド</h2>
          <p>日本の就労ビザ申請は、ベトナムのエンジニアのキャリアの旅における最初の重要なステップです。この記事では、ビザの種類、申請プロセス、必要な書類について詳細なガイドを提供します。</p>
          
          <h3>エンジニア向けの一般的なビザタイプ</h3>
          <h4>1. 技術・人文知識・国際業務ビザ</h4>
          <p>これは日本で働くエンジニアに最も一般的なビザタイプです。このビザは以下に適用されます：</p>
          <ul>
            <li>ソフトウェアエンジニア</li>
            <li>システムエンジニア</li>
            <li>アプリケーション開発者</li>
            <li>AI/機械学習エンジニア</li>
            <li>DevOpsエンジニア</li>
            <li>QA/テストエンジニア</li>
          </ul>
          <p><strong>有効期限:</strong> 申請内容に応じて1年、3年、または5年</p>
          <p><strong>条件:</strong> 関連分野の学士号または10年の実務経験</p>
          
          <h4>2. エンジニアビザ</h4>
          <p>特定の技術専門知識を持つエンジニア向け：</p>
          <ul>
            <li>電子エンジニア</li>
            <li>機械エンジニア</li>
            <li>建設エンジニア</li>
            <li>自動化エンジニア</li>
          </ul>
          
          <h4>3. 企業内転勤ビザ</h4>
          <p>ベトナムの本社から日本の支社への転勤社員向け。</p>
          
          <h3>ビザ申請プロセス</h3>
          <h4>ステップ1: 採用企業を見つける</h4>
          <ul>
            <li>専門性に合った日本の企業を見つける</li>
            <li>応募して面接を通過</li>
            <li>企業からオファーレターを受け取る</li>
          </ul>
          
          <h4>ステップ2: 企業が在留資格認定証明書（COE）を申請</h4>
          <p>採用企業が入国管理局にCOE申請を行います。処理時間：1〜3ヶ月。</p>
          <p><strong>必要な書類:</strong></p>
          <ul>
            <li>学士号（日本語または英語の公証翻訳）</li>
            <li>成績証明書（必要な場合）</li>
            <li>履歴書/レジュメ</li>
            <li>労働契約またはオファーレター</li>
            <li>詳細な職務内容</li>
            <li>実務経験証明書</li>
            <li>日本語能力証明書（ある場合）</li>
          </ul>
          
          <h4>ステップ3: COEを受け取り、ビザを申請</h4>
          <ul>
            <li>企業がCOEを受け取り、あなたに送付</li>
            <li>ベトナムの日本大使館/領事館でビザ申請</li>
            <li>処理時間：5〜7営業日</li>
          </ul>
          
          <h4>ステップ4: 入国と在留カード取得</h4>
          <ul>
            <li>ビザで日本に入国</li>
            <li>14日以内に地方入国管理局で在留カードを取得</li>
            <li>地方自治体で住所登録</li>
          </ul>
          
          <h3>準備が必要な書類</h3>
          <h4>申請者側</h4>
          <ul>
            <li><strong>学士号:</strong> 原本 + 公証翻訳（日本語/英語）</li>
            <li><strong>成績証明書:</strong> 原本 + 翻訳（必要な場合）</li>
            <li><strong>履歴書/レジュメ:</strong> 日本語または英語</li>
            <li><strong>日本語能力証明書:</strong> JLPT N3以上（ある場合）</li>
            <li><strong>専門資格:</strong> IT、技術関連の証明書（ある場合）</li>
            <li><strong>実務経験証明:</strong> 以前の労働契約、就業証明書</li>
            <li><strong>パスポート:</strong> 少なくとも6ヶ月の有効期限</li>
            <li><strong>証明写真:</strong> 4.5cm x 4.5cm、白背景、3ヶ月以内に撮影</li>
          </ul>
          
          <h4>企業側</h4>
          <ul>
            <li>登記簿謄本</li>
            <li>財務報告書</li>
            <li>従業員名簿</li>
            <li>詳細な職務内容</li>
            <li>労働契約</li>
            <li>給与見積もり</li>
          </ul>
          
          <h3>費用</h3>
          <ul>
            <li><strong>COE申請費:</strong> 無料</li>
            <li><strong>ビザ申請費:</strong> 3,000円（約60万ベトナムドン）</li>
            <li><strong>在留カード取得費:</strong> 無料</li>
            <li><strong>翻訳費:</strong> 書類数に応じて50万〜200万ベトナムドン</li>
            <li><strong>公証費:</strong> 10万〜50万ベトナムドン</li>
          </ul>
          
          <h3>重要な注意事項</h3>
          <ul>
            <li><strong>時間:</strong> 全プロセスは約3〜6ヶ月かかるため、早めに開始</li>
            <li><strong>正確性:</strong> すべての書類は100%正確でなければならず、誤りはプロセスを遅らせる可能性</li>
            <li><strong>翻訳:</strong> 公証付きの専門翻訳サービスを使用</li>
            <li><strong>サポート:</strong> 採用企業は通常、全プロセスをサポート</li>
            <li><strong>ビザ更新:</strong> ビザは有効期限前に更新可能</li>
          </ul>
          
          <h3>Next Step Vietnamからのサポート</h3>
          <p>Next Step Vietnamは、ビザ申請プロセスの包括的なサポートサービスを提供します：</p>
          <ul>
            <li>適切なビザタイプの相談</li>
            <li>書類準備と翻訳のサポート</li>
            <li>申請書記入と提出のガイダンス</li>
            <li>処理進捗の追跡</li>
            <li>入国後のサポート</li>
          </ul>
          
          <h3>結論</h3>
          <p>日本の就労ビザ申請は複雑なプロセスですが、適切な準備と専門的なサポートにより完全に実現可能です。Next Step Vietnamと共に、成功を保証するために各ステップをガイドします。</p>
        `,
        excerpt: 'Hướng dẫn chi tiết về quy trình xin visa làm việc tại Nhật Bản cho kỹ sư Việt Nam. Từ các loại visa, giấy tờ cần thiết, đến quy trình nộp đơn và chi phí.',
        excerptJa: 'ベトナムのエンジニアの日本就労ビザ申請プロセスの詳細ガイド。ビザタイプ、必要な書類、申請プロセス、費用まで。',
        mainImage: '/images/news/visa-guide.jpg',
        publishDate: new Date('2024-01-30'),
        isPublished: true,
        isFeatured: false,
        onHome: false,
        views: 0,
        tags: ['visa', 'giấy tờ', 'thủ tục', 'Nhật Bản', 'ビザ', '手続き', '書類'],
        author: 'Next Step Vietnam',
        seo: {
          metaTitle: 'Hướng Dẫn Xin Visa Làm Việc Cho Kỹ Sư Tại Nhật Bản | Next Step Vietnam',
          metaDescription: 'Hướng dẫn chi tiết quy trình xin visa làm việc tại Nhật Bản cho kỹ sư. Các loại visa, giấy tờ cần thiết, quy trình và chi phí. Tìm hiểu ngay!',
          metaKeywords: ['visa Nhật Bản', 'xin visa kỹ sư', 'thủ tục visa', 'Japan work visa', 'エンジニアビザ', '就労ビザ申請'],
          ogImage: '/images/news/visa-guide.jpg'
        }
      }
    ];

    console.log('📝 Starting to seed recruitment news...\n');

    for (const newsItem of newsItems) {
      try {
        // Check if news with same title already exists
        const existingNews = await News.findOne({ title: newsItem.title });
        
        if (existingNews) {
          console.log(`⏭️  News "${newsItem.title}" already exists, skipping...`);
          continue;
        }

        // Create news item (slug and slugJa will be auto-generated by pre-save hook)
        const news = new News(newsItem);
        await news.save();
        
        console.log(`✅ Created news: "${newsItem.title}"`);
        console.log(`   Slug: ${news.slug}`);
        if (news.slugJa) {
          console.log(`   SlugJa: ${news.slugJa}`);
        }
      } catch (error) {
        console.error(`❌ Error creating news "${newsItem.title}":`, error.message);
      }
    }

    console.log(`\n✅ Successfully seeded ${newsItems.length} recruitment news items!`);
    console.log('\n📊 Summary:');
    console.log('   - 4 professional news articles about Vietnam-Japan engineer recruitment');
    console.log('   - Full Vietnamese and Japanese content');
    console.log('   - Complete SEO metadata');
    console.log('   - Ready for publication');

  } catch (error) {
    console.error('❌ Error seeding recruitment news:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run seed if called directly
if (require.main === module) {
  seedRecruitmentNews();
}

module.exports = seedRecruitmentNews;

