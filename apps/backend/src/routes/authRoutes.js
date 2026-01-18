const express = require('express');
const router = express.Router();
const { register, login, verifyPhone, sendPhoneOTP, verifyEmail, resendEmailVerification } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-phone', verifyPhone);
router.post('/send-phone-otp', sendPhoneOTP);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-email-verification', resendEmailVerification);

module.exports = router;
