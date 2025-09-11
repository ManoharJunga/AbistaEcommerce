const jwt = require("jsonwebtoken");
const Customer = require("../models/customerModel");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc Signup new customer
// @route POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const customer = await Customer.create({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    const token = generateToken(customer._id);

    res.status(201).json({
      _id: customer._id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Login customer
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await customer.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(customer._id);

    res.json({
      _id: customer._id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Get profile of logged in customer
// @route GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).select("-password");
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { signup, login, getProfile };
