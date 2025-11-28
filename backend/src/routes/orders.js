const express = require('express');
const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const router = express.Router();

// All order routes require authentication
router.use(protect);

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', createOrder);

// @route   GET /api/orders
// @desc    Get orders (user's own or all for admin)
// @access  Private
router.get('/', getOrders);

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', getOrderById);

// @route   PATCH /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.patch('/:id/status', admin, updateOrderStatus);

module.exports = router;
