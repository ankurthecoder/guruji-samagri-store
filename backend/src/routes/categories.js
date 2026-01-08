const express = require('express');
const router = express.Router();
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getCategories);

// Protected routes
router.use(protect, admin);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
