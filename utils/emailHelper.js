const EmailConfig = require('../models/EmailConfig');
const nodemailer = require('nodemailer');

// Get email configuration from database (with fallback to env)
async function getEmailConfig() {
  try {
    let config = await EmailConfig.findOne({ isActive: true });
    
    // Fallback to environment variables if no database config
    if (!config) {
      return {
        smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
        smtpPort: parseInt(process.env.SMTP_PORT) || 465,
        smtpUser: process.env.SMTP_USER,
        smtpPass: process.env.SMTP_PASS,
        cskhEmail: process.env.CSKH_EMAIL,
        hrEmail: process.env.HR_EMAIL,
        companyName: 'Next Step Vietnam'
      };
    }
    
    return config;
  } catch (error) {
    console.error('Error getting email config:', error);
    // Fallback to env variables on error
    return {
      smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
      smtpPort: parseInt(process.env.SMTP_PORT) || 465,
      smtpUser: process.env.SMTP_USER,
      smtpPass: process.env.SMTP_PASS,
      cskhEmail: process.env.CSKH_EMAIL,
      hrEmail: process.env.HR_EMAIL,
      companyName: 'Saigon 3 Jean'
    };
  }
}

// Create email transporter using dynamic config
async function createTransporter() {
  const config = await getEmailConfig();
  
  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: true,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass
    }
  });
}

