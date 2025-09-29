const express = require('express');
const { query } = require('../config/database');
const { authenticateToken, requireEmailVerification } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateLocationUpdate, validateProfileUpdate } = require('../validators/userValidators');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.location, u.email_verified,
            u.created_at, us.id as subscription_id, us.status as subscription_status,
            p.name as package_name, us.slots_used, us.expires_at
     FROM users u
     LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.status = 'active'
     LEFT JOIN packages p ON us.package_id = p.id
     WHERE u.id = $1`,
    [req.user.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  const user = result.rows[0];
  
  res.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      location: user.location,
      emailVerified: user.email_verified,
      createdAt: user.created_at,
      subscription: user.subscription_id ? {
        id: user.subscription_id,
        status: user.subscription_status,
        packageName: user.package_name,
        slotsUsed: user.slots_used,
        expiresAt: user.expires_at
      } : null
    }
  });
}));

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, requireEmailVerification, asyncHandler(async (req, res) => {
  const { error, value } = validateProfileUpdate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(d => d.message)
    });
  }

  const { firstName, lastName, phone } = value;
  
  const result = await query(
    `UPDATE users 
     SET first_name = $1, last_name = $2, phone = $3, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $4 
     RETURNING id, email, first_name, last_name, phone, location`,
    [firstName, lastName, phone, req.user.id]
  );

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: result.rows[0].id,
      email: result.rows[0].email,
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name,
      phone: result.rows[0].phone,
      location: result.rows[0].location
    }
  });
}));

// @route   POST /api/users/select-location
// @desc    Select user delivery location
// @access  Private
router.post('/select-location', authenticateToken, requireEmailVerification, asyncHandler(async (req, res) => {
  const { error, value } = validateLocationUpdate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.details.map(d => d.message)
    });
  }

  const { location } = value;

  // Update user location
  await query(
    'UPDATE users SET location = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [location, req.user.id]
  );

  res.json({
    message: 'Location selected successfully',
    location
  });
}));

// @route   GET /api/users/locations
// @desc    Get available delivery locations with pricing
// @access  Public
router.get('/locations', asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT DISTINCT pp.location, dp.name as delivery_point_name, dp.address
     FROM package_pricing pp
     LEFT JOIN delivery_points dp ON pp.location = dp.location AND dp.active = true
     WHERE pp.active = true
     ORDER BY pp.location`
  );

  const locations = {};
  
  result.rows.forEach(row => {
    if (!locations[row.location]) {
      locations[row.location] = {
        location: row.location,
        displayName: row.location.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        deliveryPoints: []
      };
    }
    
    if (row.delivery_point_name) {
      locations[row.location].deliveryPoints.push({
        name: row.delivery_point_name,
        address: row.address
      });
    }
  });

  res.json({
    locations: Object.values(locations)
  });
}));

// @route   GET /api/users/delivery-points
// @desc    Get delivery points for user's location
// @access  Private
router.get('/delivery-points', authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user.location) {
    return res.status(400).json({
      error: 'Location not selected',
      code: 'NO_LOCATION',
      message: 'Please select your delivery location first'
    });
  }

  const result = await query(
    'SELECT id, name, address, contact_phone FROM delivery_points WHERE location = $1 AND active = true',
    [req.user.location]
  );

  res.json({
    deliveryPoints: result.rows
  });
}));

// @route   GET /api/users/order-history
// @desc    Get user's order history
// @access  Private
router.get('/order-history', authenticateToken, requireEmailVerification, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const result = await query(
    `SELECT o.id, o.total_amount, o.delivery_fee, o.status, o.delivery_date, 
            o.payment_status, o.created_at,
            COUNT(oi.id) as item_count
     FROM orders o
     LEFT JOIN order_items oi ON o.id = oi.order_id
     WHERE o.user_id = $1
     GROUP BY o.id
     ORDER BY o.created_at DESC
     LIMIT $2 OFFSET $3`,
    [req.user.id, limit, offset]
  );

  // Get total count for pagination
  const countResult = await query(
    'SELECT COUNT(*) FROM orders WHERE user_id = $1',
    [req.user.id]
  );

  const totalOrders = parseInt(countResult.rows[0].count);
  const totalPages = Math.ceil(totalOrders / limit);

  res.json({
    orders: result.rows,
    pagination: {
      page,
      limit,
      totalOrders,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  });
}));

// @route   GET /api/users/subscription-status
// @desc    Get user's current subscription status
// @access  Private
router.get('/subscription-status', authenticateToken, requireEmailVerification, asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT us.id, us.status, us.slots_used, us.starts_at, us.expires_at, us.price_paid,
            p.name as package_name, p.slots as total_slots, p.max_quantity_per_item
     FROM user_subscriptions us
     JOIN packages p ON us.package_id = p.id
     WHERE us.user_id = $1 AND us.status = 'active'
     ORDER BY us.created_at DESC
     LIMIT 1`,
    [req.user.id]
  );

  if (result.rows.length === 0) {
    return res.json({
      subscription: null,
      message: 'No active subscription found'
    });
  }

  const subscription = result.rows[0];
  
  res.json({
    subscription: {
      id: subscription.id,
      status: subscription.status,
      packageName: subscription.package_name,
      totalSlots: subscription.total_slots,
      slotsUsed: subscription.slots_used,
      slotsRemaining: subscription.total_slots ? subscription.total_slots - subscription.slots_used : null,
      maxQuantityPerItem: subscription.max_quantity_per_item,
      pricePaid: subscription.price_paid,
      startsAt: subscription.starts_at,
      expiresAt: subscription.expires_at,
      isExpiringSoon: new Date(subscription.expires_at) - new Date() < 7 * 24 * 60 * 60 * 1000 // 7 days
    }
  });
}));

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', authenticateToken, asyncHandler(async (req, res) => {
  const { confirmDelete } = req.body;
  
  if (!confirmDelete) {
    return res.status(400).json({
      error: 'Account deletion confirmation required',
      code: 'CONFIRMATION_REQUIRED'
    });
  }

  // Check for active subscriptions or pending orders
  const activeDataResult = await query(
    `SELECT 
      (SELECT COUNT(*) FROM user_subscriptions WHERE user_id = $1 AND status = 'active') as active_subscriptions,
      (SELECT COUNT(*) FROM orders WHERE user_id = $1 AND status IN ('pending', 'confirmed', 'preparing')) as pending_orders`,
    [req.user.id]
  );

  const { active_subscriptions, pending_orders } = activeDataResult.rows[0];

  if (active_subscriptions > 0 || pending_orders > 0) {
    return res.status(409).json({
      error: 'Cannot delete account with active subscriptions or pending orders',
      code: 'ACTIVE_DATA_EXISTS',
      details: {
        activeSubscriptions: active_subscriptions,
        pendingOrders: pending_orders
      }
    });
  }

  // Soft delete - anonymize user data instead of hard delete
  await query(
    `UPDATE users 
     SET email = $1, first_name = 'Deleted', last_name = 'User', 
         password_hash = NULL, google_id = NULL, phone = NULL,
         email_verified = false, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2`,
    [`deleted_${req.user.id}@deleted.quickmarket.com`, req.user.id]
  );

  res.json({
    message: 'Account deleted successfully'
  });
}));

module.exports = router;