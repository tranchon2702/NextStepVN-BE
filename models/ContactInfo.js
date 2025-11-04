const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  bannerImage: {
    type: String,
    required: true,
    default: "/uploads/images/contact-page/banner_contact.png"
  },
  address1: {
    type: String,
    required: true,
    default: "47 Đường số 17, Khu phố 3, P. Hiệp Bình Phước, TP. Thủ Đức, TP. HCM, Việt Nam"
  },
  address1Ja: {
    type: String,
    default: ""
  },
  address2: {
    type: String,
    required: true,
    default: "N2-D2 St, Nhon Trach Textile and Garment Industrial Park, Nhon Trach, Dong Nai Province, Vietnam"
  },
  address2Ja: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    required: true,
    default: "hr@saigon3jean.com.vn"
  },
  phone: {
    type: String,
    default: ""
  },
  workingHours: {
    type: String,
    default: "Monday - Friday: 8:00 AM - 5:00 PM"
  },
  mapEmbedUrl: {
    type: String,
    default: ""
  },
  socialLinks: {
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    youtube: { type: String, default: "" }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ContactInfo', contactInfoSchema);