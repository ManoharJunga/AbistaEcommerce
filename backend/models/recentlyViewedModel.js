const mongoose = require('mongoose');

const RecentlyViewedSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true }, // New field to store the customer ID
  viewedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RecentlyViewed', RecentlyViewedSchema);
