const { Enrollment, MentorPackage, Payment, User } = require('../models');
const telegramService = require('../services/telegram.service');
const { Op } = require('sequelize');

const createEnrollment = async (req, res) => {
  try {
    console.log('🔍 [DEBUG] createEnrollment called');
    console.log('🔍 [DEBUG] Request body:', req.body);
    console.log('🔍 [DEBUG] User:', req.user);
    
    const {
      package_id,
      name,
      email,
      telegram_user,
      phone_number,
      motivation,
      payment_method,
      proof_description,
      payment_amount
    } = req.body;
    
    const user_id = req.user.id;
    const proof_image = req.file ? req.file.path : null;

    // WAJIB: Validasi nomor HP
    if (!phone_number || phone_number.trim() === '') {
      console.log('❌ [DEBUG] Phone number validation failed');
      return res.status(400).json({ 
        message: 'Nomor HP wajib diisi. Lengkapi profil Anda terlebih dahulu.' 
      });
    }

    // WAJIB: Cek nomor HP user
    if (!req.user.phone_number || req.user.phone_number.trim() === '') {
      console.log('❌ [DEBUG] User has no phone number');
      return res.status(400).json({ 
        message: 'Akun Anda belum memiliki nomor HP. Silakan lengkapi profil terlebih dahulu.' 
      });
    }

    console.log('✅ [DEBUG] Phone number validated:', req.user.phone_number);

    // Check if user is verified and active
    if (!req.user.email_verified || !req.user.phone_verified) {
      return res.status(403).json({ 
        message: 'Akun Anda belum diverifikasi. Silakan verifikasi email dan nomor HP terlebih dahulu.' 
      });
    }

    if (req.user.account_status !== 'ACTIVE') {
      return res.status(403).json({ 
        message: 'Akun Anda tidak aktif. Hubungi admin.' 
      });
    }

    // Check if user has active enrollment
    const activeEnrollment = await Enrollment.findOne({
      where: {
        user_id,
        status: ['pending', 'approved']
      }
    });

    if (activeEnrollment) {
      return res.status(400).json({ 
        message: 'Anda masih memiliki proses yang sedang berjalan. Mohon tunggu hingga proses sebelumnya selesai.' 
      });
    }

    // Check for existing enrollments today to prevent duplicates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnrollment = await Enrollment.findOne({
      where: {
        user_id,
        created_at: {
          [Op.gte]: today
        }
      }
    });

    if (todayEnrollment) {
      return res.status(400).json({ 
        message: 'Anda sudah melakukan pendaftaran hari ini. Mohon tunggu hingga proses selesai.' 
      });
    }

    // Check if package exists
    const pkg = await MentorPackage.findByPk(package_id);
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Update user profile with the submitted data, but only if values are valid
    const user = await User.findByPk(user_id);
    if (user) {
      try {
        const updateData = {};
        
        // Only update fields if they have valid values
        if (name && name.trim()) updateData.name = name;
        // Only update email if it's valid - skip if invalid
        if (email && email.trim()) {
          // Basic email validation before passing to Sequelize
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(email)) {
            updateData.email = email;
          } else {
            console.warn(`Skipping invalid email update for user ${user_id}: ${email}`);
          }
        }
        if (telegram_user && telegram_user.trim()) updateData.telegram_user = telegram_user;
        // ❌ PHONE_NUMBER TIDAK BOLEH DIUBAH - READONLY
        
        // Only update if there's something to update
        if (Object.keys(updateData).length > 0) {
          await user.update(updateData);
        }
      } catch (error) {
        console.error(`Error updating user profile for user ${user_id}:`, error.message);
        // Continue with enrollment even if profile update fails
      }
    }

    // Create enrollment
    console.log('🔍 [DEBUG] Creating enrollment...');
    const enrollment = await Enrollment.create({
      user_id,
      package_id,
      status: 'pending',
      motivation: motivation || '',
      product_type: pkg.product_type,
      request_id: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    });
    console.log('✅ [DEBUG] Enrollment created:', enrollment.request_id);

    // Parse amount to remove currency symbols and handle Indonesian thousand separators
    const parseAmount = (amountStr) => {
      if (!amountStr) return pkg.price;
      // Remove currency symbols, then replace thousand separators (dots) with empty string
      const cleanAmount = amountStr
        .replace(/Rp/g, '')       // Remove currency symbol
        .replace(/\s/g, '')       // Remove spaces
        .replace(/\./g, '')       // Remove thousand separators (dots)
        .replace(/,/g, '.');      // Replace decimal commas with dots (if any)
      return parseFloat(cleanAmount);
    };

    // Create payment record with only existing columns
    console.log('🔍 [DEBUG] Creating payment...');
    const payment = await Payment.create({
      enrollment_id: enrollment.id,
      amount: parseAmount(payment_amount) || pkg.price,
      proof_image,
      status: 'PENDING'
    });
    console.log('✅ [DEBUG] Payment created:', payment.id);

    // ❌ DECOUPLED: Jangan kirim Telegram langsung dari request
    // Telegram akan dikirim oleh worker terpisah
    console.log('📤 [DEBUG] Telegram will be sent by worker (decoupled)');

    // Trigger internal API untuk worker (STRATEGI 2 - LOOPBACK)
    try {
      const axios = require('axios');
      await axios.post(`${process.env.BASE_URL || 'http://localhost:5000'}/api/internal/send-telegram`, {}, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('✅ [DEBUG] Internal Telegram trigger sent');
    } catch (triggerError) {
      console.error('⚠️ [DEBUG] Internal trigger failed, worker will handle in next cycle:', triggerError.message);
      // Continue - worker akan handle di next cycle
    }

    console.log('🎉 [DEBUG] Enrollment process completed successfully');
    res.status(201).json({
      message: 'Enrollment created successfully. Waiting for admin approval.',
      enrollment,
      payment
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      errors: error.errors
    });
    
    // Send more detailed error response
    const statusCode = error.name === 'SequelizeValidationError' ? 400 : 500;
    const message = error.name === 'SequelizeValidationError' 
      ? 'Data tidak lengkap atau tidak valid. Silakan periksa kembali.'
      : error.message;
    
    res.status(statusCode).json({ 
      message,
      details: error.errors || null
    });
  }
};

// Mengambil history pendaftaran milik user yang sedang login
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { user_id: req.user.id },
      include: [
        { model: MentorPackage },
        { model: Payment }
      ]
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createEnrollment, getMyEnrollments };
