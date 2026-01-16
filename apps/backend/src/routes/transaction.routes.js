const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth } = require('../middlewares/authMiddleware');
const { createEnrollment } = require('../controllers/enrollmentController');
const { uploadPaymentProof } = require('../controllers/paymentController');
const { getMyEnrollments } = require('../controllers/enrollmentController');

// Multer config for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `proof-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Routes for /api/transaction
router.post('/', auth, createEnrollment);
router.post('/upload', auth, upload.single('proof_image'), uploadPaymentProof);
router.get('/my', auth, getMyEnrollments);

module.exports = router;
