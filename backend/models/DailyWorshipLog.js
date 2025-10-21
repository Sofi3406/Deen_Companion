const mongoose = require("mongoose");

const DailyWorshipLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  date: { type: String, required: true, index: true }, // "YYYY-MM-DD"
  acts: {
    Fajr: { type: Boolean, default: false },
    Dhuhr: { type: Boolean, default: false },
    Asr: { type: Boolean, default: false },
    Maghrib: { type: Boolean, default: false },
    Isha: { type: Boolean, default: false },
    Quran: { type: Boolean, default: false },
    Dhikr: { type: Boolean, default: false },
    SunnahDuha: { type: Boolean, default: false },
    FastingMonday: { type: Boolean, default: false },
  },
}, { versionKey: false });

module.exports = mongoose.model("DailyWorshipLog", DailyWorshipLogSchema);
