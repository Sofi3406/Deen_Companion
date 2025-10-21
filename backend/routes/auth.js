const express = require('express');
const router = express.Router();

const { login, register } = require('../controllers/authController');

// POST /api/auth/signup
router.post('/signup', register);

// POST /api/auth/login
router.post('/login', login);

module.exports = router;
