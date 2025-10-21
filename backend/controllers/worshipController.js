const prayersService = require('../services/prayersService');
const DailyWorshipLog = require('../models/DailyWorshipLog');

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

// GET /api/worship/today
exports.getTodaysWorship = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    
    // Use user's location, otherwise default to NYC
    const latitude = req.user.latitude || 40.7128;
    const longitude = req.user.longitude || -74.0060;

    // Fetch prayer times, handle errors defensively
    let times = null;
    try {
      times = await prayersService.getTodaysPrayers(latitude, longitude);
    } catch (err) {
      console.error("Error from prayersService:", err.message);
      times = null; // Don't throw, just allow fallback
    }

    const todayStr = getTodayStr();
    // Find log, create if not found
    let log = await DailyWorshipLog.findOne({ user: req.user.id, date: todayStr });
    if (!log) {
      log = new DailyWorshipLog({ user: req.user.id, date: todayStr, acts: {} });
      await log.save();
    }

    // Return prayer times and worship acts
    res.json({
      times, // can be null if prayer service fails
      worship: log.acts
    });
  } catch (err) {
    console.error("getTodaysWorship error:", err.message);
    res.status(500).json({ msg: 'Error fetching worship log', error: err.message });
  }
};

// PUT /api/worship/today
exports.updateTodaysWorship = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const todayStr = getTodayStr();
    const { worship } = req.body; // Expect an object, e.g. { Fajr: true, Quran: true, ... }

    let log = await DailyWorshipLog.findOne({ user: req.user.id, date: todayStr });
    if (!log) {
      log = new DailyWorshipLog({ user: req.user.id, date: todayStr, acts: {} });
    }

    // Update only passed keys (preserve others)
    log.acts = { ...log.acts, ...worship };
    await log.save();

    res.json({ msg: "Worship status updated", worship: log.acts });
  } catch (err) {
    console.error("updateTodaysWorship error:", err.message);
    res.status(500).json({ msg: "Error updating worship status", error: err.message });
  }
};
