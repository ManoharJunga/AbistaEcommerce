const Customer = require('../models/customerModel');
const moment = require('moment');

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


// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate('addresses')
      .populate('orderHistory')
      .populate('wishlist')
      .populate('paymentMethods')
      .populate('notifications')
      .populate('recentlyViewedItems');
    res.status(200).json(customers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.getTotalCustomers = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    res.status(200).json({ totalCustomers });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get new customers for the last day, week, and month
exports.getNewCustomers = async (req, res) => {
  try {
    const today = moment().startOf('day');
    const thisWeek = moment().startOf('week');
    const thisMonth = moment().startOf('month');

    const daily = await Customer.countDocuments({ createdAt: { $gte: today } });
    const weekly = await Customer.countDocuments({ createdAt: { $gte: thisWeek } });
    const monthly = await Customer.countDocuments({ createdAt: { $gte: thisMonth } });

    res.status(200).json({ daily, weekly, monthly });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Get top customer demographics (example: based on location/city)
exports.getTopDemographics = async (req, res) => {
  try {
    const customers = await Customer.aggregate([
      { $unwind: "$addresses" }, // Assuming the "addresses" field is an array
      { $group: { _id: "$addresses.city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },  // Sort by count of customers in descending order
      { $limit: 5 }  // Limit to top 5 cities
    ]);

    res.status(200).json({ topCities: customers });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
