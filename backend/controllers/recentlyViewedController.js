const RecentlyViewed = require('../models/recentlyViewedModel');

// Add recently viewed item
exports.addRecentlyViewed = async (req, res) => {
  try {
    const { customerId, productId } = req.body;

    // Create a new RecentlyViewed entry with the customerId
    const recentlyViewed = new RecentlyViewed({ customerId, productId });
    await recentlyViewed.save();
    res.status(201).json(recentlyViewed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all recently viewed items for a specific customer
exports.getRecentlyViewed = async (req, res) => {
  try {
    const { customerId } = req.params; // Get customerId from request parameters

    // Find recently viewed items for the specific customer and populate product details
    const recentlyViewedItems = await RecentlyViewed.find({ customerId })
      .populate('productId');  // Populate the product details

    res.status(200).json(recentlyViewedItems);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
