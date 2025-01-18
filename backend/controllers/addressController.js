const Address = require('../models/addressModel');
const Customer = require('../models/customerModel');

// Create a new address and link it to the customer
exports.createAddress = async (req, res) => {
  try {
    const { customerId, ...addressData } = req.body;

    // Validate if the customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Create and save the new address
    const address = new Address({ customerId, ...addressData });
    await address.save();

    // Add the address to the customer's addresses array
    customer.addresses.push(address._id);
    await customer.save();

    res.status(201).json(address);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all addresses for a customer
exports.getAddresses = async (req, res) => {
  try {
    const { customerId } = req.params;

    // Validate if the customer exists
    const customer = await Customer.findById(customerId).populate('addresses');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer.addresses);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update an address
exports.updateAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json(address);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete an address and remove it from the customer's addresses array
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Remove the address from the customer's addresses array
    await Customer.findByIdAndUpdate(address.customerId, {
      $pull: { addresses: address._id },
    });

    // Delete the address
    await address.remove();

    res.status(204).json({ message: 'Address deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
