const reminderService = require('../services/reminderService');

exports.addReminder = async (req, res) => {
  try {
    const reminder = await reminderService.addReminder(req.user.id, req.body);
    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ msg: 'Error adding reminder' });
  }
};

exports.getReminders = async (req, res) => {
  try {
    const reminders = await reminderService.getRemindersByUser(req.user.id);
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching reminders' });
  }
};

exports.updateReminder = async (req, res) => {
  try {
    const reminder = await reminderService.updateReminderById(req.params.id, req.body);
    res.json(reminder);
  } catch (err) {
    res.status(400).json({ msg: err.message || 'Error updating reminder' });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    await reminderService.deleteReminderById(req.params.id);
    res.json({ msg: 'Reminder deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting reminder' });
  }
};
