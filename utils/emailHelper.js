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
        companyName: 'Saigon 3 Jean'
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

    // Template email thông báo HR
    const hrHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:8px;overflow:hidden;">
        <div style="background:#fff;padding:24px 0 12px 0;text-align:center;">
          <img src='https://saigon3jean.com/images/sg3jeans_logo.png' alt='Saigon3Jean' style='height:60px;display:block;margin:auto;' />
        </div>
        <div style="background:#1e4f7a;padding:18px 0;text-align:center;">
          <h2 style='color:#fff;margin:0;font-size:1.35rem;'>🎯 New Job Application Received</h2>
        </div>
        <div style="padding:24px;">
          <h3 style="color:#1e4f7a;margin-bottom:16px;">Job Position</h3>
          <p><b>Position:</b> ${job.title}</p>
          <p><b>Location:</b> ${job.location}</p>
          <p><b>Department:</b> ${job.department || 'N/A'}</p>
          
          <h3 style="color:#1e4f7a;margin:24px 0 16px 0;">Candidate Information</h3>
          <p><b>Full Name:</b> ${application.personalInfo.fullName}</p>
          <p><b>Email:</b> ${application.personalInfo.email}</p>
          <p><b>Phone:</b> ${application.personalInfo.phone}</p>
          <p><b>Address:</b> ${application.personalInfo.address || 'Not provided'}</p>
          
          <h3 style="color:#1e4f7a;margin:24px 0 16px 0;">CV Information</h3>
          <p><b>Original Filename:</b> ${application.cvFile.originalName}</p>
          <p><b>File Size:</b> ${(application.cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
          <p><b>File Type:</b> ${application.cvFile.mimetype}</p>
          <p><b>Submitted At:</b> ${new Date(application.createdAt).toLocaleString('vi-VN')}</p>
          
          <div style="background:#f8f9fa;padding:16px;border-radius:6px;margin:24px 0;">
            <p style="margin:0;"><b>📎 CV File:</b> Please check the admin dashboard to download the CV file.</p>
            <p style="margin:8px 0 0 0;"><b>🖥️ Dashboard:</b> <a href="https://saigon3jean.com/admin/recruitment">View Application</a></p>
          </div>
          
          <p style="margin:24px 0 0 0;">Please review the application and contact the candidate as soon as possible.</p>
        </div>
      </div>
    `;

    // Gửi email thông báo HR
    await transporter.sendMail({
      from: `${config.companyName} Recruitment <${config.smtpUser}>`,
      to: config.hrEmail,
      subject: `🎯 New Application for ${job.title} - ${application.personalInfo.fullName}`,
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

// Send email to CSKH for contact submissions
async function sendContactEmails(submission) {
  try {
    const config = await getEmailConfig();
    const transporter = await createTransporter();
    
    // Template email cảm ơn khách hàng
    const customerHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:8px;overflow:hidden;">
        <div style="background:#fff;padding:24px 0 12px 0;text-align:center;">
          <img src='https://saigon3jean.com/images/sg3jeans_logo.png' alt='Saigon3Jean' style='height:60px;display:block;margin:auto;' />
        </div>
        <div style="background:#1e4f7a;padding:18px 0;text-align:center;">
          <h2 style='color:#fff;margin:0;font-size:1.35rem;'>Thank you for contacting ${config.companyName}!</h2>
        </div>
        <div style="padding:24px;">
          <p>Dear <b>${submission.name}</b>,</p>
          <p>Thank you for your interest in ${config.companyName}. We have received your message and will get back to you as soon as possible.</p>
          <p style="margin:24px 0 0 0;">Best regards,<br/><b>${config.companyName} Customer Care Team</b></p>
          <hr style="margin:24px 0;"/>
          <div style="font-size:13px;color:#888;">This is an automated email. Please do not reply directly.</div>
        </div>
      </div>
    `;
    
    // Template email thông báo CSKH
    const cskhHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:8px;overflow:hidden;">
        <div style="background:#fff;padding:24px 0 12px 0;text-align:center;">
          <img src='https://saigon3jean.com/images/sg3jeans_logo.png' alt='Saigon3Jean' style='height:60px;display:block;margin:auto;' />
        </div>
        <div style="background:#1e4f7a;padding:18px 0;text-align:center;">
          <h2 style='color:#fff;margin:0;font-size:1.35rem;'>New Contact Submission</h2>
        </div>
        <div style="padding:24px;">
          <p><b>Name:</b> ${submission.name}</p>
          <p><b>Email:</b> ${submission.email}</p>
          <p><b>Phone:</b> ${submission.phone}</p>
          <p><b>Company:</b> ${submission.company}</p>
          <p><b>Subject:</b> ${submission.subject}</p>
          <p><b>Message:</b><br/>${submission.message}</p>
          <p style="margin:24px 0 0 0;">Please contact the customer as soon as possible.</p>
        </div>
      </div>
    `;
    
    // Gửi email cảm ơn khách hàng
    await transporter.sendMail({
      from: `${config.companyName} <${config.smtpUser}>`,
      to: submission.email,
      subject: `Thank you for contacting ${config.companyName}`,
      html: customerHtml
    });
    
    // Gửi email thông báo CSKH
    if (config.cskhEmail) {
      await transporter.sendMail({
        from: `Website Contact <${config.smtpUser}>`,
        to: config.cskhEmail,
        subject: 'New Contact Submission from Website',
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
  sendContactEmails
};
