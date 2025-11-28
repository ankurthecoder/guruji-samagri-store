const express = require('express');
const { getProfile, completeProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { validate, profileValidation } = require('../middleware/validation');

const router = express.Router();

// All user routes are protected
router.use(protect);

// @route   GET /api/user/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', getProfile);

// @route   POST /api/user/profile
// @desc    Complete user profile (first time)
// @access  Private
router.post('/profile', validate(profileValidation), completeProfile);

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', updateProfile);

module.exports = router;
