const Machinery = require('../models/Machinery');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images/machinery-page/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

class MachineryController {
  
  // ==================== GET ALL MACHINERY DATA ====================
  
  async getMachineryData(req, res) {
    try {
      const machinery = await Machinery.findOne({ isActive: true });
      
      if (!machinery) {
        return res.status(404).json({
          success: false,
          message: 'Machinery data not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          pageTitle: machinery.pageTitle,
          pageDescription: machinery.pageDescription,
          stages: machinery.sortedStages,
          seo: machinery.seo
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching machinery data',
        error: error.message
      });
    }
  }

  // ==================== STAGES MANAGEMENT ====================
  
  async getStages(req, res) {
    try {
      const { includeInactive = false } = req.query;
      const machinery = await Machinery.findOne({ isActive: true });
      
      if (!machinery) {
        return res.status(404).json({
          success: false,
          message: 'Machinery data not found'
        });
      }
      
      let stages = machinery.stages;
      
      if (!includeInactive) {
        stages = machinery.sortedStages;
      } else {
        stages = stages.sort((a, b) => a.order - b.order);
      }
      
      res.status(200).json({
        success: true,
        data: stages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching stages',
        error: error.message
      });
    }
  }

  async addStage(req, res) {
    try {
      const { stageNumber, title, description, order } = req.body;
      
      if (!stageNumber || !description) {
        return res.status(400).json({
          success: false,
          message: 'Stage number and description are required'
        });
      }
      
      const machinery = await Machinery.findOne({ isActive: true });
      
      if (!machinery) {
        return res.status(404).json({
          success: false,
          message: 'Machinery data not found'
        });
      }
      
      const newStage = {
        stageNumber: parseInt(stageNumber),
        title: title || `STAGE ${stageNumber}`,
        description: description.trim(),
        order: order || machinery.stages.length + 1,
        isActive: true,
        machines: []
      };
      
      await machinery.addStage(newStage);
      
      res.status(201).json({
        success: true,
        message: 'Stage added successfully',
        data: machinery.sortedStages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error adding stage',
        error: error.message
      });
    }
  }

  async getStageById(req, res) {
    try {
      const { stageId } = req.params;
      
      const machinery = await Machinery.findOne({ isActive: true });
      const stage = machinery.stages.id(stageId);
      
      if (!stage) {
        return res.status(404).json({
          success: false,
          message: 'Stage not found'
        });
      }
      
      // Return stage with sorted machines
      const stageData = stage.toObject();
      stageData.machines = stage.machines
        .filter(machine => machine.isActive)
        .sort((a, b) => a.order - b.order);
      
      res.status(200).json({
        success: true,
        data: stageData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching stage',
        error: error.message
      });
    }
  }

  async updateStage(req, res) {
    try {
      const { stageId } = req.params;
      const updateData = { ...req.body };
      
      if (updateData.title) updateData.title = updateData.title.trim();
      if (updateData.description) updateData.description = updateData.description.trim();
      
      const machinery = await Machinery.findOne({ isActive: true });
      await machinery.updateStage(stageId, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Stage updated successfully',
        data: machinery.sortedStages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating stage',
        error: error.message
      });
    }
  }

  async deleteStage(req, res) {
    try {
      const { stageId } = req.params;
      
      const machinery = await Machinery.findOne({ isActive: true });
      await machinery.deleteStage(stageId);
      
      res.status(200).json({
        success: true,
        message: 'Stage deleted successfully',
        data: machinery.sortedStages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting stage',
        error: error.message
      });
    }
  }

  async toggleStageStatus(req, res) {
    try {
      const { stageId } = req.params;
      
      const machinery = await Machinery.findOne({ isActive: true });
      await machinery.toggleStageStatus(stageId);
      
      const stage = machinery.stages.id(stageId);
      
      res.status(200).json({
        success: true,
        message: `Stage ${stage.isActive ? 'activated' : 'deactivated'} successfully`,
        data: machinery.sortedStages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error toggling stage status',
        error: error.message
      });
    }
  }

  // ==================== MACHINES MANAGEMENT ====================
  
  async getStageMachines(req, res) {
    try {
      const { stageId } = req.params;
      const { includeInactive = false } = req.query;
      
      const machinery = await Machinery.findOne({ isActive: true });
      const stage = machinery.stages.id(stageId);
      
      if (!stage) {
        return res.status(404).json({
          success: false,
          message: 'Stage not found'
        });
      }
      
      let machines = stage.machines;
      
      if (!includeInactive) {
        machines = machines.filter(machine => machine.isActive);
      }
      
      machines = machines.sort((a, b) => a.order - b.order);
      
      res.status(200).json({
        success: true,
        data: machines
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching stage machines',
        error: error.message
      });
    }
  }

