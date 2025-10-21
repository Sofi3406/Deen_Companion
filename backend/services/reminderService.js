const Reminder = require('../models/Reminder');

// Create a reminder
exports.addReminder = async (userId, reminderData) => {
  // Ensure required fields are present
  if (!reminderData.type || !reminderData.time) {
    throw new Error("Reminder 'type' and 'time' are required");
  }

  const reminder = new Reminder({
    user: userId,
    ...reminderData
  });

  await reminder.save();
  return reminder;
};

// Get all reminders for a specific user
exports.getRemindersByUser = async (userId) => {
  return Reminder.find({ user: userId }).sort({ time: 1 });
};

// Update a reminder by ID
exports.updateReminderById = async (reminderId, data) => {
  const reminder = await Reminder.findByIdAndUpdate(reminderId, data, { new: true });

  if (!reminder) throw new Error('Reminder not found');
  return reminder;
};

// Delete a reminder by ID
exports.deleteReminderById = async (reminderId) => {
  const deleted = await Reminder.findByIdAndDelete(reminderId);

  if (!deleted) throw new Error('Reminder not found');
  return deleted;
};
