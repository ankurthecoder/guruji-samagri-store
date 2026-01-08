const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Unit name is required'],
        unique: true,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Unit', unitSchema);
