const { User, Enrollment, MentorPackage } = require('../models');
const { AppError } = require('../utils/errorHandler');
const { sendVerificationEmail } = require('../services/emailService');

// Mendapatkan data profile user yang sedang login beserta enrollment terakhir
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        'id', 
        'name', 
        'email', 
        'email_verified',
        'phone_number', 
        'phone_verified',
        'telegram_user',
        'role', 
        'status'
      ],
      include: [
        {
          model: Enrollment,
          include: [MentorPackage],
          limit: 1,
          order: [['created_at', 'DESC']]
        }
      ]
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const userData = user.toJSON();
    const latestEnrollment = userData.Enrollments?.[0];
    
    res.json({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phone_number: userData.phone_number,
      telegram_user: userData.telegram_user,
      role: userData.role,
      status: userData.status,
      package: latestEnrollment ? latestEnrollment.MentorPackage.name : null,
      package_type: latestEnrollment ? latestEnrollment.MentorPackage.type : null,
      enrollment_status: latestEnrollment ? latestEnrollment.status : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send verification email
const sendVerification = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.email_verified) {
      return res.json({ message: 'Email sudah terverifikasi' });
    }

    // Generate verification token (in a real app, this would be a secure random token)
    const verificationToken = require('crypto').randomBytes(32).toString('hex');
    
    // In a real app, save this token to the database with an expiry
    // await user.update({ email_verification_token: verificationToken });
    
    // Send verification email
    await sendVerificationEmail(user.email, verificationToken);
    
    res.json({ message: 'Email verifikasi telah dikirim' });
  } catch (error) {
    next(error);
  }
};

// Verify email using token
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    // In a real app, verify the token against the database
    // For now, we'll just mark as verified
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.email_verified) {
      return res.json({ message: 'Email sudah terverifikasi' });
    }

    // In a real app, verify the token here
    // if (user.email_verification_token !== token) {
    //   throw new AppError('Token verifikasi tidak valid', 400);
    // }

    await user.update({ 
      email_verified: true,
      // email_verification_token: null // Clear the token after verification
    });

    res.json({ message: 'Email berhasil diverifikasi' });
  } catch (error) {
    next(error);
  }
};

// Update user profile with verification checks
const updateProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const updateData = { ...req.body };

    // Hanya admin yang bisa update role dan status
    if (req.user.role !== 'admin') {
      delete updateData.role;
      delete updateData.status;
    }

    // Hapus field yang tidak boleh diupdate
    delete updateData.id;
    delete updateData.password;
    
    // Handle email update (requires re-verification)
    if (updateData.email) {
      const existingUser = await User.findOne({ 
        where: { email: updateData.email },
        attributes: ['id']
      });
      
      if (existingUser && existingUser.id !== id) {
        throw new AppError('Email sudah digunakan', 400);
      }
      
      // Mark email as unverified when changed
      updateData.email_verified = false;
    }

    // ❌ PHONE_NUMBER TIDAK BOLEH DIUBAH - READONLY PERMANENT
    if (updateData.phone_number) {
      console.log('❌ [DEBUG] Attempted phone number update blocked');
      throw new AppError('Nomor HP tidak dapat diubah', 400, 'PHONE_UPDATE_NOT_ALLOWED');
    }

    const [updated] = await User.update(updateData, {
      where: { id },
      returning: true,
      individualHooks: true
    });

    if (!updated) {
      throw new AppError('User not found', 404);
    }

    const updatedUser = await User.findByPk(id, {
      attributes: [
        'id', 
        'name', 
        'email', 
        'email_verified',
        'phone_number', 
        'phone_verified',
        'telegram_user',
        'role', 
        'status'
      ]
    });

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Upload profile photo
const uploadProfilePhoto = async (req, res) => {
  try {
    const { id } = req.user;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Update user's photo_url in the database
    const photoUrl = `/uploads/${req.file.filename}`;
    await User.update(
      { photo_url: photoUrl },
      { where: { id } }
    );

    res.json({
      success: true,
      message: 'Profile photo uploaded successfully',
      photoUrl
    });
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    res.status(500).json({ message: 'Error uploading profile photo', error: error.message });
  }
};

module.exports = { 
  getMe, 
  updateProfile, 
  uploadProfilePhoto,
  sendVerification,
  verifyEmail
};
