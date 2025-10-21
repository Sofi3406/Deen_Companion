const QuranProgress = require('../models/QuranProgress');
const axios = require('axios');

exports.trackQuranProgress = async ({ userId, pagesRead, surahsRead }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let progress = await QuranProgress.findOne({ user: userId, date: { $gte: today } });

  if (progress) {
    progress.pagesRead += pagesRead;
    progress.surahsRead = Array.from(new Set([...progress.surahsRead, ...surahsRead]));
  } else {
    progress = new QuranProgress({ user: userId, pagesRead, surahsRead, date: new Date() });
  }

  await progress.save();
  return progress;
};

exports.getQuranProgress = async (userId) => {
  return QuranProgress.find({ user: userId }).sort({ date: -1 }).limit(30);
};

exports.getDailyQuranVerse = async () => {
  const response = await axios.get('https://api.quran.com/api/v4/chapters');
  return response.data.chapters[0];
};
