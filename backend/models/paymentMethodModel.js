const mongoose = require('mongoose');

const PaymentMethodSchema = new mongoose.Schema({
  cardNumber: { type: String, required: true },
  expiryDate: { type: String, required: true },
  cardHolderName: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);
