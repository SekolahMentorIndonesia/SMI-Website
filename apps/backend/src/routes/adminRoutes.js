const express = require('express');
const router = express.Router();
const { auth, adminOnly, superadminOnly } = require('../middlewares/authMiddleware');
const {
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
} = require('../controllers/adminController');

// Apply auth to all routes
router.use(auth);

// Routes for both admin and superadmin
router.get('/stats', adminOnly, getStats);
router.get('/enrollments', adminOnly, getEnrollments);
router.get('/enrollments/:id', adminOnly, getEnrollmentDetail);
router.get('/payments/:id', adminOnly, getPaymentDetails);
router.post('/enrollments/:id/approve', adminOnly, approveEnrollment);
router.post('/enrollments/:id/reject', adminOnly, rejectEnrollment);
router.get('/users', adminOnly, getUsers);
router.put('/users/:id/status', adminOnly, updateUserStatus);

// Superadmin only routes
router.put('/users/:id/role', superadminOnly, updateUserRole);
router.put('/users/:id/phone', superadminOnly, updateUserPhone);
router.get('/logs', superadminOnly, getAdminLogs);

// Dashboard stats route - Superadmin only
router.get('/dashboard-stats', superadminOnly, getDashboardStats);

module.exports = router;
