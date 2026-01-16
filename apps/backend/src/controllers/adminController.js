const { Enrollment, Payment, User, MentorPackage } = require('../models');

// Mengambil semua data pendaftaran user (bisa difilter by status)
const getEnrollments = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    
    const enrollments = await Enrollment.findAll({
      where,
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: MentorPackage },
        { model: Payment }
      ]
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mengambil detail pembayaran berdasarkan ID
const getPaymentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id, {
      include: [{
        model: Enrollment,
        include: [
          { model: User, attributes: ['id', 'name', 'email'] },
          { model: MentorPackage }
        ]
      }]
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Menyetujui pendaftaran dan memverifikasi pembayaran user
const approveEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await Enrollment.findByPk(id, {
      include: [Payment]
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    enrollment.status = 'APPROVED';
    await enrollment.save();

    // Also update User status to menunggu masuk komunitas as per requirement
    const user = await User.findByPk(enrollment.user_id);
    if (user) {
      user.status = 'menunggu_masuk_komunitas';
      await user.save();
    }

    if (enrollment.Payment) {
      enrollment.Payment.status = 'VERIFIED';
      await enrollment.Payment.save();
    }

    res.json({ message: 'Enrollment approved successfully', enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Menolak pendaftaran user
const rejectEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await Enrollment.findByPk(id, {
      include: [Payment]
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    enrollment.status = 'REJECTED';
    await enrollment.save();

    // Also update User status to rejected
    const user = await User.findByPk(enrollment.user_id);
    if (user) {
      user.status = 'rejected';
      await user.save();
    }

    if (enrollment.Payment) {
      enrollment.Payment.status = 'REJECTED';
      await enrollment.Payment.save();
    }

    res.json({ message: 'Enrollment rejected successfully', enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEnrollmentDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await Enrollment.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: MentorPackage },
        { model: Payment }
      ]
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mengambil semua user (khusus admin dan superadmin)
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'status', 'phone_number', 'telegram_user', 'created_at']
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Memperbarui role user (khusus superadmin)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    // Validasi role
    const validRoles = ['user', 'admin', 'superadmin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `Invalid role. Valid roles: ${validRoles.join(', ')}` });
    }
    
    // Jangan izinkan admin untuk mempromosikan dirinya sendiri ke superadmin
    if (req.user.id == id && role === 'superadmin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'You cannot promote yourself to superadmin' });
    }
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const oldRole = user.role;
    user.role = role;
    await user.save();
    
    // Log perubahan role
    console.log(`Role updated for user ${user.email}: ${oldRole} → ${role} by ${req.user.email}`);
    
    res.json({
      message: 'User role updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Memperbarui status user (admin dan superadmin)
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.status = status;
    await user.save();
    
    res.json({
      message: 'User status updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Memperbarui phone_number user (khusus superadmin)
const updateUserPhone = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone_number } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.phone_number = phone_number;
    await user.save();
    
    res.json({
      message: 'User phone number updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mengambil statistik dashboard termasuk total admin, total pemasukan, dan enrollment stats
const getDashboardStats = async (req, res) => {
  try {
    // Total admins (admin + superadmin)
    const adminsCount = await User.count({
      where: {
        role: ['admin', 'superadmin']
      }
    });

    // Total pemasukan dari payments yang diverifikasi
    const revenueResult = await Payment.sum('amount', {
      where: {
        status: 'VERIFIED'
      }
    });
    const totalRevenue = revenueResult || 0;

    // Stats enrollment seperti sebelumnya
    const [totalEnrollments, pendingEnrollments, approvedEnrollments, rejectedEnrollments] = await Promise.all([
      Enrollment.count(),
      Enrollment.count({ where: { status: 'WAITING_APPROVAL' } }),
      Enrollment.count({ where: { status: 'APPROVED' } }),
      Enrollment.count({ where: { status: 'REJECTED' } })
    ]);

    res.json({
      total: totalEnrollments,
      pending: pendingEnrollments,
      approved: approvedEnrollments,
      rejected: rejectedEnrollments,
      adminsCount,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEnrollments,
  getEnrollmentDetail,
  getPaymentDetails,
  approveEnrollment,
  rejectEnrollment,
  getUsers,
  updateUserRole,
  updateUserStatus,
  updateUserPhone,
  getDashboardStats
};
