const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        name: String, // Store product name at time of order
        price: Number, // Store price at time of order
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        subtotal: Number,
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    deliveryAddress: {
        fullName: String,
        phoneNumber: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        pincode: String,
        landmark: String,
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'online', 'card'],
        default: 'cod',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
    },
    notes: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    deliveredAt: {
        type: Date,
    },
});

// Update the updatedAt field before saving
orderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Calculate total from items if not provided
orderSchema.pre('save', function (next) {
    if (this.items && this.items.length > 0) {
        this.totalAmount = this.items.reduce((sum, item) => {
            item.subtotal = item.price * item.quantity;
            return sum + item.subtotal;
        }, 0);
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
