const mongoose = require("mongoose");
const { Customer } = require("../models");

// Kết nối database
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/saigon3jean",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

async function fixLoyalistPath() {
  try {
    console.log("🔧 Sửa đường dẫn loyalist logo...");

    const customer = await Customer.findOne({ isActive: true });

    if (customer && customer.categories && customer.categories.knit) {
      let updated = false;

      customer.categories.knit.forEach((item) => {
        if (
          item.name === "THE LOYALIST" &&
          item.logo === "/uploads/images/branding_our_customer/the loyalist.png"
        ) {
          console.log(
            `✅ Sửa "${item.name}": ${item.logo} → /uploads/images/branding_our_customer/the_loyalist.png`
          );
          item.logo = "/uploads/images/branding_our_customer/the_loyalist.png";
          updated = true;
        }
      });

      if (updated) {
        await customer.save();
        console.log("✅ Đã cập nhật database");
      } else {
        console.log("ℹ️ Không tìm thấy item cần sửa");
      }
    }

    console.log("🎉 Hoàn thành!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
}

fixLoyalistPath();
