# HR Email Notification Setup

## Overview
Hệ thống đã được cập nhật để tự động gửi email thông báo đến bộ phận HR khi có người nộp CV qua trang recruitment.

## Features Added
- ✅ Tự động gửi email thông báo HR khi có CV mới
- ✅ Email bao gồm đầy đủ thông tin ứng viên
- ✅ Đính kèm file CV trong email
- ✅ Template email professional với logo Saigon3Jean
- ✅ Link trực tiếp đến admin dashboard

## Environment Variables Required

Thêm vào file `.env` của backend:

```env
# Email Recipients
HR_EMAIL=hr@saigon3jean.com

# SMTP Configuration (nếu chưa có)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CSKH_EMAIL=customercare@saigon3jean.com
```

## Email Content
Email gửi đến HR sẽ bao gồm:

### Job Information
- Position title
- Location  
- Department

### Candidate Information
- Full Name
- Email
- Phone
- Address

### CV Information
- Original filename
- File size
- File type
- Submission time
- **CV file attached**

### Dashboard Link
- Direct link to admin recruitment page

## Technical Details

### Email Flow
1. User submits CV via recruitment form
2. Application saved to database
3. Response sent to user immediately
4. HR notification email sent in background
5. Email includes CV file as attachment

### Error Handling
- Email sending runs in background
- Errors logged but don't affect user experience
- Graceful fallback if HR_EMAIL not configured

### File Attachment
- CV files automatically attached to HR emails
- Supports PDF, DOC, DOCX formats
- File size limit: 50MB

## Testing
1. Configure HR_EMAIL in .env
2. Submit a test application via recruitment form
3. Check HR email inbox for notification
4. Verify CV file attachment

## Deployment Notes
- Ensure HR_EMAIL is set in production environment
- Test email sending with production SMTP settings
- Monitor logs for any email sending errors
