const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
  }],
  orderStatus: { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], required: true },
  orderDate: { type: Date, default: Date.now },
  totalAmount: { type: Number, required: true },
  trackingId: { type: String }, // For real-time order tracking
});

module.exports = mongoose.model('Order', OrderSchema);
