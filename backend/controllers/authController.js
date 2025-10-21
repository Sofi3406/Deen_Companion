const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const token = await authService.registerUser(req.body);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ msg: err.message || 'Registration error' });
  }
};

exports.login = async (req, res) => {
  try {
    const token = await authService.loginUser(req.body);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ msg: err.message || 'Login error' });
  }
};
