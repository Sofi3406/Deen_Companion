const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const ImaanPoint = require('../models/ImaanPoint');

// GET /api/imaan/weeklypoints
// Get weekly Imaan points for last 7 days for authenticated user
router.get('/weeklypoints', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Calculate 7-day window starting 6 days ago (including today)
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 6);

    // Aggregate total points grouped by year-month-day
    const pointsByDay = await ImaanPoint.aggregate([
      { $match: { userId, date: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          totalPoints: { $sum: '$points' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Build array of points for consecutive days, filling zero if no points for the day
    const result = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      currentDate.setDate(currentDate.getDate() - (6 - i));

      const dayData = pointsByDay.find(p =>
        p._id.year === currentDate.getFullYear() &&
        p._id.month === (currentDate.getMonth() + 1) &&
        p._id.day === currentDate.getDate()
      );
      result.push(dayData ? dayData.totalPoints : 0);
    }

    // Return array of points for last 7 days
    res.json(result);
  } catch (err) {
    console.error('Error fetching weekly Imaan points:', err);
    res.status(500).json({ msg: 'Server error fetching Imaan points' });
  }
});

module.exports = router;
