/**
 * Script tối ưu hóa hình ảnh
 * 
 * Script này sẽ quét tất cả hình ảnh trong thư mục uploads/images
 * và tạo các phiên bản tối ưu (WebP, thumbnail, medium) cho mỗi hình ảnh
 */

const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');

// Cấu hình cho các phiên bản hình ảnh
const imageConfig = {
  thumbnail: { width: 300, quality: 70 },
  medium: { width: 800, quality: 75 },
  webp: { quality: 80 }
};

/**
 * Xử lý một hình ảnh để tạo các phiên bản tối ưu
 */
async function processImage(filePath) {
  try {
    const fileInfo = path.parse(filePath);
    const originalSize = (await fs.stat(filePath)).size;
    
    // Bỏ qua nếu không phải hình ảnh
    if (!fileInfo.ext.match(/\.(jpg|jpeg|png|webp)$/i)) {
      return { 
        success: false, 
        message: 'Không phải file hình ảnh',
        path: filePath 
      };
    }

    // Đường dẫn cho các phiên bản khác nhau
    const webpPath = path.join(fileInfo.dir, `${fileInfo.name}.webp`);
    const thumbnailPath = path.join(fileInfo.dir, `${fileInfo.name}-thumbnail.webp`);
    const mediumPath = path.join(fileInfo.dir, `${fileInfo.name}-medium.webp`);
    
    // Tạo phiên bản WebP (nén tốt nhất)
    await sharp(filePath)
      .webp({ quality: imageConfig.webp.quality })
      .toFile(webpPath);
      
    // Tạo thumbnail
    await sharp(filePath)
      .resize({ 
        width: imageConfig.thumbnail.width, 
        height: imageConfig.thumbnail.width, 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .webp({ quality: imageConfig.thumbnail.quality })
      .toFile(thumbnailPath);
      
    // Tạo phiên bản trung bình
    await sharp(filePath)
      .resize({ 
        width: imageConfig.medium.width, 
        height: imageConfig.medium.width, 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .webp({ quality: imageConfig.medium.quality })
      .toFile(mediumPath);
    
    // Lấy kích thước file để log
    const webpSize = (await fs.stat(webpPath)).size;
    const thumbnailSize = (await fs.stat(thumbnailPath)).size;
    const mediumSize = (await fs.stat(mediumPath)).size;
    
    const savings = originalSize - webpSize;
    const savingsPercent = Math.round((savings / originalSize) * 100);
    
    console.log(`✅ Đã tối ưu: ${path.basename(filePath)}`);
    console.log(`  Gốc: ${(originalSize / 1024).toFixed(2)}KB`);
    console.log(`  WebP: ${(webpSize / 1024).toFixed(2)}KB (giảm ${savingsPercent}%)`);
    console.log(`  Thumbnail: ${(thumbnailSize / 1024).toFixed(2)}KB`);
    console.log(`  Medium: ${(mediumSize / 1024).toFixed(2)}KB`);
    
    return {
      success: true,
      path: filePath,
      versions: {
        original: filePath,
        webp: webpPath,
        thumbnail: thumbnailPath,
        medium: mediumPath
      },
      sizes: {
        original: originalSize,
        webp: webpSize,
        thumbnail: thumbnailSize,
        medium: mediumSize
      },
      savings: {
        bytes: savings,
        percent: savingsPercent
      }
    };
  } catch (error) {
    console.error(`❌ Lỗi xử lý hình ảnh ${filePath}:`, error);
    return { 
      success: false, 
      message: error.message,
      path: filePath 
    };
  }
}

/**
 * Xử lý tất cả hình ảnh trong một thư mục
 */
async function processDirectory(directory) {
  try {
    console.log(`📁 Đang quét thư mục: ${directory}`);
    
    // Lấy tất cả file trong thư mục
    const files = await fs.readdir(directory);
    
    let stats = {
      total: 0,
      processed: 0,
      failed: 0,
      skipped: 0,
      totalSavings: 0
    };
    
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = await fs.stat(filePath);
      
      // Xử lý thư mục đệ quy
      if (stat.isDirectory()) {
        // Bỏ qua thư mục thumbnails và medium để tránh xử lý lại
        if (file === 'thumbnails' || file === 'medium') {
          continue;
        }
        
        const subStats = await processDirectory(filePath);
        stats.total += subStats.total;
        stats.processed += subStats.processed;
        stats.failed += subStats.failed;
        stats.skipped += subStats.skipped;
        stats.totalSavings += subStats.totalSavings;
        continue;
      }
      
      stats.total++;
      
      // Chỉ xử lý hình ảnh
      if (!file.match(/\.(jpg|jpeg|png)$/i)) {
        console.log(`⏩ Bỏ qua file không phải hình ảnh: ${file}`);
        stats.skipped++;
        continue;
      }
      
      // Bỏ qua các file đã tối ưu
      if (file.includes('-thumbnail.') || file.includes('-medium.') || file.endsWith('.webp')) {
        console.log(`⏩ Bỏ qua file đã tối ưu: ${file}`);
        stats.skipped++;
        continue;
      }
      
      // Xử lý hình ảnh
      console.log(`🔄 Đang xử lý: ${file}`);
      const result = await processImage(filePath);
      
      if (result.success) {
        stats.processed++;
        stats.totalSavings += result.savings.bytes;
      } else {
        stats.failed++;
        console.error(`❌ Lỗi: ${result.message}`);
      }
    }
    
    return stats;
  } catch (error) {
    console.error(`❌ Lỗi khi xử lý thư mục ${directory}:`, error);
    return { 
      total: 0,
      processed: 0,
      failed: 0,
      skipped: 0,
      totalSavings: 0
    };
  }
}

/**
 * Hàm chính
 */
async function main() {
  try {
    console.log('🚀 Bắt đầu quá trình tối ưu hóa hình ảnh...');
    
    // Tạo thư mục nếu chưa tồn tại
    const dirs = ['uploads/images/thumbnails', 'uploads/images/medium'];
    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
        console.log(`📁 Đã tạo thư mục: ${dir}`);
      } catch (err) {
        if (err.code !== 'EEXIST') {
          console.error(`❌ Lỗi khi tạo thư mục ${dir}:`, err);
        }
      }
    }
    
    const imagesDir = path.join(__dirname, '..', 'uploads', 'images');
    const stats = await processDirectory(imagesDir);
    
    console.log('\n====== KẾT QUẢ TỐI ƯU HÓA ======');
    console.log(`📊 Tổng số file: ${stats.total}`);
    console.log(`✅ Đã xử lý: ${stats.processed}`);
    console.log(`❌ Thất bại: ${stats.failed}`);
    console.log(`⏩ Bỏ qua: ${stats.skipped}`);
    console.log(`💾 Tổng dung lượng tiết kiệm: ${(stats.totalSavings / (1024 * 1024)).toFixed(2)}MB`);
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

// Chạy script
main().then(() => {
  console.log('✅ Hoàn tất!');
}).catch(err => {
  console.error('❌ Lỗi:', err);
  process.exit(1);
}); 