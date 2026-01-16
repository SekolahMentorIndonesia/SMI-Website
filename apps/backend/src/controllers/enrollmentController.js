const { Enrollment, MentorPackage, Payment, User } = require('../models');
const telegramService = require('../services/telegram.service');

const createEnrollment = async (req, res) => {
  try {
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
        if (phone_number && phone_number.trim()) updateData.phone_number = phone_number;
        
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
    const enrollment = await Enrollment.create({
      user_id,
      package_id,
      status: 'WAITING_APPROVAL',
      motivation: motivation || ''
    });

    // Parse amount to remove currency symbols and handle Indonesian thousand separators
    const parseAmount = (amountStr) => {
      if (!amountStr) return pkg.price;
      // Remove currency symbols, then replace thousand separators (dots) with empty string
      // Fix: Use proper string replacement for "Rp" prefix
      const cleanAmount = amountStr
        .replace(/Rp/g, '')       // Remove currency symbol
        .replace(/\s/g, '')       // Remove spaces
        .replace(/\./g, '')       // Remove thousand separators (dots)
        .replace(/,/g, '.');      // Replace decimal commas with dots (if any)
      return parseFloat(cleanAmount);
    };

    // Create payment record with only existing columns
    const payment = await Payment.create({
      enrollment_id: enrollment.id,
      amount: parseAmount(payment_amount) || pkg.price,
      proof_image,
      status: 'PENDING'
    });

    // Prepare Telegram notification
    const caption = `🔔 NEW PAYMENT PENDING 🔔\n\n` +
      `📋 ID Pembelian: #${payment.id}\n` +
      `👤 User: ${user.name} (${user.email})\n` +
      `📱 Telegram: ${user.telegram_user || 'Belum ditambahkan'}\n` +
      `📞 Telepon: ${user.phone_number || 'Belum ditambahkan'}\n` +
      `📦 Paket: ${pkg.name}\n` +
      `💰 Harga Paket: ${pkg.price}\n` +
      `💵 Jumlah Bayar: ${payment.amount}\n` +
      `💳 Metode Bayar: ${payment_method === 'rekening' ? 'Transfer Bank' : 'QRIS'}\n\n` +
      `💬 Deskripsi: ${proof_description || '-'}\n` +
      `📝 Motivasi: ${motivation || '-'}\n\n` +
      `Status: PENDING - Menunggu Verifikasi\n\n` +
      `Untuk verifikasi:\n` +
      `/terima ${payment.id} atau /tolak ${payment.id} [ALASAN]`;

    // Send notification to Telegram admin with photo
    try {
      if (payment.proof_image) {
        await telegramService.sendPhoto(payment.proof_image, caption);
      } else {
        await telegramService.sendMessage(caption);
      }
    } catch (telegramError) {
      console.error('Telegram notification error:', telegramError.message);
      // Continue with enrollment process even if Telegram fails
      // This ensures reliability for users
    }

    res.status(201).json({
      message: 'Enrollment created successfully. Waiting for admin approval.',
      enrollment,
      payment
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: error.message });
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
