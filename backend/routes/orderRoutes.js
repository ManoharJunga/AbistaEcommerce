const express = require('express');
const router = express.Router();

// Controllers for order-related actions
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');

// Define order-related routes
router.post('/', createOrder); // Create a new order
router.get('/', getOrders); // Get all orders
router.put('/:id', updateOrderStatus); // Update order status

module.exports = router;
