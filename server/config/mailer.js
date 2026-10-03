// =========================================================
// Nodemailer setup — sends email notifications using a
// Gmail account + App Password (stored in .env)
// =========================================================
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendQuoteNotification = async (quote) => {
  try {
    await transporter.sendMail({
      from: `"Quinex Website" <${process.env.EMAIL_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      subject: `New Quote Request: ${quote.service}`,
      html: `
        <h2>New Contact / Quote Request</h2>
        <p><strong>Name:</strong> ${quote.fullName}</p>
        <p><strong>Email:</strong> ${quote.email}</p>
        <p><strong>Phone:</strong> ${quote.phone || '—'}</p>
        <p><strong>Company:</strong> ${quote.companyName || '—'}</p>
        <p><strong>Service:</strong> ${quote.service}</p>
        <p><strong>Budget:</strong> ${quote.budget || '—'}</p>
        <p><strong>Preferred Contact:</strong> ${quote.preferredContact || '—'}</p>
        <p><strong>Project Details:</strong><br>${quote.projectDetails}</p>
      `,
    });
    console.log('📧 Notification email sent');
  } catch (error) {
    console.error('Email notification failed:', error.message);
  }
};

module.exports = sendQuoteNotification;