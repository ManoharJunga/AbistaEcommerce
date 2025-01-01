const express = require('express');
const router = express.Router();

// Controllers for payment-related actions
const { addPaymentMethod, getPaymentMethods, deletePaymentMethod } = require('../controllers/paymentController');

// Define payment method-related routes
router.post('/', addPaymentMethod); // Add new payment method
router.get('/', getPaymentMethods); // Get all payment methods
router.delete('/:id', deletePaymentMethod); // Delete a payment method

module.exports = router;
