const express = require('express');
const router = express.Router();
const {
    createCheckoutSession,
    verifyPaymentSession
} = require('../controllers/payment.controller');

// Create checkout session
router.post('/create-checkout-session', createCheckoutSession);

// Verify payment session
router.get('/verify-session/:sessionId', verifyPaymentSession);

// Note: Webhook endpoint is handled in app.js before JSON middleware

module.exports = router;
