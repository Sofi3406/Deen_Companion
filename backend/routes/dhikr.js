const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { addOrUpdateDhikr, getDhikrByDate } = require('../controllers/dhikrController');

// GET /api/dhikr -- fetch user's dhikr for today (or by query date)
router.get('/', authMiddleware, getDhikrByDate);

// POST /api/dhikr -- add or update dhikr for today
router.post('/', authMiddleware, addOrUpdateDhikr);

module.exports = router;
