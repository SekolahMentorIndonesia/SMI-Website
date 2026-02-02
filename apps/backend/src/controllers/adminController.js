const { Enrollment, Payment, User, MentorPackage, AdminLog } = require('../models');

// Get dashboard statistics
const getStats = async (req, res) => {
  try {
    // Get enrollment statistics
    const totalEnrollments = await Enrollment.count();
    const pendingEnrollments = await Enrollment.count({ where: { status: 'pending' } });
    const approvedEnrollments = await Enrollment.count({ where: { status: 'approved' } });
    const rejectedEnrollments = await Enrollment.count({ where: { status: 'rejected' } });
    
    // Get admin count
    const adminCount = await User.count({ 
      where: { 
        role: ['admin', 'superadmin'] 
      } 
    });
    
    // Get total revenue from approved payments
    const totalRevenue = await Payment.sum('amount', {
      include: [{
        model: Enrollment,
        where: { status: 'approved' }
      }]
    }) || 0;

    res.json({
      total: totalEnrollments,
      pending: pendingEnrollments,
      approved: approvedEnrollments,
      rejected: rejectedEnrollments,
      adminsCount: adminCount,
      totalRevenue
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: error.message });
  }
};

// Mengambil semua data pendaftaran user (bisa difilter by status)
const getEnrollments = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    
    const enrollments = await Enrollment.findAll({
      where,
      include: [
        { model: User, attributes: ['id', 'name', 'email', 'phone_number'] },
        { model: MentorPackage },
        { model: Payment }
      ],
      order: [['created_at', 'DESC']]
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
    const adminUser = req.user;

    const enrollment = await Enrollment.findByPk(id, {
      include: [
        { model: User },
        { model: MentorPackage },
        { model: Payment }
      ]
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if already processed
    if (enrollment.status !== 'pending') {
      return res.status(400).json({ 
        message: `Request ${enrollment.request_id} sudah ${enrollment.status === 'approved' ? 'DISETUJUI' : 'DITOLAK'} oleh ${enrollment.approved_by || 'Admin'}` 
      });
    }

    const user = enrollment.User;
    const pkg = enrollment.MentorPackage;

    // Update enrollment status
    await enrollment.update({
      status: 'approved',
      approved_by: adminUser.email,
      approved_at: new Date(),
      action_source: 'dashboard'
    });

    // Update payment status if exists
    if (enrollment.Payment) {
      await enrollment.Payment.update({ status: 'VERIFIED' });
      console.log(`[DEBUG] Dashboard: Payment ${enrollment.Payment.id} status updated to VERIFIED`);
    }

    // Update user status based on product type
    if (pkg.product_type === 'komunitas') {
      await user.update({ status: 'menunggu_masuk_komunitas' });
    } else if (pkg.product_type === 'mentoring') {
      await user.update({ status: 'mentoring_approved' });
    }

    // Log admin action
    await AdminLog.create({
      admin_id: adminUser.id,
      admin_email: adminUser.email,
      action: 'approve',
      request_id: enrollment.request_id,
      action_source: 'dashboard'
    });

    // Send telegram notification
    const telegramService = require('../services/telegram.service');
    if (pkg.product_type === 'komunitas') {
      await telegramService.sendCommunityPaymentApproved(enrollment.Payment, user, pkg);
    } else {
      await telegramService.sendMentoringPaymentApproved(enrollment.Payment, user, pkg);
    }

    // Send sync notification
    await telegramService.sendMessage(`✅ Request ${enrollment.request_id} telah DISETUJUI oleh SUPERADMIN\nAdmin: ${adminUser.email}`);

    res.json({ message: 'Enrollment approved successfully', enrollment });
  } catch (error) {
    console.error('Error approving enrollment:', error);
    res.status(500).json({ message: error.message });
  }
};

// Menolak pendaftaran user
const rejectEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body || {};
    const adminUser = req.user;

    const enrollment = await Enrollment.findByPk(id, {
      include: [
        { model: User },
        { model: MentorPackage },
        { model: Payment }
      ]
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if already processed
    if (enrollment.status !== 'pending') {
      return res.status(400).json({ 
        message: `Request ${enrollment.request_id} sudah ${enrollment.status === 'approved' ? 'DISETUJUI' : 'DITOLAK'} oleh ${enrollment.approved_by || 'Admin'}` 
      });
    }

    const user = enrollment.User;
    const pkg = enrollment.MentorPackage;

    // Update enrollment status
    await enrollment.update({
      status: 'rejected',
      approved_by: adminUser.email,
      approved_at: new Date(),
      rejected_reason: reason,
      action_source: 'dashboard'
    });

    // Update payment status if exists
    if (enrollment.Payment) {
      await enrollment.Payment.update({ status: 'REJECTED' });
      console.log(`[DEBUG] Dashboard: Payment ${enrollment.Payment.id} status updated to REJECTED`);
    }

    // Update user status to rejected
    await user.update({ status: 'rejected' });

    // Log admin action
    await AdminLog.create({
      admin_id: adminUser.id,
      admin_email: adminUser.email,
      action: 'reject',
      request_id: enrollment.request_id,
      action_source: 'dashboard',
      rejected_reason: reason
    });

    // Send telegram notification
    const telegramService = require('../services/telegram.service');
    if (pkg.product_type === 'komunitas') {
      await telegramService.sendCommunityPaymentRejected(enrollment.Payment, user, pkg, reason);
    } else {
      await telegramService.sendMentoringPaymentRejected(enrollment.Payment, user, pkg, reason);
    }

    // Send sync notification
    await telegramService.sendMessage(`❌ Request ${enrollment.request_id} telah DITOLAK oleh SUPERADMIN\nAdmin: ${adminUser.email}\nAlasan: ${reason}`);

    res.json({ message: 'Enrollment rejected successfully', enrollment });
  } catch (error) {
    console.error('Error rejecting enrollment:', error);
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
    const adminUser = req.user;
    
    // Validasi status
    const validStatuses = ['ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}` });
    }
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const oldStatus = user.account_status;
    await user.update({ account_status: status });
    
    // Log admin action
    await AdminLog.create({
      admin_id: adminUser.id,
      admin_email: adminUser.email,
      action: status === 'ACTIVE' ? 'approve' : 'reject',
      request_id: `USER-${user.id}`,
      action_source: 'dashboard',
      rejected_reason: status === 'SUSPENDED' ? 'Rejected by admin' : null
    });
    
    // Send telegram notification
    const telegramService = require('../services/telegram.service');
    const actionText = status === 'ACTIVE' ? 'DISETUJUI' : 'DITOLAK';
    await telegramService.sendMessage(
      `✅ User ${user.name} (${user.email}) telah ${actionText} oleh SUPERADMIN\nAdmin: ${adminUser.email}\nStatus: ${status}`
    );
    
    res.json({
      message: 'User status updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        account_status: user.account_status
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
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
      Enrollment.count({ where: { status: 'pending' } }),
      Enrollment.count({ where: { status: 'approved' } }),
      Enrollment.count({ where: { status: 'rejected' } })
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
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get admin activity logs (superadmin only)
const getAdminLogs = async (req, res) => {
  try {
    const logs = await AdminLog.findAll({
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'role']
      }],
      order: [['created_at', 'DESC']],
      limit: 100
    });
    res.json(logs);
  } catch (error) {
    console.error('Error fetching admin logs:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats,
  getEnrollments,
  getEnrollmentDetail,
  getPaymentDetails,
  approveEnrollment,
  rejectEnrollment,
  getUsers,
  updateUserRole,
  updateUserStatus,
  updateUserPhone,
  getDashboardStats,
  getAdminLogs
};
