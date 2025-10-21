const jwt = require('jsonwebtoken');

/**
 * Authentication middleware to protect API routes.
 * Verifies JWT token from Authorization (Bearer) or x-auth-token header.
 */
const authMiddleware = (req, res, next) => {
  try {
    // Retrieve token from common sources
    let token = null;
    const authHeader = req.header('Authorization');
    const xAuthToken = req.header('x-auth-token');

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (xAuthToken) {
      token = xAuthToken;
    }

    // If no token, deny access
    if (!token) {
      return res.status(401).json({ msg: 'Access denied. No token provided.' });
    }

    // Verify token authenticity and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validate decoded payload format
    if (!decoded || (!decoded.user && !decoded.id)) {
      return res.status(401).json({ msg: 'Invalid token payload structure.' });
    }

    // Attach user info for downstream middleware/controllers
    req.user = decoded.user || { id: decoded.id };
    next();

  } catch (error) {
    // Handle specific JWT errors for better clarity
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired. Please log in again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token. Authentication failed.' });
    }

    console.error('JWT Verification Error:', error.message);
    return res.status(500).json({ msg: 'Internal authentication error.' });
  }
};

module.exports = authMiddleware;
