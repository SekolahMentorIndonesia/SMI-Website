const { User } = require('../models');
const { AppError } = require('../utils/errorHandler');

/**
 * Middleware to check if user has verified both email and phone
 * Blocks access if either email or phone is not verified
 */
const requireVerifiedContact = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (!user.email_verified) {
      throw new AppError('Email belum terverifikasi', 403, 'EMAIL_NOT_VERIFIED');
    }

    if (!user.phone_verified) {
      throw new AppError('Nomor HP belum terverifikasi', 403, 'PHONE_NOT_VERIFIED');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if phone number can be updated
 * Prevents updating phone number if already verified
 */
const preventPhoneUpdateIfVerified = async (req, res, next) => {
  try {
    if (req.body.phone_number) {
      const user = await User.findByPk(req.user.id);
      
      if (user.phone_verified) {
        throw new AppError('Nomor HP tidak dapat diubah setelah diverifikasi', 400, 'PHONE_UPDATE_NOT_ALLOWED');
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requireVerifiedContact,
  preventPhoneUpdateIfVerified
};
