const { User } = require('../models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');

// Mendaftarkan user baru ke sistem
const register = async (req, res) => {
  try {
    const { name, email, password, phone_number } = req.body;

    console.log('🔍 [DEBUG] Register called with:', { name, email, phone_number: phone_number ? '***' : 'MISSING' });

    // WAJIB: Validasi nomor HP
    if (!phone_number || phone_number.trim() === '') {
      console.log('❌ [DEBUG] Phone number missing in register');
      return res.status(400).json({ 
        message: 'Nomor HP wajib diisi.' 
      });
    }

    // Validate phone number format
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone_number.replace(/[^0-9]/g, ''))) {
      console.log('❌ [DEBUG] Invalid phone format:', phone_number);
      return res.status(400).json({ 
        message: 'Format nomor HP tidak valid (10-15 digit angka)' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone_number }]
      }
    });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email sudah terdaftar' });
      }
      if (existingUser.phone_number === phone_number) {
        return res.status(400).json({ message: 'Nomor HP sudah terdaftar' });
      }
    }

    // Auto-verify for local development
    const isLocalDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    const isLocalAccount = email.includes('@smi.multipriority.com') || email.includes('localhost') || email.includes('test');

    const user = await User.create({ 
      name, 
      email, 
      password, 
      phone_number,
      email_verified: isLocalDev && isLocalAccount,
      phone_verified: isLocalDev && isLocalAccount,
      account_status: isLocalDev && isLocalAccount ? 'ACTIVE' : 'PENDING_VERIFICATION'
    });
    
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: isLocalDev && isLocalAccount 
        ? 'User registered successfully. Account is now active!' 
        : 'User registered successfully. Please verify your email and phone number.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        status: user.status,
        account_status: user.account_status,
        email_verified: user.email_verified,
        phone_verified: user.phone_verified
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Melakukan login user dan generate token JWT
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Email atau password salah' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(400).json({ message: 'Email atau password salah' });
    }

    if (user.account_status !== 'ACTIVE') {
      if (user.account_status === 'PENDING_VERIFICATION') {
        return res.status(403).json({ 
          message: 'Akun Anda belum diverifikasi. Silakan verifikasi email dan nomor HP terlebih dahulu.',
          requires_verification: true,
          user: {
            id: user.id,
            email: user.email,
            phone_number: user.phone_number,
            email_verified: user.email_verified,
            phone_verified: user.phone_verified
          }
        });
      }
      return res.status(403).json({ message: 'Akun Anda tidak aktif. Hubungi admin.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        status: user.status,
        account_status: user.account_status,
        email_verified: user.email_verified,
        phone_verified: user.phone_verified
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify phone number with OTP
const verifyPhone = async (req, res) => {
  try {
    const { phone_number, otp } = req.body;
    
    // Dummy OTP verification - accept "123456" as valid OTP
    if (otp !== '123456') {
      return res.status(400).json({ message: 'OTP tidak valid' });
    }

    const user = await User.findOne({ where: { phone_number } });
    if (!user) {
      return res.status(404).json({ message: 'Nomor HP tidak ditemukan' });
    }

    await user.update({ phone_verified: true });

    // Check if both email and phone are verified
    if (user.email_verified && user.phone_verified) {
      await user.update({ account_status: 'ACTIVE' });
    }

    res.json({
      message: 'Nomor HP berhasil diverifikasi',
      user: {
        id: user.id,
        phone_verified: user.phone_verified,
        email_verified: user.email_verified,
        account_status: user.account_status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send OTP for phone verification
const sendPhoneOTP = async (req, res) => {
  try {
    const { phone_number } = req.body;
    
    const user = await User.findOne({ where: { phone_number } });
    if (!user) {
      return res.status(404).json({ message: 'Nomor HP tidak ditemukan' });
    }

    // Dummy OTP - always return "123456"
    res.json({
      message: 'OTP berhasil dikirim',
      otp: '123456' // In production, this should be sent via SMS
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify email with token
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Dummy token verification - accept any token for now
    const user = await User.findOne({ where: { email_verified: false } });
    if (!user) {
      return res.status(404).json({ message: 'Token tidak valid atau sudah digunakan' });
    }

    await user.update({ email_verified: true });

    // Check if both email and phone are verified
    if (user.phone_verified) {
      await user.update({ account_status: 'ACTIVE' });
    }

    res.json({
      message: 'Email berhasil diverifikasi',
      user: {
        id: user.id,
        email_verified: user.email_verified,
        phone_verified: user.phone_verified,
        account_status: user.account_status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resend email verification
const resendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Email tidak ditemukan' });
    }

    if (user.email_verified) {
      return res.status(400).json({ message: 'Email sudah diverifikasi' });
    }

    // Dummy token generation
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    res.json({
      message: 'Link verifikasi email berhasil dikirim',
      token: verificationToken // In production, this should be sent via email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  register, 
  login, 
  verifyPhone, 
  sendPhoneOTP, 
  verifyEmail, 
  resendEmailVerification 
};
