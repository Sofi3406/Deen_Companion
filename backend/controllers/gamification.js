const gamificationService = require('../services/gamificationService');

exports.updateUserGamification = async (req, res) => {
  try {
    const result = await gamificationService.updateUserGamification(req.user.id, req.body.activityType);
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await gamificationService.getLeaderboard();
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ msg: 'Error getting leaderboard' });
  }
};
