const mongoose = require("mongoose");
const {
  Hero,
  HomeSection,
  Customer,
  Certification,
  News,
} = require("../models");

// Kết nối database
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/saigon3jean",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Mapping từ đường dẫn hiện tại trong DB sang file thực tế
const FILE_MAPPINGS = {
  // Certifications - từ DB hiện tại sang file thực tế
  "/uploads/images/certification/leed-gold.png":
    "/uploads/images/certification/leed_gold.png",
  "/uploads/images/certification/iso-9001.png":
    "/uploads/images/certification/certificate.png",
  "/uploads/images/certification/sustainable.png":
    "/uploads/images/certification/oeko_tex.png",

  // News images - từ DB hiện tại sang file thực tế
  "/uploads/images/news/news-eco-denim.jpg": "/uploads/images/news/post_2.png",
  "/uploads/images/news/news-leed.jpg": "/uploads/images/news/post_1.jpg",

  // Customer logos - từ DB hiện tại sang file thực tế
  "/uploads/images/branding_our_customer/rodd-gunn.png":
    "/uploads/images/branding_our_customer/rodd&gunn.png",
  "/uploads/images/branding_our_customer/chicos.png":
    "/uploads/images/branding_our_customer/chico.png",
  "/uploads/images/branding_our_customer/loyalist.png":
    "/uploads/images/branding_our_customer/the_loyalist.png",

  // Sections - nếu có đường dẫn sai
  "/uploads/images/energy.jpg": "/uploads/images/home_banner-section3.png",
};

async function fixImagePaths() {
  try {
    console.log("🔧 Bắt đầu sửa đường dẫn hình ảnh với mapping chính xác...");

    // 1. Sửa Hero background image
    const hero = await Hero.findOne({ isActive: true });
    if (hero && hero.backgroundImage) {
      const newPath = FILE_MAPPINGS[hero.backgroundImage];
      if (newPath && newPath !== hero.backgroundImage) {
        console.log(`✅ Hero: ${hero.backgroundImage} → ${newPath}`);
        hero.backgroundImage = newPath;
        await hero.save();
      }
    }

    // 2. Sửa Home sections media URLs
    const homeSection = await HomeSection.findOne({ isActive: true });
    if (homeSection && homeSection.sections) {
      let updated = false;
      homeSection.sections.forEach((section) => {
        if (section.mediaUrl) {
          const newPath = FILE_MAPPINGS[section.mediaUrl];
          if (newPath && newPath !== section.mediaUrl) {
            console.log(
              `✅ Section "${section.title}": ${section.mediaUrl} → ${newPath}`
            );
            section.mediaUrl = newPath;
            updated = true;
          }
        }
      });
      if (updated) {
        await homeSection.save();
        console.log("✅ Đã sửa home sections media URLs");
      }
    }

    // 3. Sửa Customer logos - kiểm tra file tồn tại
    const customer = await Customer.findOne({ isActive: true });
    if (customer && customer.categories) {
      let updated = false;

      // Sửa denim & woven logos
      if (customer.categories.denimWoven) {
        customer.categories.denimWoven.forEach((item) => {
          if (item.logo) {
            const newPath = FILE_MAPPINGS[item.logo];
            if (newPath && newPath !== item.logo) {
              console.log(
                `✅ Customer "${item.name}": ${item.logo} → ${newPath}`
              );
              item.logo = newPath;
              updated = true;
            }
          }
        });
      }

      // Sửa knit logos
      if (customer.categories.knit) {
        customer.categories.knit.forEach((item) => {
          if (item.logo) {
            const newPath = FILE_MAPPINGS[item.logo];
            if (newPath && newPath !== item.logo) {
              console.log(
                `✅ Customer "${item.name}": ${item.logo} → ${newPath}`
              );
              item.logo = newPath;
              updated = true;
            }
          }
        });
      }

      if (updated) {
        await customer.save();
        console.log("✅ Đã sửa customer logos");
      }
    }

    // 4. Sửa Certification images
    const certification = await Certification.findOne({ isActive: true });
    if (certification && certification.certifications) {
      let updated = false;
      certification.certifications.forEach((cert) => {
        if (cert.image) {
          const newPath = FILE_MAPPINGS[cert.image];
          if (newPath && newPath !== cert.image) {
            console.log(`✅ Cert "${cert.name}": ${cert.image} → ${newPath}`);
            cert.image = newPath;
            updated = true;
          }
        }
      });
      if (updated) {
        await certification.save();
        console.log("✅ Đã sửa certification images");
      }
    }

    // 5. Sửa News images
    const newsList = await News.find({ isPublished: true });
    let newsUpdated = false;
    for (const news of newsList) {
      if (news.image) {
        const newPath = FILE_MAPPINGS[news.image];
        if (newPath && newPath !== news.image) {
          console.log(`✅ News "${news.title}": ${news.image} → ${newPath}`);
          news.image = newPath;
          await news.save();
          newsUpdated = true;
        }
      }
    }
    if (newsUpdated) {
      console.log("✅ Đã sửa news images");
    }

    console.log("🎉 Hoàn thành sửa đường dẫn hình ảnh với mapping chính xác!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi sửa đường dẫn:", error);
    process.exit(1);
  }
}

fixImagePaths();
