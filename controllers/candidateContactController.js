const CandidateContactRequest = require('../models/CandidateContactRequest');
const Candidate = require('../models/Candidate');
const { sendEmailNotification } = require('../utils/emailHelper');

// Create contact request
exports.createContactRequest = async (req, res) => {
  try {
    const { candidateId, requesterName, requesterEmail, requesterPhone, companyName, message } = req.body;
    
    // Find candidate
    const candidate = await Candidate.findById(candidateId);
    if (!candidate || !candidate.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ứng viên'
      });
    }
    
    // Create contact request
    const contactRequest = new CandidateContactRequest({
      candidateId: candidate._id,
      candidateName: candidate.name,
      requesterName,
      requesterEmail,
      requesterPhone,
      companyName,
      message
    });
    
    await contactRequest.save();
    
    // Send email notification to Next Step
    try {
      await sendEmailNotification({
        to: process.env.ADMIN_EMAIL || 'admin@nextstepviet.com',
        subject: `Yêu cầu liên hệ ứng viên: ${candidate.name}`,
        html: `
          <h2>Yêu cầu liên hệ ứng viên mới</h2>
          <p><strong>Ứng viên:</strong> ${candidate.name}</p>
          <p><strong>Ngành nghề:</strong> ${candidate.major}</p>
          <p><strong>JLPT:</strong> ${candidate.jlpt}</p>
          <hr>
          <p><strong>Người yêu cầu:</strong> ${requesterName}</p>
          <p><strong>Email:</strong> ${requesterEmail}</p>
          ${requesterPhone ? `<p><strong>Số điện thoại:</strong> ${requesterPhone}</p>` : ''}
          ${companyName ? `<p><strong>Công ty:</strong> ${companyName}</p>` : ''}
          <p><strong>Lời nhắn:</strong></p>
          <p>${message}</p>
          <hr>
          <p>Vui lòng liên hệ lại với khách hàng trong thời gian sớm nhất.</p>
        `
      });
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Continue even if email fails
    }
    
    res.status(201).json({
      success: true,
      message: 'Gửi yêu cầu thành công. Chúng tôi sẽ liên hệ lại với bạn sớm nhất!',
      data: contactRequest
    });
  } catch (error) {
    console.error('Error creating contact request:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gửi yêu cầu',
      error: error.message
    });
  }
};

// Get all contact requests (Admin)
exports.getAllContactRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const filter = { isActive: true };
    if (status) filter.status = status;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const requests = await CandidateContactRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('candidateId', 'name email major jlpt');
    
    const total = await CandidateContactRequest.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: requests,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error getting contact requests:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách yêu cầu',
      error: error.message
    });
  }
};

// Update contact request status
exports.updateContactRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const request = await CandidateContactRequest.findById(id);
    if (!request || !request.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu'
      });
    }
    
    if (status) request.status = status;
    if (notes) request.notes = notes;
    
    await request.save();
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      data: request
    });
  } catch (error) {
    console.error('Error updating contact request:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật yêu cầu',
      error: error.message
    });
  }
};

// Delete contact request (soft delete)
exports.deleteContactRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const request = await CandidateContactRequest.findById(id);
    if (!request || !request.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu'
      });
    }
    
    request.isActive = false;
    await request.save();
    
    res.status(200).json({
      success: true,
      message: 'Xóa yêu cầu thành công'
    });
  } catch (error) {
    console.error('Error deleting contact request:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa yêu cầu',
      error: error.message
    });
  }
};

