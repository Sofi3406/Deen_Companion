const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// GET /api/achievements - Get all achievements for authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user.achievements || []);
  } catch (err) {
    console.error("Error fetching achievements:", err);
    res.status(500).json({ msg: "Server error fetching achievements" });
  }
});

// POST /api/achievements - Add a new achievement to the user
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, unlocked } = req.body;

    if (!title || !description) {
      return res.status(400).json({ msg: "Title and description are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Prevent duplicate achievement titles
    const exists = (user.achievements || []).find(a => a.title === title);
    if (exists) {
      return res.status(409).json({ msg: "Achievement with this title already exists" });
    }

    user.achievements.push({ title, description, unlocked: !!unlocked });
    await user.save();

    res.status(201).json({ msg: "Achievement added", achievement: { title, description, unlocked: !!unlocked } });
  } catch (err) {
    console.error("Error adding achievement:", err);
    res.status(500).json({ msg: "Server error adding achievement" });
  }
});

// PATCH /api/achievements/:title - Update status of specific achievement
router.patch('/:title', authMiddleware, async (req, res) => {
  try {
    const { unlocked } = req.body;
    const titleParam = req.params.title;

    if (typeof unlocked !== 'boolean') {
      return res.status(400).json({ msg: "Unlocked field must be boolean" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const achievement = (user.achievements || []).find(a => a.title === titleParam);
    if (!achievement) {
      return res.status(404).json({ msg: "Achievement not found" });
    }

    achievement.unlocked = unlocked;
    await user.save();

    res.json({ msg: "Achievement updated", achievement });
  } catch (err) {
    console.error("Error updating achievement:", err);
    res.status(500).json({ msg: "Server error updating achievement" });
  }
});

module.exports = router;
