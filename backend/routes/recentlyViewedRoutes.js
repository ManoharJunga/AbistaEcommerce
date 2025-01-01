const express = require('express');
const router = express.Router();

// Controllers for recently viewed actions
const { addRecentlyViewed, getRecentlyViewed } = require('../controllers/recentlyViewedController');

// Define recently viewed routes
router.post('/', addRecentlyViewed); // Add a recently viewed item
router.get('/:customerId', getRecentlyViewed); // Get recently viewed items for a specific customer

module.exports = router;
