const pointsMap = {
  prayer: 10,
  quran: 20,
  sunnah: 10,
  fasting: 30,
};

exports.calculatePoints = (activityType) => pointsMap[activityType] || 0;
