const Wishlist = require('../models/wishlistModel');

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const wishlistItem = new Wishlist(req.body);
    await wishlistItem.save();
    res.status(201).json(wishlistItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all wishlist items for a customer
exports.getWishlist = async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find().populate('productId');
    res.status(200).json(wishlistItems);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