// Send email to HR for job applications
async function sendHRNotificationEmail(application, job) {
  try {
    const config = await getEmailConfig();
    
    if (!config.hrEmail) {
      console.warn('HR email not configured');
      return;
    }

    const transporter = await createTransporter();
    // Dùng domain production giống như Saigon3Jean để logo hiển thị được
    const frontendUrl = config.frontendUrl || process.env.FRONTEND_URL || 'https://nextstepviet.com';

    // Template email thông báo HR
    const hrHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:8px;overflow:hidden;">
        <div style="background:#fff;padding:24px 0 12px 0;text-align:center;">
          <img src='${frontendUrl}/images/LogoNexxtStepVN.png' alt='Next Step Vietnam' style='height:60px;display:block;margin:auto;max-width:200px;' />
        </div>
        <div style="background:linear-gradient(135deg, #dc2626 0%, #991b1b 100%);padding:18px 0;text-align:center;">
          <h2 style='color:#fff;margin:0;font-size:1.35rem;'>🎯 Đơn ứng tuyển mới đã được tiếp nhận</h2>
        </div>
        <div style="padding:24px;">
          ${job ? `
          <h3 style="color:#dc2626;margin-bottom:16px;">📋 Thông tin vị trí tuyển dụng</h3>
          <p><b>Vị trí:</b> ${job.title}</p>
          <p><b>Địa điểm:</b> ${job.location}</p>
          <p><b>Phòng ban:</b> ${job.department || 'Chưa xác định'}</p>
          ` : `
          <h3 style="color:#dc2626;margin-bottom:16px;">📋 Thông tin CV chung</h3>
          <p><b>Loại:</b> CV Chung / General CV</p>
          <p><b>Ghi chú:</b> Ứng viên nộp CV không gắn với vị trí cụ thể</p>
          `}
          
          <h3 style="color:#dc2626;margin:24px 0 16px 0;">👤 Thông tin ứng viên</h3>
          <p><b>Họ tên:</b> ${application.personalInfo.fullName}</p>
          <p><b>Email:</b> ${application.personalInfo.email}</p>
          <p><b>Số điện thoại:</b> ${application.personalInfo.phone}</p>
          <p><b>Địa chỉ:</b> ${application.personalInfo.address || 'Chưa cung cấp'}</p>
          
          <h3 style="color:#dc2626;margin:24px 0 16px 0;">📄 Thông tin CV</h3>
          <p><b>Tên file:</b> ${application.cvFile.originalName}</p>
          <p><b>Kích thước:</b> ${(application.cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
          <p><b>Định dạng:</b> ${application.cvFile.mimetype}</p>
          <p><b>Thời gian nộp:</b> ${new Date(application.createdAt).toLocaleString('vi-VN')}</p>
          
          <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:16px;border-radius:6px;margin:24px 0;">
            <p style="margin:0;"><b>📎 File CV:</b> Vui lòng kiểm tra admin dashboard để tải xuống file CV.</p>
            <p style="margin:8px 0 0 0;"><b>🖥️ Dashboard:</b> <a href="${frontendUrl}/admin/recruitment" style="color:#dc2626;text-decoration:none;">Xem đơn ứng tuyển</a></p>
          </div>
          
          <p style="margin:24px 0 0 0;">Vui lòng xem xét đơn ứng tuyển và liên hệ với ứng viên sớm nhất có thể.</p>
        </div>
      </div>
    `;

    // Gửi email thông báo HR
    await transporter.sendMail({
      from: `${config.companyName || 'Next Step Vietnam'} Recruitment <${config.smtpUser}>`,
      to: config.hrEmail,
      subject: job ? `🎯 Đơn ứng tuyển mới: ${job.title} - ${application.personalInfo.fullName}` : `📄 CV mới từ: ${application.personalInfo.fullName}`,
      html: hrHtml,
      // Đính kèm CV file
      attachments: [
        {
          filename: application.cvFile.originalName,
          path: application.cvFile.path,
          contentType: application.cvFile.mimetype
        }
      ]
    });

    console.log('✅ HR notification email sent successfully to:', config.hrEmail);
  } catch (error) {
    console.error('❌ Error sending HR notification email:', error);
    // Không throw error để không ảnh hưởng đến flow chính
  }
}

// Send confirmation email to job applicant
async function sendCandidateConfirmationEmail(application, job) {
  try {
    const config = await getEmailConfig();
    const transporter = await createTransporter();
    // Dùng domain production giống như Saigon3Jean để logo hiển thị được
    const frontendUrl = config.frontendUrl || process.env.FRONTEND_URL || 'https://saigon3jean.com';

    // Template email xác nhận cho ứng viên - chuyên nghiệp và đẹp
    const candidateHtml = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                
                <!-- Header với Logo -->
                <tr>
                  <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 40px 30px 40px; text-align: center;">
                    <img src="${frontendUrl}/images/LogoNexxtStepVN.png" alt="Next Step Vietnam" style="height: 80px; display: block; margin: 0 auto; max-width: 200px;" />
                    <div style="margin-top: 20px;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Cảm ơn bạn đã ứng tuyển!</h1>
                      <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 16px; font-weight: 400;">Thank you for your application!</p>
                    </div>
                  </td>
                </tr>

                <!-- Nội dung chính -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Xin chào <strong style="color: #dc2626;">${application.personalInfo.fullName}</strong>,
                    </p>
                    
                    <p style="color: #555555; font-size: 15px; line-height: 1.7; margin: 0 0 20px 0;">
                      ${job ? `Chúng tôi đã nhận được đơn ứng tuyển của bạn cho vị trí <strong style="color: #dc2626;">${job.title}</strong> tại <strong>${job.location}</strong>.` : 'Chúng tôi đã nhận được CV của bạn.'}
                      Chúng tôi rất cảm kích sự quan tâm của bạn đến cơ hội nghề nghiệp tại Next Step Vietnam.
                    </p>

                    <p style="color: #555555; font-size: 15px; line-height: 1.7; margin: 0 0 30px 0;">
                      Đội ngũ nhân sự của chúng tôi sẽ xem xét hồ sơ của bạn một cách cẩn thận và sẽ liên hệ lại trong thời gian sớm nhất nếu hồ sơ của bạn phù hợp với vị trí này.
                    </p>

                    <!-- Thông tin ứng tuyển -->
                    <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; border-radius: 8px; margin: 30px 0;">
                      <h3 style="color: #dc2626; font-size: 18px; font-weight: 600; margin: 0 0 15px 0;">📋 Thông tin ứng tuyển của bạn</h3>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="padding: 8px 0; color: #666666; font-size: 14px; width: 140px;">Vị trí ứng tuyển:</td>
                          <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600;">${job ? job.title : 'CV Chung / General CV'}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #666666; font-size: 14px;">Địa điểm:</td>
                          <td style="padding: 8px 0; color: #333333; font-size: 14px;">${job ? job.location : 'N/A'}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #666666; font-size: 14px;">Họ tên:</td>
                          <td style="padding: 8px 0; color: #333333; font-size: 14px;">${application.personalInfo.fullName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #666666; font-size: 14px;">Email:</td>
                          <td style="padding: 8px 0; color: #333333; font-size: 14px;">${application.personalInfo.email}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #666666; font-size: 14px;">Số điện thoại:</td>
                          <td style="padding: 8px 0; color: #333333; font-size: 14px;">${application.personalInfo.phone}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #666666; font-size: 14px;">Ngày nộp:</td>
                          <td style="padding: 8px 0; color: #333333; font-size: 14px;">${new Date(application.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                        </tr>
                      </table>
                    </div>

                    <p style="color: #555555; font-size: 15px; line-height: 1.7; margin: 30px 0 20px 0;">
                      Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại đã cung cấp.
                    </p>

                    <p style="color: #555555; font-size: 15px; line-height: 1.7; margin: 20px 0 0 0;">
                      Trân trọng,<br>
                      <strong style="color: #dc2626;">Đội ngũ Nhân sự<br>Next Step Vietnam</strong>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #fef2f2; padding: 30px 40px; text-align: center; border-top: 1px solid #fecaca;">
                    <p style="color: #888888; font-size: 13px; line-height: 1.6; margin: 0 0 10px 0;">
                      <strong style="color: #dc2626;">Next Step Vietnam</strong><br>
                      Đồng hành cùng bạn trên con đường sự nghiệp
                    </p>
                    <p style="color: #aaaaaa; font-size: 12px; line-height: 1.5; margin: 15px 0 0 0;">
                      Email này được gửi tự động. Vui lòng không trả lời trực tiếp email này.<br>
                      Nếu bạn có thắc mắc, vui lòng liên hệ trực tiếp với bộ phận nhân sự.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Gửi email xác nhận cho ứng viên
    await transporter.sendMail({
      from: `${config.companyName || 'Next Step Vietnam'} <${config.smtpUser}>`,
      to: application.personalInfo.email,
      subject: job ? `✅ Đơn ứng tuyển của bạn đã được tiếp nhận - ${job.title} | Next Step Vietnam` : `✅ CV của bạn đã được tiếp nhận | Next Step Vietnam`,
      html: candidateHtml
    });

    console.log('✅ Candidate confirmation email sent successfully to:', application.personalInfo.email);
  } catch (error) {
    console.error('❌ Error sending candidate confirmation email:', error);
    // Không throw error để không ảnh hưởng đến flow chính
  }
}

// Send email to CSKH for contact submissions
async function sendContactEmails(submission) {
  try {
    const config = await getEmailConfig();
    const transporter = await createTransporter();
    // Dùng domain production giống như Saigon3Jean để logo hiển thị được
    const frontendUrl = config.frontendUrl || process.env.FRONTEND_URL || 'https://saigon3jean.com';
    
    // Template email cảm ơn khách hàng
    const customerHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:8px;overflow:hidden;">
        <div style="background:#fff;padding:24px 0 12px 0;text-align:center;">
          <img src='${frontendUrl}/images/LogoNexxtStepVN.png' alt='Next Step Vietnam' style='height:60px;display:block;margin:auto;max-width:200px;' />
        </div>
        <div style="background:linear-gradient(135deg, #dc2626 0%, #991b1b 100%);padding:18px 0;text-align:center;">
          <h2 style='color:#fff;margin:0;font-size:1.35rem;'>Cảm ơn bạn đã liên hệ với ${config.companyName || 'Next Step Vietnam'}!</h2>
        </div>
        <div style="padding:24px;">
          <p>Xin chào <b>${submission.name}</b>,</p>
          <p>Cảm ơn bạn đã quan tâm đến ${config.companyName || 'Next Step Vietnam'}. Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất.</p>
          <p style="margin:24px 0 0 0;">Trân trọng,<br/><b>${config.companyName || 'Next Step Vietnam'} Customer Care Team</b></p>
          <hr style="margin:24px 0;"/>
          <div style="font-size:13px;color:#888;">Đây là email tự động. Vui lòng không trả lời trực tiếp email này.</div>
        </div>
      </div>
    `;
    
    // Template email thông báo CSKH
    const cskhHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:8px;overflow:hidden;">
        <div style="background:#fff;padding:24px 0 12px 0;text-align:center;">
          <img src='${frontendUrl}/images/LogoNexxtStepVN.png' alt='Next Step Vietnam' style='height:60px;display:block;margin:auto;max-width:200px;' />
        </div>
        <div style="background:linear-gradient(135deg, #dc2626 0%, #991b1b 100%);padding:18px 0;text-align:center;">
          <h2 style='color:#fff;margin:0;font-size:1.35rem;'>📬 Đơn liên hệ mới từ website</h2>
        </div>
        <div style="padding:24px;">
          <p><b>Họ tên:</b> ${submission.name}</p>
          <p><b>Email:</b> ${submission.email}</p>
          <p><b>Số điện thoại:</b> ${submission.phone}</p>
          <p><b>Công ty:</b> ${submission.company}</p>
          <p><b>Chủ đề:</b> ${submission.subject}</p>
          <p><b>Nội dung:</b><br/>${submission.message}</p>
          <p style="margin:24px 0 0 0;">Vui lòng liên hệ với khách hàng sớm nhất có thể.</p>
        </div>
      </div>
    `;
    
    // Gửi email cảm ơn khách hàng
    await transporter.sendMail({
      from: `${config.companyName || 'Next Step Vietnam'} <${config.smtpUser}>`,
      to: submission.email,
      subject: `✅ Cảm ơn bạn đã liên hệ với ${config.companyName || 'Next Step Vietnam'}`,
      html: customerHtml
    });
    
    // Gửi email thông báo CSKH
    if (config.cskhEmail) {
      await transporter.sendMail({
        from: `Website Contact <${config.smtpUser}>`,
        to: config.cskhEmail,
        subject: '📬 Đơn liên hệ mới từ website',
        html: cskhHtml
      });
    }
    
    console.log('✅ Contact emails sent successfully');
  } catch (error) {
    console.error('❌ Error sending contact emails:', error);
  }
}

module.exports = {
  getEmailConfig,
  createTransporter,
  sendHRNotificationEmail,
  sendCandidateConfirmationEmail,
  sendContactEmails
};
