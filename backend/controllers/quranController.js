const quranService = require('../services/quranService');

exports.trackQuranProgress = async (req, res) => {
  try {
    const progress = await quranService.trackQuranProgress({ userId: req.user.id, ...req.body });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ msg: 'Error tracking Quran progress' });
  }
};

exports.getQuranProgress = async (req, res) => {
  try {
    const progress = await quranService.getQuranProgress(req.user.id);
    res.json(progress);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching Quran progress' });
  }
};

exports.getDailyQuranVerse = async (req, res) => {
  try {
    const chapter = await quranService.getDailyQuranVerse();
    res.json({ chapter });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching daily Quran verse' });
  }
};
