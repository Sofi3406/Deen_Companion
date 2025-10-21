const dhikrService = require('../services/dhikrService');

exports.addOrUpdateDhikr = async (req, res) => {
  try {
    const record = await dhikrService.addOrUpdateDhikr({ userId: req.user.id, ...req.body });
    res.json(record);
  } catch (err) {
    res.status(500).json({ msg: 'Error updating Dhikr' });
  }
};

exports.getDhikrByDate = async (req, res) => {
  try {
    const records = await dhikrService.getRecentDhikr(req.user.id);
    res.json(records);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching Dhikr data' });
  }
};
