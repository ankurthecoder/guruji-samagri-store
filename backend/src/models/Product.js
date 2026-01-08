const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
    },
    // Legacy fields (kept for backward compatibility)
    price: {
        type: Number,
        min: 0,
    },
    stock: {
        type: Number,
        min: 0,
        default: 0,
    },
    unit: {
        type: String,
        default: 'piece',
    },
    discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },

    // New variants system
    variants: [{
        unit: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        discount: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        minOrderQuantity: {
            type: Number,
            default: 1,
            min: 1,
        },
        maxOrderQuantity: {
            type: Number,
            default: 10,
            min: 1,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
    tags: [{
        type: String,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the updatedAt field before saving
productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for final price after discount
productSchema.virtual('finalPrice').get(function () {
    return this.price - (this.price * this.discount / 100);
});

module.exports = mongoose.model('Product', productSchema);
