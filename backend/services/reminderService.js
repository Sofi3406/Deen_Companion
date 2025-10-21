const Reminder = require('../models/Reminder');

exports.addReminder = async (userId, reminderData) => {
  const reminder = new Reminder({ user: userId, ...reminderData });
  await reminder.save();
  return reminder;
};

exports.getRemindersByUser = (userId) => {
  return Reminder.find({ user: userId });
};

exports.updateReminderById = async (reminderId, data) => {
  const reminder = await Reminder.findByIdAndUpdate(reminderId, data, { new: true });
  if (!reminder) throw new Error('Reminder not found');
  return reminder;
};

exports.deleteReminderById = async (reminderId) => {
  await Reminder.findByIdAndDelete(reminderId);
};
