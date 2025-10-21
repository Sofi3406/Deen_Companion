const Habit = require('../models/Habit');

exports.createHabit = async ({ userId, habitName, goal, frequency }) => {
  if (!habitName) throw new Error('Habit name is required');
  const habit = new Habit({ user: userId, name: habitName, goal, frequency, done: false });
  await habit.save();
  return habit;
};

exports.getHabitsByUser = async (userId) => {
  return Habit.find({ user: userId }).sort({ createdAt: -1 });
};

exports.updateHabitDoneStatus = async (habitId, done) => {
  const habit = await Habit.findByIdAndUpdate(habitId, { done }, { new: true });
  if (!habit) throw new Error('Habit not found');
  return habit;
};
