const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { admin } = require('../config/firebase');
const { generateToken } = require('../utils/generateToken');
const { validatePhoneNumber } = require('../utils/validators');

/**
 * @desc    Verify OTP and authenticate user
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
const verifyOTP = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({
                success: false,
                message: 'Firebase ID token is required',
            });
        }

        // Verify the Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const phoneNumber = decodedToken.phone_number;

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Phone number not found in token',
            });
        }

        // Remove country code if present (+91 for India)
        const cleanPhone = phoneNumber.replace('+91', '');

        // Check if user exists
        let user = await User.findOne({ phoneNumber: cleanPhone });
        let needsProfileSetup = false;

        if (!user) {
            // Create new user
            user = await User.create({
                phoneNumber: cleanPhone,
                isProfileComplete: false,
            });
            needsProfileSetup = true;
        } else {
            // Check if existing user needs to complete profile
            needsProfileSetup = !user.isProfileComplete;
        }

        // Generate JWT token
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            message: 'Authentication successful',
            token,
            user: {
                id: user._id,
                phoneNumber: user.phoneNumber,
                name: user.name,
                role: user.role,
                isProfileComplete: user.isProfileComplete,
            },
            needsProfileSetup,
        });
    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify OTP',
            error: error.message,
        });
    }
};

/**
 * @desc    Admin login with email and password
 * @route   POST /api/auth/admin-login
 * @access  Public
 */
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }

        // Find admin user
        const admin = await User.findOne({ email, role: 'admin' }).select('+password');

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Generate JWT token
        const token = generateToken(admin._id, admin.role);

        res.status(200).json({
            success: true,
            message: 'Admin login successful',
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error('Admin Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message,
        });
    }
};

module.exports = {
    verifyOTP,
    adminLogin,
};
