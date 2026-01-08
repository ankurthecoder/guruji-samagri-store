const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// @route   POST /api/upload
// @desc    Upload an image
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Please upload a file'
        });
    }

    // Construct the full URL
    const protocol = req.protocol;
    const host = req.get('host');
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        url: imageUrl,
        filename: req.file.filename
    });
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple images
// @access  Private/Admin
router.post('/multiple', protect, admin, upload.array('images', 5), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Please upload files'
        });
    }

    const protocol = req.protocol;
    const host = req.get('host');

    const urls = req.files.map(file => `${protocol}://${host}/uploads/${file.filename}`);

    res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
        urls: urls,
        files: req.files.map(f => f.filename)
    });
});

module.exports = router;
