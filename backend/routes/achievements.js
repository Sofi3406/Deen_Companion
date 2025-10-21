const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// GET /api/achievements - Fetch all achievements for authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(Array.isArray(user.achievements) ? user.achievements : []);
  } catch (err) {
    console.error("Error fetching achievements:", err);
    res.status(500).json({ msg: "Server error fetching achievements" });
  }
});

// POST /api/achievements - Add a new user achievement
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, unlocked } = req.body;
    if (!title || !description)
      return res.status(400).json({ msg: "Title and description are required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const exists = (user.achievements || []).find(a => a.title === title);
    if (exists)
      return res.status(409).json({ msg: "Achievement with this title already exists" });

    const newAchievement = { title, description, unlocked: !!unlocked };
    user.achievements.push(newAchievement);
    await user.save();

    res.status(201).json({ msg: "Achievement added", achievement: newAchievement });
  } catch (err) {
    console.error("Error adding achievement:", err);
    res.status(500).json({ msg: "Server error adding achievement" });
  }
});

// PATCH /api/achievements/:title - Toggle unlock status by title
router.patch('/:title', authMiddleware, async (req, res) => {
  try {
    const { unlocked } = req.body;
    if (typeof unlocked !== 'boolean')
      return res.status(400).json({ msg: "Unlocked field must be boolean" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const target = (user.achievements || []).find(a => a.title === req.params.title);
    if (!target)
      return res.status(404).json({ msg: "Achievement not found" });

    target.unlocked = unlocked;
    await user.save();

    res.json({ msg: "Achievement updated", achievement: target });
  } catch (err) {
    console.error("Error updating achievement:", err);
    res.status(500).json({ msg: "Server error updating achievement" });
  }
});

module.exports = router;
