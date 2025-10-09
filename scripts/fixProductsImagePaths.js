const mongoose = require("mongoose");
const Product = require("../models/Products");
require("dotenv").config();

async function fixProductsImagePaths() {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Lấy tất cả products data
    const productsData = await Product.find({});
    console.log(`Found ${productsData.length} products documents`);

    let totalUpdated = 0;

    for (const product of productsData) {
      let hasChanges = false;

      // Fix main image path
      if (product.mainImage && product.mainImage.startsWith("/images/")) {
        const oldPath = product.mainImage;
        product.mainImage = product.mainImage.replace(
          "/images/",
          "/uploads/images/"
        );
        console.log(
          `Updated main image for "${product.name}": ${oldPath} -> ${product.mainImage}`
        );
        hasChanges = true;
        totalUpdated++;
      }

      // Fix gallery images paths
      for (const galleryImage of product.galleryImages) {
        if (galleryImage.url && galleryImage.url.startsWith("/images/")) {
          const oldPath = galleryImage.url;
          galleryImage.url = galleryImage.url.replace(
            "/images/",
            "/uploads/images/"
          );
          console.log(
            `Updated gallery image for "${product.name}": ${oldPath} -> ${galleryImage.url}`
          );
          hasChanges = true;
          totalUpdated++;
        }
      }

      // Lưu nếu có thay đổi
      if (hasChanges) {
        await product.save();
        console.log(`Saved changes for product: ${product.name}`);
      }
    }

    console.log(
      `\n✅ Successfully updated ${totalUpdated} product image paths`
    );

    // Hiển thị kết quả sau khi cập nhật
    console.log("\n📋 Current products data:");
    const updatedProducts = await Product.find({});
    updatedProducts.forEach((product, index) => {
      console.log(`\nProduct ${index + 1}: ${product.name}`);
      console.log(`  Main Image: ${product.mainImage}`);
      console.log(`  Gallery Images: ${product.galleryImages.length}`);
      product.galleryImages.forEach((image, imageIndex) => {
        console.log(`    ${imageIndex + 1}. ${image.url}`);
      });
    });
  } catch (error) {
    console.error("❌ Error fixing products image paths:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// Chạy script
fixProductsImagePaths();
