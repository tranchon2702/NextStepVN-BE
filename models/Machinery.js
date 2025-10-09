const mongoose = require('mongoose');

// Machine Schema
const MachineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  imageAlt: {
    type: String,
    default: function() {
      return this.name;
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  _id: true,
  timestamps: true 
});

// Stage Schema
const StageSchema = new mongoose.Schema({
  stageNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  title: {
    type: String,
    required: true,
    default: function() {
      return `STAGE ${this.stageNumber}`;
    }
  },
  description: {
    type: String,
    required: true
  },
  machines: [MachineSchema],
  order: {
    type: Number,
    default: function() {
      return this.stageNumber;
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  _id: true,
  timestamps: true 
});

// Main Machinery Schema
const MachinerySchema = new mongoose.Schema({
  // Page information
  pageTitle: {
    type: String,
    default: 'APPLICATION OF PRECISE PROGRAMMING, ENSURING CONSISTENCY IN PRODUCTION'
  },
  pageDescription: {
    type: String,
    default: 'Advanced machinery and precise programming systems for consistent, high-quality denim production'
  },
  
  // Production stages
  stages: [StageSchema],
  
  // SEO and meta information
  seo: {
    metaTitle: {
      type: String,
      default: 'Machinery - Saigon 3 Jean'
    },
    metaDescription: {
      type: String,
      default: 'Discover Saigon 3 Jean advanced machinery: laser machines, wash machines, and precision programming systems for consistent denim production.'
    },
    keywords: {
      type: [String],
      default: ['machinery', 'laser machine', 'wash machine', 'precision programming', 'denim production']
    }
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'machinery'
});

// Indexes for better performance
MachinerySchema.index({ isActive: 1 });
MachinerySchema.index({ 'stages.order': 1 });
MachinerySchema.index({ 'stages.isActive': 1 });
MachinerySchema.index({ 'stages.machines.order': 1 });

// Virtual for getting sorted active stages
MachinerySchema.virtual('sortedStages').get(function() {
  return this.stages
    .filter(stage => stage.isActive)
    .sort((a, b) => a.order - b.order)
    .map(stage => {
      const stageObj = stage.toObject();
      stageObj.machines = stage.machines
        .filter(machine => machine.isActive)
        .sort((a, b) => a.order - b.order)
        .map(machine => {
          const machineObj = machine.toObject();
          if (machine.images && machine.images.length > 0) {
            machineObj.images = machine.images.sort((a, b) => a.order - b.order);
          }
          return machineObj;
        });
      return stageObj;
    });
});

// Instance methods for stages
MachinerySchema.methods.addStage = function(stageData) {
  this.stages.push(stageData);
  return this.save();
};

MachinerySchema.methods.updateStage = function(stageId, updateData) {
  const stage = this.stages.id(stageId);
  if (stage) {
    Object.assign(stage, updateData);
    return this.save();
  }
  throw new Error('Stage not found');
};

MachinerySchema.methods.deleteStage = function(stageId) {
  this.stages.pull({ _id: stageId });
  return this.save();
};

MachinerySchema.methods.toggleStageStatus = function(stageId) {
  const stage = this.stages.id(stageId);
  if (stage) {
    stage.isActive = !stage.isActive;
    return this.save();
  }
  throw new Error('Stage not found');
};

// Instance methods for machines
MachinerySchema.methods.addMachine = function(stageId, machineData) {
  const stage = this.stages.id(stageId);
  if (stage) {
    stage.machines.push(machineData);
    return this.save();
  }
  throw new Error('Stage not found');
};

MachinerySchema.methods.updateMachine = function(stageId, machineId, updateData) {
  const stage = this.stages.id(stageId);
  if (stage) {
    const machine = stage.machines.id(machineId);
    if (machine) {
      Object.assign(machine, updateData);
      return this.save();
    }
    throw new Error('Machine not found');
  }
  throw new Error('Stage not found');
};

MachinerySchema.methods.deleteMachine = function(stageId, machineId) {
  const stage = this.stages.id(stageId);
  if (stage) {
    stage.machines.pull({ _id: machineId });
    return this.save();
  }
  throw new Error('Stage not found');
};

MachinerySchema.methods.toggleMachineStatus = function(stageId, machineId) {
  const stage = this.stages.id(stageId);
  if (stage) {
    const machine = stage.machines.id(machineId);
    if (machine) {
      machine.isActive = !machine.isActive;
      return this.save();
    }
    throw new Error('Machine not found');
  }
  throw new Error('Stage not found');
};

// Export model
module.exports = mongoose.model('Machinery', MachinerySchema);