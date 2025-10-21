const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer) or x-auth-token
  if (req.header("Authorization") && req.header("Authorization").startsWith("Bearer ")) {
    token = req.header("Authorization").split(" ")[1];
  } else if (req.header("x-auth-token")) {
    token = req.header("x-auth-token");
  }

  // No token found
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.user || !decoded.user.id) {
      return res.status(401).json({ msg: "Token payload malformed" });
    }

    // Attach user to request
    req.user = decoded.user;
    next();
  } catch (err) {
    // Token verification failed
    return res.status(401).json({ msg: "Token is not valid or expired" });
  }
};

module.exports = authMiddleware;
