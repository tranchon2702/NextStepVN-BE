const EmailConfig = require('../models/EmailConfig');
const nodemailer = require('nodemailer');

class EmailConfigController {
  
  // Get current email configuration
  async getEmailConfig(req, res) {
    try {
      let config = await EmailConfig.findOne({ isActive: true });
      
      // Create default config if none exists
      if (!config) {
        config = new EmailConfig({
          smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
          smtpPort: parseInt(process.env.SMTP_PORT) || 465,
          smtpUser: process.env.SMTP_USER || '',
          smtpPass: process.env.SMTP_PASS || '',
          cskhEmail: process.env.CSKH_EMAIL || '',
          hrEmail: process.env.HR_EMAIL || '',
          companyName: 'Saigon 3 Jean',
          isActive: true
        });
        await config.save();
      }
      
      // Hide sensitive password in response
      const safeConfig = config.toObject();
      safeConfig.smtpPass = safeConfig.smtpPass ? '***masked***' : '';
      
      res.json({
        success: true,
        data: safeConfig
      });
    } catch (error) {
      console.error('Get email config error:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving email configuration',
        error: error.message
      });
    }
  }
  
  // Update email configuration
  async updateEmailConfig(req, res) {
    try {
      const {
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPass,
        cskhEmail,
        hrEmail,
        companyName,
        notes
      } = req.body;
      
      // Validation
      if (!smtpUser || !cskhEmail || !hrEmail) {
        return res.status(400).json({
          success: false,
          message: 'SMTP User, CSKH Email, and HR Email are required'
        });
      }
      
      let config = await EmailConfig.findOne({ isActive: true });
      
      if (!config) {
        config = new EmailConfig();
      }
      
      // Update fields
      config.smtpHost = smtpHost || config.smtpHost;
      config.smtpPort = parseInt(smtpPort) || config.smtpPort;
      config.smtpUser = smtpUser;
      
      // Only update password if provided
      if (smtpPass && smtpPass !== '***masked***') {
        config.smtpPass = smtpPass;
      }
      
      config.cskhEmail = cskhEmail;
      config.hrEmail = hrEmail;
      config.companyName = companyName || config.companyName;
      config.notes = notes || config.notes;
      config.updatedBy = 'admin'; // Could be from auth token
      config.isActive = true;
      
      await config.save();
      
      // Hide password in response
      const safeConfig = config.toObject();
      safeConfig.smtpPass = '***masked***';
      
      res.json({
        success: true,
        message: 'Email configuration updated successfully',
        data: safeConfig
      });
    } catch (error) {
      console.error('Update email config error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating email configuration',
        error: error.message
      });
    }
  }
  
  // Test email configuration
  async testEmailConfig(req, res) {
    try {
      const { testEmail } = req.body;
      
      if (!testEmail) {
        return res.status(400).json({
          success: false,
          message: 'Test email address is required'
        });
      }
      
      const config = await EmailConfig.findOne({ isActive: true });
      
      if (!config) {
        return res.status(404).json({
          success: false,
          message: 'No email configuration found'
        });
      }
      
      // Create transporter
      const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: true,
        auth: {
          user: config.smtpUser,
          pass: config.smtpPass
        }
      });
      
      // Test email template
      const testHtml = `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:8px;overflow:hidden;">
          <div style="background:#fff;padding:24px 0 12px 0;text-align:center;">
            <img src='https://saigon3jean.com/images/sg3jeans_logo.png' alt='Saigon3Jean' style='height:60px;display:block;margin:auto;' />
          </div>
          <div style="background:#1e4f7a;padding:18px 0;text-align:center;">
            <h2 style='color:#fff;margin:0;font-size:1.35rem;'>✅ Email Configuration Test</h2>
          </div>
          <div style="padding:24px;">
            <p>This is a test email to verify your email configuration is working correctly.</p>
            <p><b>SMTP Host:</b> ${config.smtpHost}</p>
            <p><b>SMTP Port:</b> ${config.smtpPort}</p>
            <p><b>From Email:</b> ${config.smtpUser}</p>
            <p><b>Company:</b> ${config.companyName}</p>
            <p><b>Test Time:</b> ${new Date().toLocaleString('vi-VN')}</p>
            <p style="margin:24px 0 0 0;">If you received this email, your configuration is working properly!</p>
          </div>
        </div>
      `;
      
      // Send test email
      await transporter.sendMail({
        from: `${config.companyName} <${config.smtpUser}>`,
        to: testEmail,
        subject: '✅ Email Configuration Test - Saigon3Jean',
        html: testHtml
      });
      
      res.json({
        success: true,
        message: `Test email sent successfully to ${testEmail}`
      });
    } catch (error) {
      console.error('Test email error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: error.message
      });
    }
  }
}

module.exports = new EmailConfigController();
