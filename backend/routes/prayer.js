const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
  getTodaysPrayers,
  updateTodaysPrayers
} = require('../controllers/prayersController');

// GET /api/prayers/today - returns prayer times and user's completion status for today
router.get('/today', authMiddleware, getTodaysPrayers);

// PUT /api/prayers/today - updates user's prayer completion status for today
router.put('/today', authMiddleware, updateTodaysPrayers);

module.exports = router;
