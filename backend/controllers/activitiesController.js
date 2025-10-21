const Activity = require('../models/Activity');

// Create a new habit
exports.trackHabit = async (req, res) => {
  try {
    const { habitName } = req.body;
    if (!habitName) return res.status(400).json({ msg: "Habit name is required" });

    const habit = new Activity({
      user: req.user.id,
      activityType: 'habit',
      habitName,
      done: false
    });
    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ msg: err.message || 'Error adding habit' });
  }
};

// Get all habits for the authenticated user
exports.getHabits = async (req, res) => {
  try {
    const habits = await Activity.find({ user: req.user.id, activityType: 'habit' }).sort({ date: -1 });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching habits' });
  }
};

// Update habit's "done" status
exports.updateHabitStatus = async (req, res) => {
  try {
    const habit = await Activity.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id, activityType: 'habit' },
      { done: !!req.body.done },
      { new: true }
    );
    if (!habit) return res.status(404).json({ msg: "Habit not found" });
    res.json(habit);
  } catch (err) {
    res.status(500).json({ msg: err.message || 'Error updating habit status' });
  }
};

// Edit habit name
exports.editHabitName = async (req, res) => {
  try {
    const { habitName } = req.body;
    if (!habitName) return res.status(400).json({ msg: "Habit name is required" });
    const habit = await Activity.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id, activityType: 'habit' },
      { habitName },
      { new: true }
    );
    if (!habit) return res.status(404).json({ msg: "Habit not found" });
    res.json(habit);
  } catch (err) {
    res.status(500).json({ msg: err.message || 'Error updating habit name' });
  }
};

// Delete habit
exports.deleteHabit = async (req, res) => {
  try {
    const result = await Activity.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
      activityType: 'habit'
    });
    if (!result) return res.status(404).json({ msg: "Habit not found" });
    res.json({ msg: "Habit deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message || 'Error deleting habit' });
  }
};
