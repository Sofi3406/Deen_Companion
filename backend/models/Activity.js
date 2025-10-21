const mongoose = require('mongoose');

// For logging various activities, including habits
const ActivitySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  activityType: { 
    type: String, 
    required: true, 
    enum: ['habit', 'prayer', 'quran', 'dhikr', 'fasting', 'custom'], 
    index: true 
  },

  // If an activity is a habit, use these fields
  habitName: { 
    type: String,
    required: function () { return this.activityType === 'habit'; }
  },
  done: { 
    type: Boolean, 
    default: false 
  },

  // For other activity types
  details: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  },

  date: { 
    type: Date, 
    default: Date.now, 
    index: true 
  },

}, { versionKey: false });

module.exports = mongoose.model('Activity', ActivitySchema);
