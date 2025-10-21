const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { addReminder, updateReminder, getReminders, deleteReminder } = require('../controllers/reminderController');
const router = express.Router();

router.post('/', authMiddleware, addReminder);
router.get('/', authMiddleware, getReminders);
router.put('/:id', authMiddleware, updateReminder);
router.delete('/:id', authMiddleware, deleteReminder);

module.exports = router;
