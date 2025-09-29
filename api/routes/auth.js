const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const { sendVerificationEmail } = require('../services/emailService');
const { asyncHandler } = require('../middleware/errorHandler');
const { authenticateToken } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../validators/authValidators');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', asyncHandler(async (req, res) => {
  const { error, value } = validateRegistration(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(d => d.message)
    });
  }

  const { email, password, firstName, lastName, termsAccepted } = value;

  // Check if user already exists
  const existingUser = await query(
    'SELECT id FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (existingUser.rows.length > 0) {
    return res.status(409).json({
      error: 'User already exists with this email',
      code: 'USER_EXISTS'
    });
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Generate email verification token
  const verificationToken = uuidv4();

  // Create user
  const result = await query(
    `INSERT INTO users (email, password_hash, first_name, last_name, terms_accepted, email_verification_token) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, last_name`,
    [email.toLowerCase(), hashedPassword, firstName, lastName, termsAccepted, verificationToken]
  );

  const user = result.rows[0];

  // Send verification email
  try {
    await sendVerificationEmail(user.email, verificationToken, `${user.first_name} ${user.last_name}`);
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError);
    // Don't fail registration if email fails
  }

  // Generate JWT token
  const token = generateToken(user.id);

  res.status(201).json({
    message: 'Registration successful! Please check your email for verification.',
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      emailVerified: false
    },
    token
  });
}));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  const { error, value } = validateLogin(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(d => d.message)
    });
  }

  const { email, password } = value;

  // Find user
  const result = await query(
    'SELECT id, email, password_hash, first_name, last_name, email_verified, location FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({
      error: 'Invalid email or password',
      code: 'INVALID_CREDENTIALS'
    });
  }

  const user = result.rows[0];

  // Check password
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    return res.status(401).json({
      error: 'Invalid email or password',
      code: 'INVALID_CREDENTIALS'
    });
  }

  // Generate JWT token
  const token = generateToken(user.id);

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      emailVerified: user.email_verified,
      location: user.location
    },
    token
  });
}));

// @route   POST /api/auth/verify-email
// @desc    Verify user email
// @access  Public
router.post('/verify-email', asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      error: 'Verification token required',
      code: 'NO_TOKEN'
    });
  }

  // Find user with verification token
  const result = await query(
    'SELECT id, email FROM users WHERE email_verification_token = $1',
    [token]
  );

  if (result.rows.length === 0) {
    return res.status(400).json({
      error: 'Invalid or expired verification token',
      code: 'INVALID_TOKEN'
    });
  }

  const user = result.rows[0];

  // Update user as verified
  await query(
    'UPDATE users SET email_verified = true, email_verification_token = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
    [user.id]
  );

  res.json({
    message: 'Email verified successfully',
    user: {
      id: user.id,
      email: user.email,
      emailVerified: true
    }
  });
}));

// @route   POST /api/auth/resend-verification
// @desc    Resend verification email
// @access  Private
router.post('/resend-verification', authenticateToken, asyncHandler(async (req, res) => {
  if (req.user.email_verified) {
    return res.status(400).json({
      error: 'Email already verified',
      code: 'ALREADY_VERIFIED'
    });
  }

  // Generate new verification token
  const verificationToken = uuidv4();

  // Update user with new token
  await query(
    'UPDATE users SET email_verification_token = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [verificationToken, req.user.id]
  );

  // Send verification email
  await sendVerificationEmail(
    req.user.email, 
    verificationToken, 
    `${req.user.first_name} ${req.user.last_name}`
  );

  res.json({
    message: 'Verification email sent successfully'
  });
}));

// @route   GET /api/auth/google
// @desc    Start Google OAuth flow
// @access  Public
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  asyncHandler(async (req, res) => {
    // Generate JWT token for authenticated user
    const token = generateToken(req.user.id);

    // Redirect to frontend with token
    const redirectUrl = req.user.location 
      ? `${process.env.FRONTEND_LOGIN_SUCCESS_URL}?token=${token}`
      : `${process.env.FRONTEND_URL}/select-location?token=${token}`;

    res.redirect(redirectUrl);
  })
);

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: 'Email is required',
      code: 'EMAIL_REQUIRED'
    });
  }

  // Find user
  const result = await query(
    'SELECT id, first_name, last_name FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  // Always return success to prevent email enumeration
  res.json({
    message: 'If an account exists with this email, you will receive password reset instructions.'
  });

  // If user exists, send reset email (implement this later)
  if (result.rows.length > 0) {
    // TODO: Implement password reset email
    console.log('Password reset requested for:', email);
  }
}));

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      emailVerified: req.user.email_verified,
      location: req.user.location
    }
  });
}));

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authenticateToken, asyncHandler(async (req, res) => {
  // With JWT, logout is handled client-side by removing the token
  // This endpoint is for logging purposes and future enhancements
  res.json({
    message: 'Logout successful'
  });
}));

module.exports = router;