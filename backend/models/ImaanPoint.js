const mongoose = require('mongoose');

const ImaanPointSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true, index: true },
  points: { type: Number, required: true, min: 0 },
}, { versionKey: false });

module.exports = mongoose.model('ImaanPoint', ImaanPointSchema);
