const Candidate = require('../models/Candidate');
const fs = require('fs');
const path = require('path');

// Get all candidates with filters
exports.getAllCandidates = async (req, res) => {
  try {
    const { major, jlpt, maritalStatus, status, search, page = 1, limit = 10, showAll } = req.query;
    
    const filter = { isActive: true };
    
    // If showAll is not set (public view), only show ACTIVE candidates
    // If showAll=true (admin view), show all statuses
    if (showAll !== 'true') {
      filter.status = 'ACTIVE';
    }
    
    if (major) filter.major = major;
    if (jlpt) filter.jlpt = jlpt;
    if (maritalStatus) filter.maritalStatus = maritalStatus;
    
    // Allow filtering by specific status
    if (status) filter.status = status;
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const candidates = await Candidate.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Candidate.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: candidates,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error getting candidates:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách ứng viên',
      error: error.message
    });
  }
};

// Get candidate by ID
exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate || !candidate.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ứng viên'
      });
    }
    
    res.status(200).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    console.error('Error getting candidate:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin ứng viên',
      error: error.message
    });
  }
};

// Create new candidate
exports.createCandidate = async (req, res) => {
  try {
    const { name, email, major, jlpt, maritalStatus, phone, address, experience, skills, notes } = req.body;
    
    // Check if email already exists
    const existingCandidate = await Candidate.findOne({ email, isActive: true });
    if (existingCandidate) {
      return res.status(400).json({
        success: false,
        message: 'Email đã tồn tại'
      });
    }
    
    const candidateData = {
      name,
      email,
      major,
      jlpt,
      maritalStatus,
      phone,
      address,
      experience,
      skills: skills ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : [],
      notes
    };
    
    // Handle CV upload
    if (req.file) {
      candidateData.cvUrl = `/uploads/cvs/${req.file.filename}`;
      candidateData.cvFileName = req.file.originalname;
    }
    
    const candidate = new Candidate(candidateData);
    await candidate.save();
    
    res.status(201).json({
      success: true,
      message: 'Thêm ứng viên thành công',
      data: candidate
    });
  } catch (error) {
    console.error('Error creating candidate:', error);
    
    // Delete uploaded file if error
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/cvs', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm ứng viên',
      error: error.message
    });
  }
};

// Update candidate
exports.updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate || !candidate.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ứng viên'
      });
    }
    
    const { name, email, major, jlpt, maritalStatus, phone, address, experience, skills, notes, status } = req.body;
    
    // Check if email is being changed and already exists
    if (email && email !== candidate.email) {
      const existingCandidate = await Candidate.findOne({ email, isActive: true, _id: { $ne: req.params.id } });
      if (existingCandidate) {
        return res.status(400).json({
          success: false,
          message: 'Email đã tồn tại'
        });
      }
    }
    
    // Update fields
    if (name) candidate.name = name;
    if (email) candidate.email = email;
    if (major) candidate.major = major;
    if (jlpt) candidate.jlpt = jlpt;
    if (maritalStatus) candidate.maritalStatus = maritalStatus;
    if (phone) candidate.phone = phone;
    if (address) candidate.address = address;
    if (experience) candidate.experience = experience;
    if (skills) candidate.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (notes) candidate.notes = notes;
    if (status) candidate.status = status;
    
    // Handle CV upload
    if (req.file) {
      // Delete old CV if exists
      if (candidate.cvUrl) {
        const oldFilePath = path.join(__dirname, '..', candidate.cvUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      
      candidate.cvUrl = `/uploads/cvs/${req.file.filename}`;
      candidate.cvFileName = req.file.originalname;
    }
    
    await candidate.save();
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật ứng viên thành công',
      data: candidate
    });
  } catch (error) {
    console.error('Error updating candidate:', error);
    
    // Delete uploaded file if error
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/cvs', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật ứng viên',
      error: error.message
    });
  }
};

// Delete candidate (soft delete)
exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate || !candidate.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ứng viên'
      });
    }
    
    candidate.isActive = false;
    await candidate.save();
    
    res.status(200).json({
      success: true,
      message: 'Xóa ứng viên thành công'
    });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa ứng viên',
      error: error.message
    });
  }
};

// Delete CV file
exports.deleteCandidateCV = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    
    if (!candidate || !candidate.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ứng viên'
      });
    }
    
    if (candidate.cvUrl) {
      const filePath = path.join(__dirname, '..', candidate.cvUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      candidate.cvUrl = null;
      candidate.cvFileName = null;
      await candidate.save();
      
      res.status(200).json({
        success: true,
        message: 'Xóa CV thành công',
        data: candidate
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Ứng viên chưa có CV'
      });
    }
  } catch (error) {
    console.error('Error deleting CV:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa CV',
      error: error.message
    });
  }
};

