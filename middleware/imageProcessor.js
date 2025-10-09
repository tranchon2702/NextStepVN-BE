const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

/**
 * Xử lý hình ảnh sau khi upload để tạo nhiều phiên bản
 */
async function processImage(filePath) {
  try {
    const fileInfo = path.parse(filePath);
    const originalSize = (await fs.stat(filePath)).size;
    
    // Bỏ qua nếu không phải hình ảnh
    if (!fileInfo.ext.match(/\.(jpg|jpeg|png|webp)$/i)) {
      return { original: filePath };
    }

    // Đường dẫn cho các phiên bản khác nhau
    const webpPath = path.join(fileInfo.dir, `${fileInfo.name}.webp`);
    const thumbnailPath = path.join(fileInfo.dir, `${fileInfo.name}-thumbnail.webp`);
    const mediumPath = path.join(fileInfo.dir, `${fileInfo.name}-medium.webp`);
    const lowPath = path.join(fileInfo.dir, `${fileInfo.name}-low.webp`);
    
    // Tạo phiên bản WebP (nén tốt nhất)
    // Kiểm tra kích thước ảnh gốc để xác định cách xử lý tốt nhất
    const metadata = await sharp(filePath).metadata();
    const isLargeImage = metadata.width > 1920 || metadata.height > 1920 || originalSize > 1024 * 1024; // Lớn hơn 1920px hoặc 1MB
    
    // Tối ưu hóa ảnh WebP chính
    if (filePath === webpPath) {
      const tempWebpPath = webpPath + '.temp';
      await sharp(filePath)
        .resize({ 
          width: isLargeImage ? 1920 : undefined, 
          height: isLargeImage ? 1920 : undefined, 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .webp({ quality: isLargeImage ? 70 : 80, effort: 6 })
        .toFile(tempWebpPath);
      // Sử dụng fsSync.renameSync để đảm bảo file đã được đổi tên trước khi tiếp tục
      fsSync.renameSync(tempWebpPath, webpPath);
    } else {
      await sharp(filePath)
        .resize({ 
          width: isLargeImage ? 1920 : undefined, 
          height: isLargeImage ? 1920 : undefined, 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .webp({ quality: isLargeImage ? 70 : 80, effort: 6 })
        .toFile(webpPath);
    }
      
    // Tạo thumbnail - giảm quality xuống 65 cho file nhỏ hơn
    await sharp(filePath)
      .resize({ width: 300, height: 300, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 65, effort: 6 })
      .toFile(thumbnailPath);
      
    // Tạo phiên bản trung bình - giảm quality xuống 70
    await sharp(filePath)
      .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 70, effort: 6 })
      .toFile(mediumPath);
      
    // Tạo phiên bản chất lượng thấp cho các ảnh lớn (đặc biệt hữu ích cho product details)
    if (isLargeImage) {
      await sharp(filePath)
        .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 50, effort: 6 })
        .toFile(lowPath);
    }
    
    // Lấy kích thước file để log
    const webpSize = (await fs.stat(webpPath)).size;
    
    console.log(`Đã tối ưu hình ảnh: ${path.basename(filePath)}`);
    console.log(`  Gốc: ${(originalSize / 1024).toFixed(2)}KB`);
    console.log(`  WebP: ${(webpSize / 1024).toFixed(2)}KB (giảm ${Math.round((1 - webpSize/originalSize) * 100)}%)`);
    
    // Chuẩn hóa path trả về dạng /uploads/images/...
    function toPublicPath(p) {
      if (!p) return '';
      // Đảm bảo luôn dùng dấu /
      return '/uploads/images/' + path.basename(p).replace(/\\/g, '/');
    }
    // Chuẩn bị kết quả trả về, thêm phiên bản low nếu có
    const result = {
      original: toPublicPath(filePath),
      webp: toPublicPath(webpPath),
      thumbnail: toPublicPath(thumbnailPath),
      medium: toPublicPath(mediumPath)
    };
    if (isLargeImage) {
      result.low = toPublicPath(lowPath);
    }
    return result;
  } catch (error) {
    console.error(`Lỗi xử lý hình ảnh ${filePath}:`, error);
    return { original: filePath };
  }
}

/**
 * Middleware xử lý hình ảnh sau khi upload
 */
const processUploadedImages = async (req, res, next) => {
  try {
    console.log('--- processUploadedImages ---');
    console.log('req.files:', req.files, 'typeof:', typeof req.files);
    if (req.files && !Array.isArray(req.files)) {
      console.log('req.files keys:', Object.keys(req.files));
    }
    console.log('req.file:', req.file);
    // Bỏ qua nếu không có file upload
    if (!req.files && !req.file) return next();
    
    // Xử lý file đơn
    if (req.file && req.file.path) {
      req.file.versions = await processImage(req.file.path);
    }
    
    // Xử lý nhiều file
    if (req.files) {
      // Xử lý mảng file
      if (Array.isArray(req.files)) {
        for (const file of req.files) {
          if (file.mimetype.startsWith('image/')) {
            file.versions = await processImage(file.path);
          }
        }
      } 
      // Xử lý object chứa mảng file
      else {
        for (const field in req.files) {
          for (const file of req.files[field]) {
            if (file.mimetype.startsWith('image/')) {
              file.versions = await processImage(file.path);
            }
          }
        }
      }
    }
    
    next();
  } catch (error) {
    console.error('Lỗi trong middleware xử lý hình ảnh:', error);
    next();
  }
};

module.exports = {
  processUploadedImages,
  processImage
};