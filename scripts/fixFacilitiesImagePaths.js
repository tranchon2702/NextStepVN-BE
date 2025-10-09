const mongoose = require("mongoose");
const Facilities = require("../models/Facilities");

// Kết nối database
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/saigon3jean",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

async function fixFacilitiesImagePaths() {
  try {
    console.log("🔧 Bắt đầu sửa đường dẫn hình ảnh facilities...");

    // Lấy dữ liệu facilities
    const facilities = await Facilities.findOne({ isActive: true });
    
    if (!facilities) {
      console.log("❌ Không tìm thấy dữ liệu facilities");
      process.exit(1);
    }

    console.log("📊 Dữ liệu facilities hiện tại:");
    console.log("Facility Features:", facilities.facilityFeatures.length);

    let updated = false;

    // Sửa đường dẫn ảnh cho facility features
    facilities.facilityFeatures.forEach((feature, index) => {
      if (feature.image && feature.image.startsWith("/images/")) {
        const oldPath = feature.image;
        const newPath = feature.image.replace("/images/", "/uploads/images/");

        console.log(
          `✅ Feature ${index + 1} "${feature.title}": ${oldPath} → ${newPath}`
        );
        feature.image = newPath;
        updated = true;
      }
    });

    if (updated) {
      await facilities.save();
      console.log("✅ Đã cập nhật đường dẫn ảnh facilities trong database");
    } else {
      console.log("ℹ️ Không có đường dẫn nào cần sửa");
    }

    // Kiểm tra lại sau khi sửa
    const updatedFacilities = await Facilities.findOne({ isActive: true });
    console.log("\n📋 Đường dẫn ảnh sau khi sửa:");
    updatedFacilities.facilityFeatures.forEach((feature, index) => {
      console.log(`${index + 1}. ${feature.title}: ${feature.image}`);
    });

    console.log("🎉 Hoàn thành sửa đường dẫn hình ảnh facilities!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi sửa đường dẫn:", error);
    process.exit(1);
  }
}

fixFacilitiesImagePaths();
