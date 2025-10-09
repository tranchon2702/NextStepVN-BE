const fs = require("fs");
const path = require("path");

// Đường dẫn thư mục
const sourceDir = path.join(__dirname, "../../../final-saigon-3jean/images");
const targetDir = path.join(__dirname, "../uploads/images");

// Function để copy file
function copyFile(source, target) {
  try {
    if (fs.existsSync(source)) {
      // Tạo thư mục target nếu chưa tồn tại
      const targetDirPath = path.dirname(target);
      if (!fs.existsSync(targetDirPath)) {
        fs.mkdirSync(targetDirPath, { recursive: true });
      }

      fs.copyFileSync(source, target);
      console.log(`✅ Copied: ${path.basename(source)}`);
      return true;
    } else {
      console.log(`❌ Source not found: ${source}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error copying ${source}:`, error.message);
    return false;
  }
}

// Function để copy thư mục
function copyDirectory(source, target) {
  try {
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }

    const files = fs.readdirSync(source);

    files.forEach((file) => {
      const sourcePath = path.join(source, file);
      const targetPath = path.join(target, file);

      if (fs.statSync(sourcePath).isDirectory()) {
        copyDirectory(sourcePath, targetPath);
      } else {
        copyFile(sourcePath, targetPath);
      }
    });
  } catch (error) {
    console.error(`❌ Error copying directory ${source}:`, error.message);
  }
}

async function copyAllImages() {
  console.log("🔄 Bắt đầu copy hình ảnh...");

  try {
    // Copy toàn bộ thư mục images
    if (fs.existsSync(sourceDir)) {
      copyDirectory(sourceDir, targetDir);
      console.log("✅ Đã copy tất cả hình ảnh từ final-saigon-3jean/images");
    } else {
      console.log("❌ Thư mục source không tồn tại:", sourceDir);
    }

    // Copy video từ final-saigon-3jean
    const videoSource = path.join(
      __dirname,
      "../../../final-saigon-3jean/SAIGON 3_JEAN.mp4"
    );
    const videoTarget = path.join(
      __dirname,
      "../uploads/videos/SAIGON_3_JEAN.mp4"
    );

    if (fs.existsSync(videoSource)) {
      copyFile(videoSource, videoTarget);
      console.log("✅ Đã copy video SAIGON_3_JEAN.mp4");
    }

    console.log("🎉 Hoàn thành copy tất cả media files!");
  } catch (error) {
    console.error("❌ Lỗi khi copy files:", error);
  }
}

copyAllImages();
