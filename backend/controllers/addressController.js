const Address = require('../models/addressModel');

// Create a new address
exports.createAddress = async (req, res) => {
  try {
    const address = new Address(req.body);
    await address.save();
    res.status(201).json(address);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all addresses for a customer
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.status(200).json(addresses);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update an address
exports.updateAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(address);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'Address deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
