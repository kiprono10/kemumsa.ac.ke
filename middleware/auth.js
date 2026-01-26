const jwt = require('jsonwebtoken');

// Simple authentication middleware for admin access
// In a real application, this would be more robust with proper JWT tokens and database validation
const authenticateAdmin = (req, res, next) => {
  // For demo purposes, we'll use a simple header check
  // In production, implement proper JWT authentication
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    // For demo, we'll accept any token. In production, verify against a secret
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = { authenticateAdmin };
