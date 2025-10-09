const mongoose = require("mongoose");
const Machinery = require("../models/Machinery");
require("dotenv").config();

async function fixMachineryImagePaths() {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Lấy tất cả machinery data
    const machineryData = await Machinery.find({});
    console.log(`Found ${machineryData.length} machinery documents`);

    let totalUpdated = 0;

    for (const machinery of machineryData) {
      let hasChanges = false;

      // Duyệt qua tất cả stages
      for (const stage of machinery.stages) {
        // Duyệt qua tất cả machines trong stage
        for (const machine of stage.machines) {
          // Kiểm tra và fix đường dẫn hình ảnh
          if (machine.image && machine.image.startsWith("/images/")) {
            const oldPath = machine.image;
            machine.image = machine.image.replace(
              "/images/",
              "/uploads/images/"
            );
            console.log(
              `Updated machine "${machine.name}": ${oldPath} -> ${machine.image}`
            );
            hasChanges = true;
            totalUpdated++;
          }
        }
      }

      // Lưu nếu có thay đổi
      if (hasChanges) {
        await machinery.save();
        console.log(`Saved changes for machinery document: ${machinery._id}`);
      }
    }

    console.log(
      `\n✅ Successfully updated ${totalUpdated} machine image paths`
    );

    // Hiển thị kết quả sau khi cập nhật
    console.log("\n📋 Current machinery data:");
    const updatedMachinery = await Machinery.findOne({});
    if (updatedMachinery) {
      updatedMachinery.stages.forEach((stage, stageIndex) => {
        console.log(`\nStage ${stage.stageNumber}: ${stage.title}`);
        stage.machines.forEach((machine, machineIndex) => {
          console.log(`  Machine ${machineIndex + 1}: ${machine.name}`);
          console.log(`    Image: ${machine.image}`);
        });
      });
    }
  } catch (error) {
    console.error("❌ Error fixing machinery image paths:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// Chạy script
fixMachineryImagePaths();
