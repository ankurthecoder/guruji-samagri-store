const Unit = require('../models/Unit');

// @desc    Get all units
// @route   GET /api/units
// @access  Public
exports.getUnits = async (req, res) => {
    try {
        const units = await Unit.find({ isActive: true }).sort({ name: 1 });
        res.status(200).json({
            success: true,
            count: units.length,
            units,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Create new unit
// @route   POST /api/units
// @access  Private/Admin
exports.createUnit = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Unit name is required',
            });
        }

        const unit = await Unit.create({ name });

        res.status(201).json({
            success: true,
            unit,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Unit already exists',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};
