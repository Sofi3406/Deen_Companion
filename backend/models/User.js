const mongoose = require('mongoose');

// Define sub-schema for an individual achievement
const AchievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  unlocked: { type: Boolean, default: false }
}, { _id: false });

// Define sub-schema for an individual worship act for a day
const WorshipActSchema = new mongoose.Schema({
  name: { type: String, required: true },    // E.g. "Fajr Prayer"
  status: { type: Boolean, required: true }, // true = completed
  points: { type: Number, default: 0 }
}, { _id: false });

// A day's worth of worship acts
const WorshipLogSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD for simplicity
  acts: [WorshipActSchema]
}, { _id: false });

// Main User schema
const UserSchema = new mongoose.Schema({
  name:      { type: String, required: true, index: true },
  email:     { type: String, unique: true, required: true, lowercase: true, trim: true },
  password:  { type: String, required: true },

  imanPoints: { type: Number, default: 0 },
  level:      { type: String, default: "Student of Deen" },
  badges:     [{ type: String }],

  achievements: { type: [AchievementSchema], default: [] },
  worshipLogs:  { type: [WorshipLogSchema],  default: [] },

  createdAt:   { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model('User', UserSchema);
