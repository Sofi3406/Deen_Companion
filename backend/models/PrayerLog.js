const mongoose = require("mongoose");

const PrayerLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  date: { type: String, required: true, index: true }, // Format: "YYYY-MM-DD"
  prayers: {
    Fajr: { type: Boolean, default: false },
    Dhuhr: { type: Boolean, default: false },
    Asr: { type: Boolean, default: false },
    Maghrib: { type: Boolean, default: false },
    Isha: { type: Boolean, default: false },
  },
}, { versionKey: false });

module.exports = mongoose.model("PrayerLog", PrayerLogSchema);
