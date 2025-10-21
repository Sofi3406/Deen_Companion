const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

// Helper to get today's date as YYYY-MM-DD string
function getTodayString() {
  const today = new Date();
  return today.toISOString().slice(0, 10);
}

// GET /api/user/profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    console.log("Backend fetched user for /profile:", user);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const todayStr = getTodayString();

    let todayLog = null;
    if (Array.isArray(user.worshipLogs)) {
      todayLog = user.worshipLogs.find(log => log.date === todayStr);
    }

    res.json({
      name: user.name,
      email: user.email,
      imanPoints: user.imanPoints || 0,
      level: user.level,
      badges: user.badges || [],
      achievements: user.achievements || [],
      worshipToday: todayLog ? todayLog.acts : {},
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ msg: "Server error fetching profile" });
  }
});

// GET /api/user/achievements
router.get("/achievements", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user.achievements || []);
  } catch (err) {
    console.error("Error fetching user achievements:", err);
    res.status(500).json({ msg: "Server error fetching achievements" });
  }
});

module.exports = router;
