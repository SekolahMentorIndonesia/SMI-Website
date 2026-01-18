const nodemailer = require('nodemailer');
const { AppError } = require('../utils/errorHandler');

// Create a test account for development
const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  };
};

// Configure transporter based on environment
const getTransporter = async () => {
  // In production, use real SMTP settings from environment variables
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new AppError('SMTP configuration is missing', 500);
    }
    
    return {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };
  }
  
  // In development, use ethereal.email for testing
  return createTestAccount();
};

// Send verification email
const sendVerificationEmail = async (email, token) => {
  try {
    const transporterConfig = await getTransporter();
    const transporter = nodemailer.createTransport(transporterConfig);
    
    // Create verification URL (in a real app, this would be your frontend URL)
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Sekolah Mentor Indonesia'}" <${process.env.EMAIL_FROM || 'noreply@sekolahmentor.id'}>`,
      to: email,
      subject: 'Verifikasi Email Anda',
      html: `
        <h2>Verifikasi Email Anda</h2>
        <p>Terima kasih telah mendaftar di Sekolah Mentor Indonesia. Silakan verifikasi alamat email Anda dengan mengeklik tombol di bawah ini:</p>
        <p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            Verifikasi Email
          </a>
        </p>
        <p>Atau salin dan tempel tautan berikut ke browser Anda:</p>
        <p>${verificationUrl}</p>
        <p>Jika Anda tidak merasa mendaftar di Sekolah Mentor Indonesia, abaikan email ini.</p>
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    // In development, log the preview URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new AppError('Gagal mengirim email verifikasi', 500);
  }
};

module.exports = {
  sendVerificationEmail,
};
