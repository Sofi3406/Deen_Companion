const mongoose = require('mongoose');

const QuranProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, default: Date.now, index: true }, // Track progress by date
  pagesRead: { type: Number, default: 0, min: 0 },
  surahsRead: { type: [String], default: [] }, // Array of surah names or numbers
}, { versionKey: false });

module.exports = mongoose.model('QuranProgress', QuranProgressSchema);
