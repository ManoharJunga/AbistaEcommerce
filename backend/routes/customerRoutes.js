const express = require('express');
const router = express.Router();

// Controllers for customer-related actions
const { createCustomer, getCustomer, updateCustomer } = require('../controllers/customerController');

// Define customer-related routes
router.post('/', createCustomer); // Create a new customer
router.get('/:id', getCustomer); // Get customer details
router.put('/:id', updateCustomer); // Update customer details

module.exports = router;
