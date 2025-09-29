const express = require('express');
const { query, transaction } = require('../config/database');
const { authenticateToken, requireEmailVerification, requireLocationSelection } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateSubscriptionPurchase } = require('../validators/subscriptionValidators');

const router = express.Router();

// @route   GET /api/subscriptions/packages
// @desc    Get available subscription packages with pricing for user's location
// @access  Private
router.get('/packages', authenticateToken, requireLocationSelection, asyncHandler(async (req, res) => {
  const result = await query(`
    SELECT p.id, p.name, p.slots, p.max_quantity_per_item,
           pp.price, pp.location
    FROM packages p
    JOIN package_pricing pp ON p.id = pp.package_id
    WHERE pp.location = $1 AND pp.active = true
    ORDER BY pp.price ASC
  `, [req.user.location]);

  // Format the response
  const packages = result.rows.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    displayName: pkg.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    slots: pkg.slots,
    maxQuantityPerItem: pkg.max_quantity_per_item,
    price: pkg.price,
    location: pkg.location,
    features: getPackageFeatures(pkg.name, pkg.slots, pkg.max_quantity_per_item)
  }));

  res.json({
    packages,
    location: req.user.location,
    locationDisplayName: req.user.location.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  });
}));

// Helper function to get package features
function getPackageFeatures(packageName, slots, maxQuantityPerItem) {
  const features = [];
  
  if (slots) {
    features.push(`${slots} delivery slots per cycle`);
  } else {
    features.push('Unlimited delivery slots');
  }

  if (maxQuantityPerItem) {
    features.push(`Up to ${maxQuantityPerItem} units per item`);
  } else {
    features.push('No quantity limits per item');
  }

  features.push('Bulk pricing discounts');
  features.push('Thursday-Saturday delivery');
  features.push('Email notifications');

  if (packageName === '6_slots' || packageName === 'unlimited') {
    features.push('Priority customer support');
  }

  return features;
}

// @route   GET /api/subscriptions/current
// @desc    Get user's current active subscription
// @access  Private
router.get('/current', authenticateToken, requireEmailVerification, asyncHandler(async (req, res) => {
  const result = await query(`
    SELECT us.id, us.status, us.slots_used, us.price_paid, us.starts_at, us.expires_at,
           us.payment_reference, us.created_at,
           p.name as package_name, p.slots as total_slots, p.max_quantity_per_item,
           pp.location
    FROM user_subscriptions us
    JOIN packages p ON us.package_id = p.id
    JOIN package_pricing pp ON p.id = pp.package_id AND us.location = pp.location
    WHERE us.user_id = $1 AND us.status = 'active'
    ORDER BY us.created_at DESC
    LIMIT 1
  `, [req.user.id]);

  if (result.rows.length === 0) {
    return res.json({
      subscription: null,
      message: 'No active subscription found'
    });
  }

  const subscription = result.rows[0];
  const now = new Date();
  const expiresAt = new Date(subscription.expires_at);
  const daysUntilExpiry = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));

  res.json({
    subscription: {
      id: subscription.id,
      status: subscription.status,
      packageName: subscription.package_name,
      displayName: subscription.package_name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      totalSlots: subscription.total_slots,
      slotsUsed: subscription.slots_used,
      slotsRemaining: subscription.total_slots ? subscription.total_slots - subscription.slots_used : null,
      maxQuantityPerItem: subscription.max_quantity_per_item,
      pricePaid: subscription.price_paid,
      location: subscription.location,
      startsAt: subscription.starts_at,
      expiresAt: subscription.expires_at,
      paymentReference: subscription.payment_reference,
      createdAt: subscription.created_at,
      daysUntilExpiry,
      isExpiringSoon: daysUntilExpiry <= 7 && daysUntilExpiry > 0,
      isExpired: daysUntilExpiry <= 0
    }
  });
}));

// @route   POST /api/subscriptions/purchase
// @desc    Purchase a subscription package
// @access  Private
router.post('/purchase', 
  authenticateToken, 
  requireEmailVerification, 
  requireLocationSelection, 
  asyncHandler(async (req, res) => {
    const { error, value } = validateSubscriptionPurchase(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }

    const { packageId, paymentReference } = value;

    // Check if user already has an active subscription
    const existingSubscription = await query(
      'SELECT id FROM user_subscriptions WHERE user_id = $1 AND status = $2',
      [req.user.id, 'active']
    );

    if (existingSubscription.rows.length > 0) {
      return res.status(409).json({
        error: 'User already has an active subscription',
        code: 'ACTIVE_SUBSCRIPTION_EXISTS'
      });
    }

    // Get package details and pricing
    const packageResult = await query(`
      SELECT p.id, p.name, p.slots, p.max_quantity_per_item, pp.price
      FROM packages p
      JOIN package_pricing pp ON p.id = pp.package_id
      WHERE p.id = $1 AND pp.location = $2 AND pp.active = true
    `, [packageId, req.user.location]);

    if (packageResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Package not found or not available for your location',
        code: 'PACKAGE_NOT_FOUND'
      });
    }

    const packageInfo = packageResult.rows[0];

    // Verify payment with Paystack (implement this in payment service)
    // For now, we'll assume payment is verified
    
    // Create subscription in transaction
    const result = await transaction(async (client) => {
      // Calculate subscription period (30 days for now)
      const startsAt = new Date();
      const expiresAt = new Date(startsAt.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days

      const subscriptionResult = await client.query(`
        INSERT INTO user_subscriptions 
        (user_id, package_id, location, price_paid, starts_at, expires_at, payment_reference)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, status, starts_at, expires_at
      `, [
        req.user.id,
        packageId,
        req.user.location,
        packageInfo.price,
        startsAt,
        expiresAt,
        paymentReference
      ]);

      return subscriptionResult.rows[0];
    });

    // Send confirmation email (implement this)
    // await sendSubscriptionConfirmationEmail(req.user.email, {...});

    res.status(201).json({
      message: 'Subscription purchased successfully',
      subscription: {
        id: result.id,
        status: result.status,
        packageName: packageInfo.name,
        displayName: packageInfo.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        totalSlots: packageInfo.slots,
        maxQuantityPerItem: packageInfo.max_quantity_per_item,
        pricePaid: packageInfo.price,
        location: req.user.location,
        startsAt: result.starts_at,
        expiresAt: result.expires_at,
        paymentReference
      }
    });
  })
);

