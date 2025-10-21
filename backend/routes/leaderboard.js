const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getLeaderboard } = require('../controllers/gamification');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const leaderboard = await getLeaderboard();
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get leaderboard' });
  }
});

module.exports = router;
