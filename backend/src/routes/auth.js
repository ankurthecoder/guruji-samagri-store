const express = require('express');
const { verifyOTP, adminLogin } = require('../controllers/authController');

const router = express.Router();

// @route   POST /api/auth/verify-otp
// @desc    Verify Firebase OTP token and authenticate user
// @access  Public
router.post('/verify-otp', verifyOTP);

// @route   POST /api/auth/admin-login
// @desc    Admin login with email and password
// @access  Public
router.post('/admin-login', adminLogin);

module.exports = router;
