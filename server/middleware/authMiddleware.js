const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { userId: decoded.userId }; // Set the userId correctly
      console.log('Authenticated user:', req.user);
      next();
    } catch (err) {
      console.error('Not authorized, token failed:', err);
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.error('Not authorized, no token');
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };