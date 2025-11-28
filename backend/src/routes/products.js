const express = require('express');
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { validate, productValidation } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products (with filtering and pagination)
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', getProductById);

// Admin only routes
router.use(protect, admin);

// @route   POST /api/products
// @desc    Create new product
// @access  Private/Admin
router.post('/', validate(productValidation), createProduct);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private/Admin
router.put('/:id', updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product (soft delete)
// @access  Private/Admin
router.delete('/:id', deleteProduct);

module.exports = router;
