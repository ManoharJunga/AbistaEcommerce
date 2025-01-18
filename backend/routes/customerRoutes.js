const express = require('express');
const router = express.Router();

// Controllers for customer-related actions
const { 
  createCustomer, 
  getCustomer, 
  updateCustomer, 
  getAllCustomers,
  getTotalCustomers,
  getNewCustomers,
  getTopDemographics
} = require('../controllers/customerController');

// Define customer-related routes
router.post('/', createCustomer); // Create a new customer
router.get('/:id', getCustomer); // Get customer details
router.put('/:id', updateCustomer); // Update customer details
router.get('/', getAllCustomers); // Get all customers

// New routes for Customer Insights
router.get('/insights/total', getTotalCustomers);  // Get total customers
router.get('/insights/new', getNewCustomers); // Get new customers (daily, weekly, monthly)
router.get('/insights/top-demographics', getTopDemographics); // Get top demographics (city)

module.exports = router;
