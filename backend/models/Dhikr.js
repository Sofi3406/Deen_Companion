const mongoose = require('mongoose');

const DhikrSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, default: Date.now, index: true },
  morningCount: { type: Number, default: 0 },
  eveningCount: { type: Number, default: 0 },
  customCounts: { type: Map, of: Number, default: {} }, // flexible for custom adhkar counts
}, { versionKey: false });

module.exports = mongoose.model('Dhikr', DhikrSchema);
