const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');

// Helper to delete file
const deleteFile = (filename) => {
    if (!filename) return;
    const filepath = path.join(__dirname, '../../uploads', filename);
    if (fs.existsSync(filepath)) {
        fs.unlink(filepath, (err) => {
            if (err) console.error('Failed to delete file:', err);
        });
    }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json({
            success: true,
            count: categories.length,
            categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
    try {
        const categoryData = req.body;

        // Handle image upload
        if (req.file) {
            const protocol = req.protocol;
            const host = req.get('host');
            categoryData.image = `${protocol}://${host}/uploads/${req.file.filename}`;
        }

        const category = await Category.create(categoryData);
        res.status(201).json({
            success: true,
            category,
        });
    } catch (error) {
        // Cleanup uploaded file if creation fails
        if (req.file) {
            deleteFile(req.file.filename);
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        const categoryData = req.body;

        // Handle image upload
        if (req.file) {
            // Delete old image
            if (category.image) {
                const oldFilename = category.image.split('/uploads/')[1];
                deleteFile(oldFilename);
            }

            const protocol = req.protocol;
            const host = req.get('host');
            categoryData.image = `${protocol}://${host}/uploads/${req.file.filename}`;
        }

        category = await Category.findByIdAndUpdate(req.params.id, categoryData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            category,
        });
    } catch (error) {
        // Cleanup uploaded file if update fails
        if (req.file) {
            deleteFile(req.file.filename);
        }
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Delete image
        if (category.image) {
            const filename = category.image.split('/uploads/')[1];
            deleteFile(filename);
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Category removed',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};
