const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getTodaysWorship,
  updateTodaysWorship
} = require('../controllers/worshipController');

// Get today's worship acts for authenticated user
router.get('/today', authMiddleware, getTodaysWorship);

// Update today's worship acts for authenticated user 
router.put('/today', authMiddleware, updateTodaysWorship);

module.exports = router;
