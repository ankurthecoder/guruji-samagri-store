const User = require('../models/User');
const { validateDateOfBirth, validateGender } = require('../utils/validators');

/**
 * @desc    Get current user profile
 * @route   GET /api/user/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                phoneNumber: user.phoneNumber,
                name: user.name,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                role: user.role,
                isProfileComplete: user.isProfileComplete,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile',
            error: error.message,
        });
    }
};

/**
 * @desc    Complete user profile (first time setup)
 * @route   POST /api/user/profile
 * @access  Private
 */
const completeProfile = async (req, res) => {
    try {
        const { name, dateOfBirth, gender } = req.body;

        // Validate date of birth
        if (!validateDateOfBirth(dateOfBirth)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date of birth. User must be between 13 and 120 years old.',
            });
        }

        // Validate gender
        if (!validateGender(gender)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid gender. Must be Male, Female, or Other.',
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Update user profile
        user.name = name;
        user.dateOfBirth = dateOfBirth;
        user.gender = gender;
        user.isProfileComplete = true;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile completed successfully',
            user: {
                id: user._id,
                phoneNumber: user.phoneNumber,
                name: user.name,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                isProfileComplete: user.isProfileComplete,
            },
        });
    } catch (error) {
        console.error('Complete Profile Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete profile',
            error: error.message,
        });
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/user/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
    try {
        const { name, dateOfBirth, gender } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Update fields if provided
        if (name) user.name = name;

        if (dateOfBirth) {
            if (!validateDateOfBirth(dateOfBirth)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date of birth',
                });
            }
            user.dateOfBirth = dateOfBirth;
        }

        if (gender) {
            if (!validateGender(gender)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid gender',
                });
            }
            user.gender = gender;
        }

        // Check if profile is now complete
        user.isProfileComplete = user.checkProfileComplete();

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                phoneNumber: user.phoneNumber,
                name: user.name,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                isProfileComplete: user.isProfileComplete,
            },
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message,
        });
    }
};

module.exports = {
    getProfile,
    completeProfile,
    updateProfile,
};
