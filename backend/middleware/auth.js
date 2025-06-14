const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. Invalid token format.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and attach to request
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. User not found.' 
      });
    }

    req.user = {
      userId: user._id,
      role: user.role,
      name: user.name,
      email: user.email
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. Invalid token.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. Token expired.' 
      });
    }
    
    console.error('Authentication error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error during authentication.' 
    });
  }
};

// Authorization middleware factory
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}` 
      });
    }

    next();
  };
};

// Admin only middleware
const adminOnly = authorize('admin');

// Admin or user middleware
const authenticatedUser = authorize('admin', 'user');

module.exports = {
  authenticate,
  authorize,
  adminOnly,
  authenticatedUser
};
