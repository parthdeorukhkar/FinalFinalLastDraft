# Email Setup Guide for HR Automation System

## Overview
The HR Automation System uses **Nodemailer** to send automated emails to candidates when interviews are scheduled. This guide will help you set up email functionality for both **development** and **production** environments.

---

## Quick Start (Development Testing with Ethereal)

### Step 1: Create Ethereal Test Account
Ethereal is a fake SMTP service perfect for testing emails without sending real ones.

1. Visit **https://ethereal.email/**
2. Click **"Create Ethereal Account"**
3. You'll get a test email account with credentials like:
   ```
   Username: your.test.account@ethereal.email
   Password: YourRandomPassword123
   ```

### Step 2: Update Backend Configuration

Edit `backend/.env` and update the email configuration:

```env
# Email Configuration (SMTP / Gmail)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your.test.account@ethereal.email
EMAIL_PASSWORD=YourRandomPassword123
EMAIL_FROM="HR Automation System" <noreply@hrautomation.com>
```

### Step 3: Restart Backend Server

Kill the backend server (Ctrl+C) and restart it:

```bash
cd backend
npm start
```

### Step 4: Test Email Sending

1. Open the application: http://localhost:3000
2. Navigate to **Interviews** page
3. Click **"Schedule Interview"**
4. Fill in the form and submit
5. Check the backend console logs for:
   ```
   ✅ Interview invitation sent to candidate@email.com
   📧 Email sent: { to: 'candidate@email.com', subject: '...', messageId: '...' }
   Preview URL: https://ethereal.email/message/...
   ```

### Step 5: View Sent Email

1. Copy the **Preview URL** from the console
2. Open it in your browser
3. You'll see the rendered email with all interview details

---

## Production Setup Options

### Option 1: Gmail (Recommended for Small-Medium Scale)

#### Setup Gmail App Password

1. Enable 2-Factor Authentication on your Gmail account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate an App Password for "Mail"
4. Update `backend/.env`:

```env
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_16_digit_app_password
EMAIL_FROM="HR Automation System" <your.email@gmail.com>
NODE_ENV=production
```

#### Gmail Sending Limits
- **500 emails/day** for regular Gmail accounts
- **2000 emails/day** for Google Workspace accounts

---

### Option 2: SendGrid (Recommended for High Volume)

1. Sign up at: https://sendgrid.com/
2. Create an API key
3. Update `backend/.env`:

```env
EMAIL_SERVICE=SendGrid
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
EMAIL_FROM="HR Automation System" <verified@yourdomain.com>
NODE_ENV=production
```

**SendGrid Free Tier**: 100 emails/day forever

---

### Option 3: AWS SES (Best for Enterprise)

1. Set up AWS SES: https://aws.amazon.com/ses/
2. Verify your domain and email addresses
3. Get SMTP credentials
4. Update `backend/.env`:

```env
EMAIL_SERVICE=SES
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your_ses_smtp_username
EMAIL_PASSWORD=your_ses_smtp_password
EMAIL_FROM="HR Automation System" <verified@yourdomain.com>
NODE_ENV=production
```

**AWS SES Pricing**: $0.10 per 1,000 emails

---

## Email Templates

The system includes 4 professional email templates:

### 1. Interview Invitation ✅ (Active)
- **Trigger**: When interview is scheduled via API
- **Recipient**: Candidate
- **Contains**: Date, time, type, meeting link, interviewers
- **Color**: Green theme

### 2. Application Acknowledgment (Ready)
- **Trigger**: When candidate applies for a job
- **Recipient**: Candidate
- **Contains**: Job title, next steps
- **Color**: Blue theme

### 3. Rejection Email (Ready)
- **Trigger**: When candidate status set to "Rejected"
- **Recipient**: Candidate
- **Contains**: Professional rejection message
- **Color**: Purple theme

### 4. Offer Letter (Ready)
- **Trigger**: When offer is extended
- **Recipient**: Candidate
- **Contains**: Offer details, salary, start date
- **Color**: Green theme

---

## Testing Checklist

- [ ] Email credentials configured in `.env`
- [ ] Backend server restarted after config changes
- [ ] Interview scheduled successfully
- [ ] Email sent confirmation in console logs
- [ ] Email preview URL works (Ethereal)
- [ ] Email contains correct interview details
- [ ] Meeting link is clickable
- [ ] Email formatting looks professional
- [ ] Candidate receives email (production only)

---

## Troubleshooting

### Email Not Sending

**Problem**: No email logs in console after scheduling interview

**Solutions**:
1. Check `.env` file has correct EMAIL_* variables
2. Restart backend server after changing `.env`
3. Check backend console for error messages
4. Verify email credentials are correct

### "Invalid Login" Error

**Problem**: Authentication failed with SMTP server

**Solutions**:
1. For Gmail: Use App Password, not regular password
2. For Ethereal: Create new account with fresh credentials
3. Check username/password have no extra spaces
4. Verify EMAIL_HOST matches your provider

### Preview URL Not Working (Ethereal)

**Problem**: Console shows no preview URL

**Solutions**:
1. Set `NODE_ENV=development` in `.env`
2. The preview URL only works with Ethereal
3. Check if email actually sent (look for success log)

### Email in Spam Folder

**Problem**: Production emails going to spam

**Solutions**:
1. Configure SPF/DKIM records for your domain
2. Use verified sender email address
3. Warm up new email accounts gradually
4. Use professional email service (SendGrid/SES)

---

## Environment Variables Reference

```env
# Required Email Configuration
EMAIL_SERVICE=gmail              # SMTP service (gmail, SendGrid, SES, etc.)
EMAIL_HOST=smtp.gmail.com        # SMTP host
EMAIL_PORT=587                   # SMTP port (usually 587 or 465)
EMAIL_USER=your@email.com        # SMTP username/email
EMAIL_PASSWORD=your_password     # SMTP password/app password
EMAIL_FROM="Name" <email@domain> # From address (with display name)

# Optional
NODE_ENV=development             # 'development' or 'production'
```

---

## Best Practices

### Development
- ✅ Use Ethereal for testing (free, no setup)
- ✅ Check preview URLs to verify email content
- ✅ Test all email templates before production
- ❌ Don't use production SMTP in development

### Production
- ✅ Use dedicated email service (Gmail/SendGrid/SES)
- ✅ Verify sender domain for better deliverability
- ✅ Monitor bounce/complaint rates
- ✅ Implement rate limiting if high volume
- ✅ Keep email content professional and spam-free
- ❌ Don't use personal Gmail for high-volume sending

---

## Next Steps

1. **Test with Ethereal** (5 minutes)
   - Get instant email testing without any setup
   - Verify email templates look good

2. **Choose Production Service** (30 minutes)
   - Gmail: Quick setup, good for small scale
   - SendGrid: Professional, good free tier
   - AWS SES: Best pricing, enterprise scale

3. **Configure & Test** (15 minutes)
   - Add production credentials to `.env`
   - Test with real email address
   - Verify deliverability

4. **Go Live!** 🚀
   - Update `NODE_ENV=production`
   - Monitor email delivery
   - Celebrate successful automation!

---

## Support

For issues with email setup:
1. Check troubleshooting section above
2. Review backend console logs for error messages
3. Verify credentials with email provider
4. Test SMTP connection independently if needed

**Email Service Documentation**:
- Nodemailer: https://nodemailer.com/
- Gmail: https://support.google.com/mail/answer/185833
- SendGrid: https://docs.sendgrid.com/
- AWS SES: https://docs.aws.amazon.com/ses/

---

**Last Updated**: November 5, 2025
**Status**: Ready for Testing ✅
