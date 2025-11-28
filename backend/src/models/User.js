const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        trim: true,
        default: '',
    },
    dateOfBirth: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', ''],
        default: '',
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isProfileComplete: {
        type: Boolean,
        default: false,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        sparse: true, // Allows null values but enforces uniqueness
    },
    password: {
        type: String,
        select: false, // Don't return password by default
    },
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
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Method to check if profile is complete
userSchema.methods.checkProfileComplete = function () {
    return !!(this.name && this.dateOfBirth && this.gender);
};

module.exports = mongoose.model('User', userSchema);
