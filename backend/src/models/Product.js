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
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: 0,
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: ['Puja Items', 'Groceries', 'Spices', 'Organic', 'Daily Essentials', 'Other'],
    },
    images: [{
        type: String, // URL to image
    }],
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    unit: {
        type: String,
        default: 'piece', // kg, gram, liter, piece, etc.
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0, // Percentage
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