// @route   POST /api/subscriptions/renew
// @desc    Renew current subscription
// @access  Private
router.post('/renew', 
  authenticateToken, 
  requireEmailVerification, 
  requireLocationSelection,
  asyncHandler(async (req, res) => {
    const { paymentReference } = req.body;

    if (!paymentReference) {
      return res.status(400).json({
        error: 'Payment reference required',
        code: 'PAYMENT_REFERENCE_REQUIRED'
      });
    }

    // Get current subscription
    const currentSubResult = await query(`
      SELECT us.id, us.package_id, us.expires_at, p.name, pp.price
      FROM user_subscriptions us
      JOIN packages p ON us.package_id = p.id
      JOIN package_pricing pp ON p.id = pp.package_id AND us.location = pp.location
      WHERE us.user_id = $1 AND us.status = 'active'
      ORDER BY us.created_at DESC
      LIMIT 1
    `, [req.user.id]);

    if (currentSubResult.rows.length === 0) {
      return res.status(404).json({
        error: 'No active subscription found to renew',
        code: 'NO_ACTIVE_SUBSCRIPTION'
      });
    }

    const currentSub = currentSubResult.rows[0];

    // Create new subscription period
    const result = await transaction(async (client) => {
      // Mark current subscription as expired
      await client.query(
        'UPDATE user_subscriptions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['expired', currentSub.id]
      );

      // Create new subscription
      const startsAt = new Date(currentSub.expires_at);
      const expiresAt = new Date(startsAt.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days

      const newSubResult = await client.query(`
        INSERT INTO user_subscriptions 
        (user_id, package_id, location, price_paid, starts_at, expires_at, payment_reference)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, status, starts_at, expires_at
      `, [
        req.user.id,
        currentSub.package_id,
        req.user.location,
        currentSub.price,
        startsAt,
        expiresAt,
        paymentReference
      ]);

      return newSubResult.rows[0];
    });

    res.json({
      message: 'Subscription renewed successfully',
      subscription: {
        id: result.id,
        status: result.status,
        packageName: currentSub.name,
        startsAt: result.starts_at,
        expiresAt: result.expires_at,
        paymentReference
      }
    });
  })
);

// @route   POST /api/subscriptions/cancel
// @desc    Cancel current subscription
// @access  Private
router.post('/cancel', authenticateToken, requireEmailVerification, asyncHandler(async (req, res) => {
  const { reason } = req.body;

  // Get current subscription
  const result = await query(
    'SELECT id, expires_at FROM user_subscriptions WHERE user_id = $1 AND status = $2',
    [req.user.id, 'active']
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: 'No active subscription found',
      code: 'NO_ACTIVE_SUBSCRIPTION'
    });
  }

  const subscription = result.rows[0];

  // Update subscription status
  await query(
    'UPDATE user_subscriptions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    ['cancelled', subscription.id]
  );

  // Log cancellation reason (for analytics)
  console.log('Subscription cancelled:', {
    userId: req.user.id,
    subscriptionId: subscription.id,
    reason: reason || 'No reason provided'
  });

  res.json({
    message: 'Subscription cancelled successfully',
    validUntil: subscription.expires_at
  });
}));

// @route   GET /api/subscriptions/history
// @desc    Get user's subscription history
// @access  Private
router.get('/history', authenticateToken, requireEmailVerification, asyncHandler(async (req, res) => {
  const result = await query(`
    SELECT us.id, us.status, us.price_paid, us.starts_at, us.expires_at, us.created_at,
           p.name as package_name, p.slots, p.max_quantity_per_item
    FROM user_subscriptions us
    JOIN packages p ON us.package_id = p.id
    WHERE us.user_id = $1
    ORDER BY us.created_at DESC
  `, [req.user.id]);

  const subscriptions = result.rows.map(sub => ({
    id: sub.id,
    status: sub.status,
    packageName: sub.package_name,
    displayName: sub.package_name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    slots: sub.slots,
    maxQuantityPerItem: sub.max_quantity_per_item,
    pricePaid: sub.price_paid,
    startsAt: sub.starts_at,
    expiresAt: sub.expires_at,
    createdAt: sub.created_at
  }));

  res.json({
    subscriptions
  });
}));

module.exports = router;