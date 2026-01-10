const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

const deleteFile = (filename) => {
    if (!filename) return;
    const filepath = path.join(__dirname, '../../uploads', filename);
    if (fs.existsSync(filepath)) {
        fs.unlink(filepath, (err) => {
            if (err) console.error('Failed to delete file:', err);
        });
    }
};

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 20, sortBy = 'createdAt' } = req.query;

        // Build query
        const query = { isActive: true };

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
            ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute query
        const products = await Product.find(query)
            .sort({ [sortBy]: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            products,
        });
    } catch (error) {
        console.error('Get Products Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get products',
            error: error.message,
        });
    }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        console.error('Get Product Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get product',
            error: error.message,
        });
    }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
    try {
        const productData = { ...req.body };
        const protocol = req.protocol;
        const host = req.get('host');

        // Parse JSON fields
        if (typeof productData.variants === 'string') {
            try {
                productData.variants = JSON.parse(productData.variants);
            } catch (e) {
                console.error('Error parsing variants:', e);
                return res.status(400).json({ success: false, message: 'Invalid variants data' });
            }
        }

        // Handle Image Uploads
        let images = [];
        // 1. Existing images (should be empty for create, but handling for consistency)
        if (productData.images && typeof productData.images === 'string') {
            try {
                images = JSON.parse(productData.images);
            } catch (e) {
                images = [];
            }
        }

        // 2. New uploaded files
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((file, index) => ({
                url: `${protocol}://${host}/uploads/${file.filename}`,
                isMain: images.length === 0 && index === 0, // Set first as main if no existing
                sortOrder: images.length + index,
                isActive: true
            }));
            images = [...images, ...newImages];
        }

        productData.images = images;

        console.log('📦 Creating product with data:', JSON.stringify(productData, null, 2));

        const product = await Product.create(productData);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product,
        });
    } catch (error) {
        console.error('Create Product Error:', error);

        // Cleanup uploaded files
        if (req.files) {
            req.files.forEach(file => deleteFile(file.filename));
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            console.error('Validation Messages:', messages);
            return res.status(400).json({
                success: false,
                message: messages.join(', '),
                error: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create product',
            error: error.message,
        });
    }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        const productData = { ...req.body };
        const protocol = req.protocol;
        const host = req.get('host');

        // Parse JSON fields
        if (typeof productData.variants === 'string') {
            try {
                productData.variants = JSON.parse(productData.variants);
            } catch (e) {
                return res.status(400).json({ success: false, message: 'Invalid variants data' });
            }
        }

        // Handle Images
        let currentImages = []; // Images to keep
        if (productData.images && typeof productData.images === 'string') {
            try {
                currentImages = JSON.parse(productData.images);
            } catch (e) {
                currentImages = [];
            }
        }

        // Identify deleted images and remove files
        const keptImageUrls = new Set(currentImages.map(img => img.url));
        product.images.forEach(img => {
            if (!keptImageUrls.has(img.url)) {
                const filename = img.url.split('/uploads/')[1];
                deleteFile(filename);
            }
        });

        // Add new files
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((file, index) => ({
                url: `${protocol}://${host}/uploads/${file.filename}`,
                isMain: currentImages.length === 0 && index === 0,
                sortOrder: currentImages.length + index,
                isActive: true
            }));
            currentImages = [...currentImages, ...newImages];
        }

        productData.images = currentImages;

        product = await Product.findByIdAndUpdate(
            req.params.id,
            productData,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product,
        });
    } catch (error) {
        console.error('Update Product Error:', error);
        // Cleanup uploaded files
        if (req.files) {
            req.files.forEach(file => deleteFile(file.filename));
        }
        res.status(500).json({
            success: false,
            message: 'Failed to update product',
            error: error.message,
        });
    }
};

/**
 * @desc    Delete product (soft delete - set isActive to false)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Note: For soft delete, we usually keep images. 
        // If hard delete is implemented later, we should deleteFile() here.

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        console.error('Delete Product Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message,
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
