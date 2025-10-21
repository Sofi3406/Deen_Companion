const express = require('express');
const router = express.Router();

// Import authentication middleware
const authMiddleware = require('../middleware/authMiddleware');

// Import controller functions
const { 
  trackQuranProgress, 
  getQuranProgress, 
  getDailyQuranVerse 
} = require('../controllers/quranController');

// POST to track/update Quran reading progress for authenticated user
router.post('/progress', authMiddleware, trackQuranProgress);

// GET current Quran reading progress for authenticated user
router.get('/progress', authMiddleware, getQuranProgress);

// GET the daily Quran verse for authenticated user
router.get('/dailyverse', authMiddleware, getDailyQuranVerse);

module.exports = router;
