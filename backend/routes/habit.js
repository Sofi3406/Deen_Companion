const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Habit = require('../models/Habit');

// Get all habits for the authenticated user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user.id });
    res.json(habits);
  } catch (err) {
    next(err);
  }
});

// Add a new habit for the authenticated user
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { habitName, goal, frequency } = req.body;
    const habit = new Habit({
      user: req.user.id,
      name: habitName,
      goal: goal || '',
      frequency: frequency || 'daily'
    });
    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    next(err);
  }
});

// Update habit 'done' status
router.put('/:id/status', authMiddleware, async (req, res, next) => {
  try {
    const { done } = req.body;
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { done },
      { new: true }
    );
    if (!habit) return res.status(404).json({ msg: "Habit not found" });
    res.json(habit);
  } catch (err) {
    next(err);
  }
});

// Update habit name, goal, or frequency
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const fields = {};
    if (req.body.habitName !== undefined) fields.name = req.body.habitName;
    if (req.body.goal !== undefined) fields.goal = req.body.goal;
    if (req.body.frequency !== undefined) fields.frequency = req.body.frequency;

    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      fields,
      { new: true }
    );
    if (!habit) return res.status(404).json({ msg: "Habit not found" });
    res.json(habit);
  } catch (err) {
    next(err);
  }
});

// Delete a habit
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!habit) return res.status(404).json({ msg: "Habit not found" });
    res.json({ msg: "Habit deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
