const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  trackHabit,
  getHabits,
  updateHabitStatus,
  editHabitName,
  deleteHabit
} = require('../controllers/activitiesController');
const router = express.Router();

router.post('/habit', authMiddleware, trackHabit);               // Create new habit
router.get('/habit', authMiddleware, getHabits);                 // Read habits
router.put('/habit/:id/status', authMiddleware, updateHabitStatus); // Update done
router.put('/habit/:id', authMiddleware, editHabitName);            // Edit name
router.delete('/habit/:id', authMiddleware, deleteHabit);           // Delete

module.exports = router;
