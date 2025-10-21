const Dhikr = require('../models/Dhikr');

exports.addOrUpdateDhikr = async ({ userId, date, morningCount = 0, eveningCount = 0, customCounts = {} }) => {
  const day = date ? new Date(date) : new Date();
  day.setHours(0, 0, 0, 0);

  let record = await Dhikr.findOne({ user: userId, date: day });

  if (record) {
    record.morningCount += morningCount;
    record.eveningCount += eveningCount;
    for (const [key, value] of Object.entries(customCounts)) {
      record.customCounts.set(key, (record.customCounts.get(key) || 0) + value);
    }
  } else {
    record = new Dhikr({ user: userId, date: day, morningCount, eveningCount, customCounts });
  }
  await record.save();
  return record;
};

exports.getRecentDhikr = async (userId, limit = 30) => {
  return Dhikr.find({ user: userId }).sort({ date: -1 }).limit(limit);
};
