const { User, Enrollment, MentorPackage } = require('../models');

// Mendapatkan data profile user yang sedang login beserta enrollment terakhir
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'status', 'phone_number', 'telegram_user'],
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
      return res.status(404).json({ message: 'User not found' });
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

// Memperbarui profil user dengan batasan permission
const updateProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const updateData = { ...req.body };
    
    // Hapus field yang tidak boleh diubah berdasarkan role
    if (req.user.role === 'user') {
      // USER tidak boleh mengubah role, phone_number, telegram_user
      delete updateData.role;
      delete updateData.phone_number;
      delete updateData.telegram_user;
      
      // Email edit memerlukan verifikasi (implementasi lebih lanjut)
      if (updateData.email) {
        // Di sini bisa ditambahkan logika untuk kirim email verifikasi
        console.log(`User ${id} requesting email change to: ${updateData.email}`);
      }
    } else if (req.user.role === 'admin') {
      // ADMIN tidak boleh mengubah role
      delete updateData.role;
    }
    
    // Update user data
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.update(updateData);
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        telegram_user: user.telegram_user,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

module.exports = { getMe, updateProfile, uploadProfilePhoto };
