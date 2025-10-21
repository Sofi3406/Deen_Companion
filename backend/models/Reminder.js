const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, required: true },   // e.g., 'prayer', 'sunnah', 'hadith'
  time: { type: String, required: true, match: /^([01]\d|2[0-3]):([0-5]\d)$/ }, // HH:mm validation
  enabled: { type: Boolean, default: true },
  message: { type: String, trim: true, default: '' },
}, { versionKey: false });

module.exports = mongoose.model('Reminder', ReminderSchema);
