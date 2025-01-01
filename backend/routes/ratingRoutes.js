const express = require('express');
const router = express.Router();

// Controllers for rating-related actions
const { addRating, getRatings } = require('../controllers/ratingController');

// Define rating-related routes
router.post('/', addRating);  // Add a new rating
router.get('/:productId', getRatings);  // Get ratings for a specific product

module.exports = router;
