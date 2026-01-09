const express = require('express');
const router = express.Router();
const {
    getUnits,
    createUnit,
    updateUnit,
    deleteUnit,
} = require('../controllers/unitController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getUnits);

// Protected routes
router.use(protect, admin);
router.post('/', createUnit);
router.put('/:id', updateUnit);
router.delete('/:id', deleteUnit);

module.exports = router;
