const express = require('express');
const router = express.Router();

// Controllers for wishlist-related actions
const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/wishlistController');

// Define wishlist-related routes
router.post('/', addToWishlist); // Add product to wishlist
router.get('/', getWishlist); // Get all wishlist items
router.delete('/:id', removeFromWishlist); // Remove product from wishlist

module.exports = router;
