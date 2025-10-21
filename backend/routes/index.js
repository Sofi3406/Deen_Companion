const express = require('express');
const router = express.Router();


router.use('/auth', require('./auth'));
router.use('/user', require('./user'));  // this handles /api/user/profile, etc.
// Add this line:
router.use('/user/worship', require('./worship'));
router.use('/user/achievements', require('./achievements'));  // handles /api/user/achievements
router.use('/activities', require('./activities'));
router.use('/dhikr', require('./dhikr'));
router.use('/imaan', require('./imaan'));
router.use('/leaderboard', require('./leaderboard'));
router.use('/prayers', require('./prayer'));
router.use('/quran', require('./quran'));
router.use('/reminders', require('./reminders'));

module.exports = router;
