const PaymentMethod = require('../models/paymentMethodModel');

// Add new payment method
exports.addPaymentMethod = async (req, res) => {
  try {
    const paymentMethod = new PaymentMethod(req.body);
    await paymentMethod.save();
    res.status(201).json(paymentMethod);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all payment methods for a customer
exports.getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find();
    res.status(200).json(paymentMethods);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a payment method
exports.deletePaymentMethod = async (req, res) => {
  try {
    await PaymentMethod.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'Payment method deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
