const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// JWT Authentication Middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        code: 'NO_TOKEN'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get fresh user data
    const result = await query(
      'SELECT id, email, first_name, last_name, location, email_verified FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid token - user not found',
        code: 'INVALID_USER'
      });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      error: 'Authentication error',
      code: 'AUTH_ERROR'
    });
  }
};

// Email verification check middleware
const requireEmailVerification = (req, res, next) => {
  if (!req.user.email_verified) {
    return res.status(403).json({
      error: 'Email verification required',
      code: 'EMAIL_NOT_VERIFIED',
      message: 'Please verify your email address before accessing this resource'
    });
  }
  next();
};

// Location selection check middleware
const requireLocationSelection = (req, res, next) => {
  if (!req.user.location) {
    return res.status(403).json({
      error: 'Location selection required',
      code: 'NO_LOCATION',
      message: 'Please select your delivery location before proceeding'
    });
  }
  next();
};

// Admin role check middleware (for future use)
const requireAdmin = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT role FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
      return res.status(403).json({
        error: 'Admin access required',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ 
      error: 'Authorization error',
      code: 'AUTH_ERROR'
    });
  }
};

// Order window validation middleware
const validateOrderWindow = (req, res, next) => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  const orderWindowDays = process.env.ORDER_WINDOW_DAYS?.split(',').map(d => parseInt(d)) || [0, 1, 2];
  
  if (!orderWindowDays.includes(dayOfWeek)) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const allowedDays = orderWindowDays.map(d => dayNames[d]).join(', ');
    
    return res.status(403).json({
      error: 'Orders can only be placed during the order window',
      code: 'OUTSIDE_ORDER_WINDOW',
      message: `Orders are only accepted on: ${allowedDays}`,
      currentDay: dayNames[dayOfWeek],
      allowedDays: orderWindowDays
    });
  }
  
  next();
};

module.exports = {
  authenticateToken,
  requireEmailVerification,
  requireLocationSelection,
  requireAdmin,
  validateOrderWindow
};