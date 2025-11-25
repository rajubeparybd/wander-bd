const express = require('express');
const router = express.Router();
const {
    createPaymentIntent,
    savePayment
} = require('../controllers/payment.controller');

router.post('/create-payment-intent', createPaymentIntent);
router.post('/', savePayment);

module.exports = router;
