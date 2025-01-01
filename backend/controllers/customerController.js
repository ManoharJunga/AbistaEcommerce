const Customer = require('../models/customerModel');

// Create new customer
exports.createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get customer details
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('addresses')
      .populate('orderHistory')
      .populate('wishlist')
      .populate('paymentMethods')
      .populate('notifications')
      .populate('recentlyViewedItems');
    res.status(200).json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update customer details
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
