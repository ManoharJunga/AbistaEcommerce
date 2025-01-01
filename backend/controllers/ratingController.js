const Rating = require('../models/ratingModel');

// Add new rating
exports.addRating = async (req, res) => {
  try {
    const rating = new Rating(req.body);
    await rating.save();
    res.status(201).json(rating);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get ratings for a product
exports.getRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ product: req.params.productId });
    res.status(200).json(ratings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
