const { body, validationResult } = require('express-validator');

// Validation middleware wrapper
const validate = (validations) => {
    return async (req, res, next) => {
        // Run all validations
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg,
            })),
        });
    };
};

// Common validation rules
const profileValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('dateOfBirth')
        .notEmpty()
        .withMessage('Date of birth is required')
        .isISO8601()
        .withMessage('Invalid date format')
        .custom((value) => {
            const age = new Date().getFullYear() - new Date(value).getFullYear();
            if (age < 13 || age > 120) {
                throw new Error('Age must be between 13 and 120 years');
            }
            return true;
        }),
    body('gender')
        .notEmpty()
        .withMessage('Gender is required')
        .isIn(['Male', 'Female', 'Other'])
        .withMessage('Invalid gender value'),
];

const productValidation = [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

module.exports = {
    validate,
    profileValidation,
    productValidation,
};
