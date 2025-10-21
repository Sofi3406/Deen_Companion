const prayersService = require('../services/prayersService');
const PrayerLog = require('../models/PrayerLog');

// Helper to get today's date string in YYYY-MM-DD format
function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

// GET /api/prayers/today
exports.getTodaysPrayers = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    // Replace with real user location or config
    const latitude = req.user.latitude || 40.7128;
    const longitude = req.user.longitude || -74.0060;
    let times = null;
    try {
      times = await prayersService.getTodaysPrayers(latitude, longitude); // { Fajr, Dhuhr, ... }
    } catch (serviceErr) {
      console.error('Error getting prayer times:', serviceErr);
      times = null;
    }

    // Fetch or create user’s prayer log for today
    const todayStr = getTodayStr();
    let log = await PrayerLog.findOne({ user: req.user.id, date: todayStr });
    if (!log) {
      log = new PrayerLog({ user: req.user.id, date: todayStr });
      await log.save();
    }

    // Return prayer times + completion status
    res.json({
      times,
      prayed: log.prayers || {}    // { Fajr: true/false, ... }
    });
  } catch (err) {
    console.error('Error in getTodaysPrayers:', err);
    res.status(500).json({ msg: 'Error fetching prayer times or user log', error: err.message });
  }
};

// PUT /api/prayers/today
exports.updateTodaysPrayers = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const todayStr = getTodayStr();
    const prayers = req.body.prayers || {};  // Defensive: fallback to empty object

    let log = await PrayerLog.findOne({ user: req.user.id, date: todayStr });
    if (!log) {
      log = new PrayerLog({ user: req.user.id, date: todayStr });
    }

    // Only update provided prayers, keeping existing statuses
    log.prayers = { ...log.prayers, ...prayers };
    await log.save();

    res.json({ msg: "Prayer status updated", prayed: log.prayers });
  } catch (err) {
    console.error('Error in updateTodaysPrayers:', err);
    res.status(500).json({ msg: "Error updating prayer status", error: err.message });
  }
};
