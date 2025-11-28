const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res) => {
    try {
        const { items, deliveryAddress, notes, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order must contain at least one item',
            });
        }

        // Validate and populate items with product details
        const orderItems = [];
        let totalAmount = 0;

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId}`,
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
                });
            }

            const subtotal = product.price * item.quantity;
            totalAmount += subtotal;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                subtotal,
            });

            // Reduce product stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Create order
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            deliveryAddress,
            notes,
            paymentMethod: paymentMethod || 'cod',
        });

        await order.populate('user', 'name phoneNumber');

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order,
        });
    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message,
        });
    }
};

/**
 * @desc    Get orders (user's own orders or all orders for admin)
 * @route   GET /api/orders
 * @access  Private
 */
const getOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        // Build query
        const query = {};

        // If not admin, only show user's own orders
        if (req.user.role !== 'admin') {
            query.user = req.user._id;
        }

        if (status) {
            query.status = status;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute query
        const orders = await Order.find(query)
            .populate('user', 'name phoneNumber')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            orders,
        });
    } catch (error) {
        console.error('Get Orders Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get orders',
            error: error.message,
        });
    }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name phoneNumber')
            .populate('items.product', 'name images');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Check authorization (user can only see their own orders, admin can see all)
        if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order',
            });
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Get Order Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get order',
            error: error.message,
        });
    }
};

/**
 * @desc    Update order status
 * @route   PATCH /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        order.status = status;

        if (status === 'delivered') {
            order.deliveredAt = Date.now();
            order.paymentStatus = 'paid';
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order,
        });
    } catch (error) {
        console.error('Update Order Status Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            error: error.message,
        });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
};
