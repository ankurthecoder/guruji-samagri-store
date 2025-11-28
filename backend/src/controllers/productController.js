const Product = require('../models/Product');

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
        const productData = req.body;

        const product = await Product.create(productData);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product,
        });
    } catch (error) {
        console.error('Create Product Error:', error);
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
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product,
        });
    } catch (error) {
        console.error('Update Product Error:', error);
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
