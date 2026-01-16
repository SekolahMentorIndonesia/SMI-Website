const { Payment, Enrollment, User, MentorPackage } = require('../models');
const telegramService = require('../services/telegram.service');

// Mengupload bukti pembayaran untuk pendaftaran tertentu
const uploadPaymentProof = async (req, res) => {
  try {
    const { enrollment_id, amount } = req.body;
    const proof_image = req.file ? req.file.path : null;

    if (!proof_image) {
      return res.status(400).json({ message: 'Payment proof image is required' });
    }

    // Check if enrollment exists and belongs to user
    const enrollment = await Enrollment.findOne({
      where: { id: enrollment_id, user_id: req.user.id }
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found or access denied' });
    }

    // Parse amount to remove currency symbols and handle Indonesian thousand separators
    const parseAmount = (amountStr) => {
      if (!amountStr) return 0;
      // Remove currency symbols, then replace thousand separators (dots) with empty string
      const cleanAmount = amountStr
        .replace(/[Rp\s]/g, '')  // Remove currency symbol and spaces
        .replace(/\./g, '')      // Remove thousand separators (dots)
        .replace(/,/g, '.');     // Replace decimal commas with dots (if any)
      return parseFloat(cleanAmount);
    };

    // Create payment record
    const payment = await Payment.create({
      enrollment_id,
      amount: parseAmount(amount),
      proof_image,
      status: 'PENDING'
    });

    // Update enrollment status
    enrollment.status = 'WAITING_APPROVAL';
    await enrollment.save();

    // Get user and package details for Telegram notification
    const user = await User.findByPk(enrollment.user_id);
    const pkg = await MentorPackage.findByPk(enrollment.package_id);

    // Send notification to Telegram admin based on product type
    try {
      if (pkg.product_type === 'komunitas') {
        await telegramService.sendCommunityPaymentNotification(payment, user, pkg);
      } else {
        await telegramService.sendMentoringPaymentNotification(payment, user, pkg);
      }
    } catch (telegramError) {
      console.error('Telegram notification error:', telegramError.message);
      // Continue with payment process even if Telegram fails
      // This ensures reliability for users
    }

    res.status(201).json({
      message: 'Payment proof uploaded successfully. Waiting for admin approval.',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadPaymentProof };
