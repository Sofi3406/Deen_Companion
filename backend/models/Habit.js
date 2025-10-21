const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  goal: { type: String, default: '' },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
  done: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false });

module.exports = mongoose.model('Habit', HabitSchema);