  async addMachine(req, res) {
    try {
      const { stageId } = req.params;
      const { name, description, order, imageAlt } = req.body;
      // Lấy nhiều ảnh
      const machineImages = req.files && req.files.length > 0
        ? req.files.map(file => `/uploads/images/machinery-page/${file.filename}`)
        : (Array.isArray(req.body.images) ? req.body.images : []);
      const mainImage = machineImages[0]; // Ảnh đại diện chính

      console.log('addMachine - stageId:', stageId);
      console.log('addMachine - name:', name);
      console.log('addMachine - description:', description);
      console.log('addMachine - mainImage:', mainImage);

      if (!name || !description || !mainImage) {
        return res.status(400).json({
          success: false,
          message: 'Name, description, and at least one image are required'
        });
      }

      const machinery = await Machinery.findOne({ isActive: true });
      console.log('addMachine - machinery:', !!machinery);
      const stage = machinery.stages.id(stageId);
      console.log('addMachine - stage:', !!stage);

      if (!stage) {
        return res.status(404).json({
          success: false,
          message: 'Stage not found'
        });
      }

      const newMachine = {
        name: name.trim(),
        description: description.trim(),
        image: mainImage, // ảnh đại diện
        images: machineImages.map((url, idx) => ({
          url,
          alt: imageAlt || name.trim(),
          order: idx + 1
        })),
        imageAlt: imageAlt || name.trim(),
        order: Number(order) || stage.machines.length + 1, // Ép kiểu về số
        isActive: true
      };

      console.log('addMachine - newMachine:', newMachine);

      await machinery.addMachine(stageId, newMachine);

      res.status(201).json({
        success: true,
        message: 'Machine added successfully',
        data: machinery.sortedStages
      });
    } catch (error) {
      console.error('addMachine error:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding machine',
        error: error.message
      });
    }
  }

  async getMachineById(req, res) {
    try {
      const { stageId, machineId } = req.params;
      
      const machinery = await Machinery.findOne({ isActive: true });
      const stage = machinery.stages.id(stageId);
      
      if (!stage) {
        return res.status(404).json({
          success: false,
          message: 'Stage not found'
        });
      }
      
      const machine = stage.machines.id(machineId);
      
      if (!machine) {
        return res.status(404).json({
          success: false,
          message: 'Machine not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: machine
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching machine',
        error: error.message
      });
    }
  }

  async updateMachine(req, res) {
    try {
      const { stageId, machineId } = req.params;
      const updateData = { ...req.body };
      
      // Handle image upload if present
      if (req.files && req.files.length > 0) {
        // Nếu có nhiều hình ảnh được tải lên, xử lý chúng
        if (!updateData.images) updateData.images = [];
        
        const imageAlt = req.body.imageAlt || 'Machine';
        const newImages = req.files.map((file, index) => {
          return {
            url: `/uploads/images/machinery-page/${file.filename}`,
            alt: `${imageAlt} ${updateData.images.length + index + 1}`,
            order: updateData.images.length + index + 1
          };
        });
        
        updateData.images = [...newImages];
        
        // Cập nhật hình ảnh chính nếu đây là lần đầu tiên tải lên hình ảnh
        if (newImages.length > 0) {
          updateData.image = newImages[0].url;
        }
      } else if (req.file) {
        // Nếu chỉ có một hình ảnh được tải lên
        updateData.image = `/uploads/images/machinery-page/${req.file.filename}`;
      }
      
      if (updateData.name) updateData.name = updateData.name.trim();
      if (updateData.description) updateData.description = updateData.description.trim();
      
      const machinery = await Machinery.findOne({ isActive: true });
      await machinery.updateMachine(stageId, machineId, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Machine updated successfully',
        data: machinery.sortedStages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating machine',
        error: error.message
      });
    }
  }

  async deleteMachine(req, res) {
    try {
      const { stageId, machineId } = req.params;
      
      const machinery = await Machinery.findOne({ isActive: true });
      await machinery.deleteMachine(stageId, machineId);
      
      res.status(200).json({
        success: true,
        message: 'Machine deleted successfully',
        data: machinery.sortedStages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting machine',
        error: error.message
      });
    }
  }

  async toggleMachineStatus(req, res) {
    try {
      const { stageId, machineId } = req.params;
      
      const machinery = await Machinery.findOne({ isActive: true });
      await machinery.toggleMachineStatus(stageId, machineId);
      
      const stage = machinery.stages.id(stageId);
      const machine = stage.machines.id(machineId);
      
      res.status(200).json({
        success: true,
        message: `Machine ${machine.isActive ? 'activated' : 'deactivated'} successfully`,
        data: machinery.sortedStages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error toggling machine status',
        error: error.message
      });
    }
  }

  // ==================== BULK OPERATIONS ====================
  
  async reorderStages(req, res) {
    try {
      const { stageIds } = req.body;
      
      if (!stageIds || !Array.isArray(stageIds)) {
        return res.status(400).json({
          success: false,
          message: 'Stage IDs array is required'
        });
      }
      
      const machinery = await Machinery.findOne({ isActive: true });
      
      stageIds.forEach((stageId, index) => {
        const stage = machinery.stages.id(stageId);
        if (stage) {
          stage.order = index + 1;
        }
      });
      
      await machinery.save();
      
      res.status(200).json({
        success: true,
        message: 'Stages reordered successfully',
        data: machinery.sortedStages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error reordering stages',
        error: error.message
      });
    }
  }

  async reorderMachines(req, res) {
    try {
      const { stageId } = req.params;
      const { machineIds } = req.body;
      
      if (!machineIds || !Array.isArray(machineIds)) {
        return res.status(400).json({
          success: false,
          message: 'Machine IDs array is required'
        });
      }
      
      const machinery = await Machinery.findOne({ isActive: true });
      const stage = machinery.stages.id(stageId);
      
      if (!stage) {
        return res.status(404).json({
          success: false,
          message: 'Stage not found'
        });
      }
      
      machineIds.forEach((machineId, index) => {
        const machine = stage.machines.id(machineId);
        if (machine) {
          machine.order = index + 1;
        }
      });
      
      await machinery.save();
      
      res.status(200).json({
        success: true,
        message: 'Machines reordered successfully',
        data: machinery.sortedStages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error reordering machines',
        error: error.message
      });
    }
  }

  // ==================== PAGE SETTINGS ====================
  
  async updatePageSettings(req, res) {
    try {
      const { pageTitle, pageDescription, seo } = req.body;
      
      const machinery = await Machinery.findOne({ isActive: true });
      
      if (pageTitle) machinery.pageTitle = pageTitle.trim();
      if (pageDescription) machinery.pageDescription = pageDescription.trim();
      if (seo) {
        machinery.seo = { ...machinery.seo, ...seo };
      }
      
      await machinery.save();
      
      res.status(200).json({
        success: true,
        message: 'Page settings updated successfully',
        data: {
          pageTitle: machinery.pageTitle,
          pageDescription: machinery.pageDescription,
          seo: machinery.seo
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating page settings',
        error: error.message
      });
    }
  }

  // ==================== STATISTICS ====================
  
  async getMachineryStats(req, res) {
    try {
      const machinery = await Machinery.findOne({ isActive: true });
      
      const totalMachines = machinery.stages.reduce((total, stage) => {
        return total + stage.machines.length;
      }, 0);
      
      const activeMachines = machinery.stages.reduce((total, stage) => {
        return total + stage.machines.filter(machine => machine.isActive).length;
      }, 0);
      
      const stats = {
        totalStages: machinery.stages.length,
        activeStages: machinery.stages.filter(stage => stage.isActive).length,
        totalMachines,
        activeMachines,
        lastUpdated: machinery.updatedAt
      };
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching machinery statistics',
        error: error.message
      });
    }
  }

  // ==================== MACHINE IMAGES MANAGEMENT ====================
  
  async addMachineImages(req, res) {
    try {
      const { stageId, machineId } = req.params;
      let files = [];
      if (Array.isArray(req.files)) {
        files = req.files;
      } else if (req.files && typeof req.files === 'object') {
        files = Object.values(req.files).flat();
      }
      console.log('[addMachineImages] Received files:', files && files.length, files.map(f => f.filename));
      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No images uploaded'
        });
      }
      const machinery = await Machinery.findOne({ isActive: true });
      const stage = machinery.stages.id(stageId);
      if (!stage) {
        return res.status(404).json({
          success: false,
          message: 'Stage not found'
        });
      }
      const machine = stage.machines.id(machineId);
      if (!machine) {
        return res.status(404).json({
          success: false,
          message: 'Machine not found'
        });
      }
      if (!machine.images) {
        machine.images = [];
      }
      console.log('[addMachineImages] Images before push:', machine.images.length, machine.images);
      const imageAlt = req.body.imageAlt || machine.name;
      const newImages = files.map((file, index) => ({
        url: `/uploads/images/machinery-page/${file.filename}`,
        alt: `${imageAlt} ${machine.images.length + index + 1}`,
        order: machine.images.length + index + 1
      }));
      machine.images.push(...newImages);
      // Cập nhật lại order cho toàn bộ images
      machine.images.forEach((img, idx) => { img.order = idx + 1; });
      console.log('[addMachineImages] Images after push:', machine.images.length, machine.images);
      machinery.markModified('stages');
      console.log('[addMachineImages] Saving machinery...');
      await machinery.save();
      console.log('[addMachineImages] Save done. Images in DB:', machine.images);
      // Trả về danh sách images đã sort theo order
      res.status(201).json({
        success: true,
        message: 'Machine images added successfully',
        data: machine.images.sort((a, b) => a.order - b.order)
      });
    } catch (error) {
      console.error('[addMachineImages] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding machine images',
        error: error.message
      });
    }
  }
  
  async updateMachineImage(req, res) {
    try {
      const { stageId, machineId, imageIndex } = req.params;
      const { alt } = req.body;
      const url = req.file ? `/uploads/images/machinery-page/${req.file.filename}` : null;
      
      const machinery = await Machinery.findOne({ isActive: true });
      const stage = machinery.stages.id(stageId);
      
      if (!stage) {
        return res.status(404).json({
          success: false,
          message: 'Stage not found'
        });
      }
      
      const machine = stage.machines.id(machineId);
      if (!machine) {
        return res.status(404).json({
          success: false,
          message: 'Machine not found'
        });
      }
      
      if (!machine.images || !machine.images[imageIndex]) {
        return res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }
      
      // Update image properties
      if (url) {
        machine.images[imageIndex].url = url;
      }
      
      if (alt) {
        machine.images[imageIndex].alt = alt;
      }
      
      // If this is the main image, update machine.image as well
      if (machine.image === machine.images[imageIndex].url && url) {
        machine.image = url;
      }
      
      await machinery.save();
      
      res.status(200).json({
        success: true,
        message: 'Machine image updated successfully',
        data: machine.images.sort((a, b) => a.order - b.order)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating machine image',
        error: error.message
      });
    }
  }
  
  async deleteMachineImage(req, res) {
    try {
      const { stageId, machineId, imageIndex } = req.params;
      
      const machinery = await Machinery.findOne({ isActive: true });
      const stage = machinery.stages.id(stageId);
      
      if (!stage) {
        return res.status(404).json({
          success: false,
          message: 'Stage not found'
        });
      }
      
      const machine = stage.machines.id(machineId);
      if (!machine) {
        return res.status(404).json({
          success: false,
          message: 'Machine not found'
        });
      }
      
      if (!machine.images || !machine.images[imageIndex]) {
        return res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }
      
      // Check if this is the main image
      const isMainImage = machine.image === machine.images[imageIndex].url;
      
      // Remove the image
      machine.images.splice(imageIndex, 1);
      
      // If we removed the main image, update it to the first available image if any exist
      if (isMainImage && machine.images.length > 0) {
        machine.image = machine.images[0].url;
      } else if (isMainImage) {
        // No images left, clear the main image
        machine.image = '';
      }
      
      await machinery.save();
      
      res.status(200).json({
        success: true,
        message: 'Machine image deleted successfully',
        data: machine.images.sort((a, b) => a.order - b.order)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting machine image',
        error: error.message
      });
    }
  }
  
  async reorderMachineImages(req, res) {
    try {
      const { stageId, machineId } = req.params;
      const { imageOrder } = req.body;
      
      if (!Array.isArray(imageOrder)) {
        return res.status(400).json({
          success: false,
          message: 'Image order must be an array of image indices'
        });
      }
      
      const machinery = await Machinery.findOne({ isActive: true });
      
      if (!machinery) {
        return res.status(404).json({
          success: false,
          message: 'Machinery data not found'
        });
      }
      
      const stage = machinery.stages.id(stageId);
      
      if (!stage) {
        return res.status(404).json({
          success: false,
          message: 'Stage not found'
        });
      }
      
      const machine = stage.machines.id(machineId);
      
      if (!machine) {
        return res.status(404).json({
          success: false,
          message: 'Machine not found'
        });
      }
      
      if (!machine.images || machine.images.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No images to reorder'
        });
      }
      
      // Update order based on the provided array
      imageOrder.forEach((imageId, index) => {
        const image = machine.images.id(imageId);
        if (image) {
          image.order = index;
        }
      });
      
      await machinery.save();
      
      res.status(200).json({
        success: true,
        message: 'Machine images reordered successfully',
        data: machine.images.sort((a, b) => a.order - b.order)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error reordering machine images',
        error: error.message
      });
    }
  }

  async deleteMachineImageById(req, res) {
    try {
      const { stageId, machineId, imageId } = req.params;
      const machinery = await Machinery.findOne({ isActive: true });
      const stage = machinery.stages.id(stageId);
      if (!stage) return res.status(404).json({ success: false, message: 'Stage not found' });
      const machine = stage.machines.id(machineId);
      if (!machine) return res.status(404).json({ success: false, message: 'Machine not found' });
      const idx = machine.images.findIndex(img => img._id?.toString() === imageId);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Image not found' });
      machine.images.splice(idx, 1);
      await machinery.save();
      res.status(200).json({ success: true, data: machine.images });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting image', error: error.message });
    }
  }
}

module.exports = {
  MachineryController: new MachineryController(),
  upload,
  uploadMachineImages: upload.array('images', 10) // Allow up to 10 images, field name must match frontend
};