const mongoose = require('mongoose');

const overviewBannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "SAIGON 3 JEAN GROUP"
  },
  description: {
    type: String,
    required: true,
    default: "Saigon 3 Jean Group is a leading manufacturer in Vietnam's textile and garment industry..."
  },
  backgroundImage: {
    type: String,
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('OverviewBanner', overviewBannerSchema);
