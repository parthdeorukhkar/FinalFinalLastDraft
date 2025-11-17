const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  // For development, use Ethereal (fake SMTP)
  // For production, use Gmail/SendGrid/etc

  if (process.env.NODE_ENV === 'production') {
    // Production: Use real email service
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else {
    // Development: Use Ethereal for testing
    // Note: You can also use Gmail with app-specific password
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'test@ethereal.email',
        pass: process.env.EMAIL_PASSWORD || 'testpassword'
      }
    });
  }
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"HR Automation System" <noreply@hrautomation.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('📧 Email sent:', {
      to: options.to,
      subject: options.subject,
      messageId: info.messageId
    });

    // For development with Ethereal
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return {
      success: true,
      messageId: info.messageId,
      preview: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Email Templates
const templates = {
  // Application Acknowledgment
  acknowledgment: (candidateName, jobTitle) => ({
    subject: `Application Received - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Application Received!</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${candidateName}</strong>,</p>

            <p>Thank you for applying for the <strong>${jobTitle}</strong> position at our company.</p>

            <p>We have successfully received your application and resume. Our hiring team will carefully review your qualifications and experience.</p>

            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Our team will review your application within 3-5 business days</li>
              <li>If your profile matches our requirements, we'll contact you to schedule an interview</li>
              <li>You can track your application status through our candidate portal</li>
            </ul>

            <p>We appreciate your interest in joining our team!</p>

            <div class="footer">
              <p>Best regards,<br><strong>HR Automation Team</strong></p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Dear ${candidateName},\n\nThank you for applying for the ${jobTitle} position. We have received your application and will review it within 3-5 business days.\n\nBest regards,\nHR Automation Team`
  }),

  // Interview Invitation
  interviewInvite: (candidateName, jobTitle, interviewDetails) => ({
    subject: `Interview Invitation - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10B981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; }
          .details-box { background: white; padding: 20px; border-left: 4px solid #10B981; margin: 20px 0; border-radius: 4px; }
          .button { display: inline-block; padding: 12px 24px; background: #10B981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 Interview Invitation</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${candidateName}</strong>,</p>

            <p>Congratulations! We were impressed with your application for the <strong>${jobTitle}</strong> position.</p>

            <p>We would like to invite you for an interview to discuss your qualifications further.</p>

            <div class="details-box">
              <h3>Interview Details</h3>
              <p><strong>📅 Date:</strong> ${interviewDetails.date}</p>
              <p><strong>🕐 Time:</strong> ${interviewDetails.time}</p>
              <p><strong>⏱️ Duration:</strong> ${interviewDetails.duration} minutes</p>
              <p><strong>📍 Type:</strong> ${interviewDetails.type}</p>
              ${interviewDetails.meetingLink ? `<p><strong>🔗 Meeting Link:</strong> <a href="${interviewDetails.meetingLink}">${interviewDetails.meetingLink}</a></p>` : ''}
              ${interviewDetails.location ? `<p><strong>📍 Location:</strong> ${interviewDetails.location}</p>` : ''}
              ${interviewDetails.interviewers ? `<p><strong>👥 Interviewer(s):</strong> ${interviewDetails.interviewers}</p>` : ''}
            </div>

            <p><strong>Please prepare for:</strong></p>
            <ul>
              <li>Discussion about your experience and skills</li>
              <li>Technical questions related to the role</li>
              <li>Questions about our company and culture</li>
              <li>Your questions for us</li>
            </ul>

            <p>Please confirm your availability by replying to this email.</p>

            <p>We look forward to meeting you!</p>

            <div class="footer">
              <p>Best regards,<br><strong>HR Automation Team</strong></p>
              <p>If you have any questions, please contact us at hr@company.com</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Dear ${candidateName},\n\nWe would like to invite you for an interview for the ${jobTitle} position.\n\nDate: ${interviewDetails.date}\nTime: ${interviewDetails.time}\nDuration: ${interviewDetails.duration} minutes\nType: ${interviewDetails.type}\n\nPlease confirm your availability.\n\nBest regards,\nHR Automation Team`
  }),

  // Rejection Email
  rejection: (candidateName, jobTitle) => ({
    subject: `Application Status Update - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #6366F1; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Status Update</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${candidateName}</strong>,</p>

            <p>Thank you for your interest in the <strong>${jobTitle}</strong> position and for taking the time to apply.</p>

            <p>After careful consideration of all applications, we have decided to move forward with other candidates whose qualifications more closely match our current needs.</p>

            <p>This decision was not easy, as we received many strong applications. We encourage you to apply for future openings that match your skills and experience.</p>

            <p>We wish you the very best in your job search and future professional endeavors.</p>

            <div class="footer">
              <p>Best regards,<br><strong>HR Automation Team</strong></p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Dear ${candidateName},\n\nThank you for applying for the ${jobTitle} position. After careful consideration, we have decided to move forward with other candidates. We encourage you to apply for future openings.\n\nBest regards,\nHR Automation Team`
  }),

  // Offer Letter (simplified)
  offer: (candidateName, jobTitle, offerDetails) => ({
    subject: `Job Offer - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; }
          .offer-box { background: white; padding: 20px; border-left: 4px solid #059669; margin: 20px 0; border-radius: 4px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${candidateName}</strong>,</p>

            <p>We are delighted to extend you an offer to join our team as a <strong>${jobTitle}</strong>!</p>

            <div class="offer-box">
              <h3>Offer Details</h3>
              ${offerDetails.startDate ? `<p><strong>Start Date:</strong> ${offerDetails.startDate}</p>` : ''}
              ${offerDetails.salary ? `<p><strong>Annual Salary:</strong> ${offerDetails.salary}</p>` : ''}
              ${offerDetails.benefits ? `<p><strong>Benefits:</strong> ${offerDetails.benefits}</p>` : ''}
            </div>

            <p>Our HR team will reach out to you with the formal offer letter and next steps.</p>

            <p>Welcome to the team! We're excited to have you join us.</p>

            <div class="footer">
              <p>Best regards,<br><strong>HR Automation Team</strong></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Dear ${candidateName},\n\nCongratulations! We are pleased to offer you the position of ${jobTitle}.\n\nOur HR team will contact you with the formal offer letter.\n\nBest regards,\nHR Automation Team`
  })
};

// Wrapper functions for easy use
const sendAcknowledgmentEmail = async (candidateEmail, candidateName, jobTitle) => {
  const template = templates.acknowledgment(candidateName, jobTitle);
  return sendEmail({
    to: candidateEmail,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
};

const sendInterviewInvite = async (candidateEmail, candidateName, jobTitle, interviewDetails) => {
  const template = templates.interviewInvite(candidateName, jobTitle, interviewDetails);
  return sendEmail({
    to: candidateEmail,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
};

const sendRejectionEmail = async (candidateEmail, candidateName, jobTitle) => {
  const template = templates.rejection(candidateName, jobTitle);
  return sendEmail({
    to: candidateEmail,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
};

const sendOfferEmail = async (candidateEmail, candidateName, jobTitle, offerDetails = {}) => {
  const template = templates.offer(candidateName, jobTitle, offerDetails);
  return sendEmail({
    to: candidateEmail,
    subject: template.subject,
    html: template.html,
    text: template.text
  });
};

module.exports = {
  sendEmail,
  sendAcknowledgmentEmail,
  sendInterviewInvite,
  sendRejectionEmail,
  sendOfferEmail,
  templates
};
