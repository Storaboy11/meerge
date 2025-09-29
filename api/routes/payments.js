const express = require('express');
const axios = require('axios');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// @route   POST /api/payments/initialize
// @desc    Initialize payment with Paystack
// @access  Private
router.post('/initialize', authenticateToken, asyncHandler(async (req, res) => {
  const { amount, orderId, subscriptionPackageId } = req.body;

  const response = await axios.post(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    email: req.user.email,
    amount: amount * 100, // Convert to kobo
    currency: 'NGN',
    reference: `qm_${Date.now()}_${req.user.id}`,
    callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
    metadata: {
      userId: req.user.id,
      orderId,
      subscriptionPackageId,
      userEmail: req.user.email
    }
  }, {
    headers: {
      'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  res.json({
    authorizationUrl: response.data.data.authorization_url,
    accessCode: response.data.data.access_code,
    reference: response.data.data.reference
  });
}));

// @route   POST /api/payments/verify
// @desc    Verify payment with Paystack
// @access  Private
router.post('/verify', authenticateToken, asyncHandler(async (req, res) => {
  const { reference } = req.body;

  const response = await axios.get(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
    headers: {
      'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
    }
  });

  const paymentData = response.data.data;

  if (paymentData.status === 'success') {
    // Update order or subscription payment status
    if (paymentData.metadata.orderId) {
      await query(
        'UPDATE orders SET payment_status = $1, payment_reference = $2 WHERE id = $3',
        ['paid', reference, paymentData.metadata.orderId]
      );
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      paymentData: {
        amount: paymentData.amount / 100,
        currency: paymentData.currency,
        reference: paymentData.reference,
        status: paymentData.status
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
}));

module.exports = router;