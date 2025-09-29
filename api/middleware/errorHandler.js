// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('❌ Global error handler caught:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Database errors
  if (err.code === '23505') { // PostgreSQL unique violation
    return res.status(409).json({
      error: 'Resource already exists',
      code: 'DUPLICATE_RESOURCE',
      details: err.detail
    });
  }

  if (err.code === '23503') { // PostgreSQL foreign key violation
    return res.status(400).json({
      error: 'Invalid reference to related resource',
      code: 'INVALID_REFERENCE',
      details: err.detail
    });
  }

  if (err.code === '23502') { // PostgreSQL not null violation
    return res.status(400).json({
      error: 'Required field missing',
      code: 'MISSING_REQUIRED_FIELD',
      details: err.detail
    });
  }

  // Validation errors (Joi)
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Validation error',
      code: 'VALIDATION_ERROR',
      details: err.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      code: 'TOKEN_EXPIRED'
    });
  }

  // Paystack/Payment errors
  if (err.name === 'PaystackError') {
    return res.status(402).json({
      error: 'Payment processing error',
      code: 'PAYMENT_ERROR',
      details: err.message
    });
  }

  // Cloudinary errors
  if (err.name === 'CloudinaryError') {
    return res.status(400).json({
      error: 'Image upload error',
      code: 'UPLOAD_ERROR',
      details: err.message
    });
  }

  // Email service errors
  if (err.name === 'ResendError') {
    return res.status(502).json({
      error: 'Email service error',
      code: 'EMAIL_ERROR',
      details: err.message
    });
  }

  // Rate limiting errors
  if (err.name === 'TooManyRequestsError') {
    return res.status(429).json({
      error: 'Too many requests',
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Please try again later'
    });
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err
    })
  });
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  error.code = 'ROUTE_NOT_FOUND';
  next(error);
};

module.exports = {
  errorHandler,
  asyncHandler,
  notFound
};