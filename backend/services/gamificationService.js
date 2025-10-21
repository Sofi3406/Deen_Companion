const User = require('../models/User');

const pointsMap = { prayer:10, quran:20, sunnah:10, fasting:30 };

const badges = [
  { name: '7-Day Salah Streak', condition: u => u.salahStreak >= 7 },
  { name: 'Quran Reader Badge', condition: u => u.quranDays >= 5 },
  { name: 'Ramadan Hero', condition: u => u.ramadanFastsCompleted >=30 },
];

exports.calculatePoints = activityType => pointsMap[activityType] || 0;

exports.updateUserGamification = async (userId, activityType) => {
  const points = exports.calculatePoints(activityType);
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.imanPoints = (user.imanPoints || 0) + points;
  if (activityType === 'prayer') user.salahStreak = (user.salahStreak || 0) + 1;
  if (activityType === 'quran') user.quranDays = (user.quranDays || 0) + 1;

  user.badges = user.badges || [];
  badges.forEach(b => {
    if (b.condition(user) && !user.badges.includes(b.name)) {
      user.badges.push(b.name);
    }
  });

  await user.save();
  return { imanPoints: user.imanPoints, badges: user.badges };
};

exports.getLeaderboard = async () => User.find().sort({ imanPoints:-1 }).limit(10).select('name imanPoints level badges');
