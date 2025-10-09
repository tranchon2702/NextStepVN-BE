const mongoose = require('mongoose');

const visionMissionSchema = new mongoose.Schema({
  vision: {
    icon: {
      type: String,
      default: "fas fa-eye"
    },
    title: {
      type: String,
      default: "VISION"
    },
    content: {
      type: String,
      required: true,
      default: "To assert our position as a pioneer in sustainable garment production..."
    }
  },
  mission: {
    icon: {
      type: String,
      default: "fas fa-bullseye"
    },
    title: {
      type: String,
      default: "MISSION"
    },
    content: {
      type: String,
      required: true,
      default: "To provide the highest quality denim garments and denim washing services..."
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VisionMission', visionMissionSchema);