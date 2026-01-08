const express = require('express');
const router = express.Router();
const {
    getUnits,
    createUnit,
} = require('../controllers/unitController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getUnits);

// Protected routes
router.use(protect, admin);
router.post('/', createUnit);

module.exports = router;
