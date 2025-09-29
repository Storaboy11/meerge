const express = require('express');
const { query, transaction } = require('../config/database');
const { authenticateToken, requireEmailVerification, requireLocationSelection, validateOrderWindow } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', 
  authenticateToken, 
  requireEmailVerification, 
  requireLocationSelection,
  validateOrderWindow,
  asyncHandler(async (req, res) => {
    const { items, deliveryAddress, deliveryNotes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order items required' });
    }

    // Get user's active subscription
    const subResult = await query(`
      SELECT us.id, us.slots_used, p.slots, p.max_quantity_per_item
      FROM user_subscriptions us
      JOIN packages p ON us.package_id = p.id
      WHERE us.user_id = $1 AND us.status = 'active' AND us.expires_at > CURRENT_TIMESTAMP
    `, [req.user.id]);

    if (subResult.rows.length === 0) {
      return res.status(403).json({ error: 'Active subscription required' });
    }

    const subscription = subResult.rows[0];

    // Check slot availability
    if (subscription.slots && subscription.slots_used >= subscription.slots) {
      return res.status(403).json({ error: 'No delivery slots remaining in your subscription' });
    }

    // Create order in transaction
    const result = await transaction(async (client) => {
      let totalAmount = 0;
      let totalDeliveryFee = 0;

      // Create order
      const orderResult = await client.query(`
        INSERT INTO orders (user_id, subscription_id, delivery_address, delivery_notes, status)
        VALUES ($1, $2, $3, $4, 'pending')
        RETURNING id
      `, [req.user.id, subscription.id, deliveryAddress, deliveryNotes]);

      const orderId = orderResult.rows[0].id;

      // Add order items
      for (const item of items) {
        const productResult = await client.query(
          'SELECT base_price, delivery_fee FROM products WHERE id = $1 AND active = true',
          [item.productId]
        );

        if (productResult.rows.length === 0) {
          throw new Error(`Product ${item.productId} not found`);
        }

        const product = productResult.rows[0];
        const subtotal = product.base_price * item.quantity;
        totalAmount += subtotal;
        totalDeliveryFee += product.delivery_fee;

        await client.query(`
          INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
          VALUES ($1, $2, $3, $4, $5)
        `, [orderId, item.productId, item.quantity, product.base_price, subtotal]);
      }

      // Update order totals
      await client.query(
        'UPDATE orders SET total_amount = $1, delivery_fee = $2 WHERE id = $3',
        [totalAmount, totalDeliveryFee, orderId]
      );

      // Update subscription slots used
      await client.query(
        'UPDATE user_subscriptions SET slots_used = slots_used + 1 WHERE id = $1',
        [subscription.id]
      );

      return { id: orderId, totalAmount, totalDeliveryFee };
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: result
    });
  })
);

// @route   GET /api/orders
// @desc    Get user orders
// @access  Private
router.get('/', authenticateToken, requireEmailVerification, asyncHandler(async (req, res) => {
  const result = await query(`
    SELECT o.id, o.total_amount, o.delivery_fee, o.status, o.delivery_date, o.created_at,
           COUNT(oi.id) as item_count
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT 20
  `, [req.user.id]);

  res.json({ orders: result.rows });
}));

module.exports = router;