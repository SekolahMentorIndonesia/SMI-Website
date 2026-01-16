const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth, userOnly } = require('../middlewares/authMiddleware');
const { getPackages } = require('../controllers/packageController');
const { createEnrollment, getMyEnrollments } = require('../controllers/enrollmentController');
const { uploadPaymentProof } = require('../controllers/paymentController');
const { getMe, updateProfile, uploadProfilePhoto } = require('../controllers/userController');

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `proof-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// Public routes
router.get('/packages', getPackages);

// Protected routes (User Only)
router.get('/me', auth, userOnly, getMe);
router.put('/me', auth, userOnly, updateProfile);
router.get('/me/enrollments', auth, userOnly, getMyEnrollments);
router.post('/enrollment', auth, userOnly, upload.single('proof_image'), createEnrollment);
router.post('/payment/upload', auth, userOnly, upload.single('proof_image'), uploadPaymentProof);
router.post('/upload-photo', auth, userOnly, upload.single('photo'), uploadProfilePhoto);

module.exports = router;
