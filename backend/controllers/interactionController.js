// controllers/interactionController.js
const Interaction = require('../models/interactionModel');
const Customer = require('../models/customerModel');

// Save Interaction
exports.saveInteraction = async (req, res) => {
  const { userId, page, timeSpent, clicks, searchQuery } = req.body;

  try {
    // Verify user exists
    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Save interaction
    const interaction = new Interaction({ userId, page, timeSpent, clicks, searchQuery });
    await interaction.save();

    res.status(201).json({ success: true, message: 'Interaction saved', interaction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Interactions for a Customer
exports.getCustomerInteractions = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find interactions by userId
    const interactions = await Interaction.find({ userId }).sort({ timestamp: -1 });
    res.status(200).json({ success: true, interactions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get All Interactions (For Admin Analytics)
exports.getAllInteractions = async (req, res) => {
  try {
    const interactions = await Interaction.find().populate('userId', 'fullName email').sort({ timestamp: -1 });
    res.status(200).json({ success: true, interactions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete Interaction
exports.deleteInteraction = async (req, res) => {
  const { id } = req.params;

  try {
    const interaction = await Interaction.findByIdAndDelete(id);
    if (!interaction) {
      return res.status(404).json({ success: false, message: 'Interaction not found' });
    }

    res.status(200).json({ success: true, message: 'Interaction deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


