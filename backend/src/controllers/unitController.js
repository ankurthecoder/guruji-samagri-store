const Unit = require('../models/Unit');

// @desc    Get all units
// @route   GET /api/units
// @access  Public
exports.getUnits = async (req, res) => {
    try {
        console.log('getUnits called');
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
        console.log('createUnit called with:', req.body);
        const { name, convention } = req.body;

        if (!name) {
            console.log('createUnit failed: name required');
            return res.status(400).json({
                success: false,
                message: 'Unit name is required',
            });
        }

        const unit = await Unit.create({ name, convention });
        console.log('createUnit success:', unit);

        res.status(201).json({
            success: true,
            unit,
        });
    } catch (error) {
        console.error('createUnit error:', error);

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

// @desc    Update unit
// @route   PUT /api/units/:id
// @access  Private/Admin
exports.updateUnit = async (req, res) => {
    try {
        const { name, convention } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Unit name is required',
            });
        }

        const unit = await Unit.findById(req.params.id);

        if (!unit) {
            return res.status(404).json({
                success: false,
                message: 'Unit not found',
            });
        }

        unit.name = name;
        unit.convention = convention;
        await unit.save();

        res.status(200).json({
            success: true,
            unit,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Unit name already exists',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Delete unit
// @route   DELETE /api/units/:id
// @access  Private/Admin
exports.deleteUnit = async (req, res) => {
    try {
        const unit = await Unit.findById(req.params.id);

        if (!unit) {
            return res.status(404).json({
                success: false,
                message: 'Unit not found',
            });
        }

        await unit.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Unit deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};
