const TermsOfService = require("../models/termsOfServiceModel");

// CREATE
const createTerms = async (req, res) => {
  try {
    const terms = new TermsOfService(req.body);
    const saved = await terms.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// READ all
const getAllTerms = async (req, res) => {
  try {
    const terms = await TermsOfService.find();
    res.json(terms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ one
const getTermsById = async (req, res) => {
  try {
    const terms = await TermsOfService.findById(req.params.id);
    if (!terms) return res.status(404).json({ message: "Not found" });
    res.json(terms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
const updateTerms = async (req, res) => {
  try {
    const updated = await TermsOfService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
const deleteTerms = async (req, res) => {
  try {
    const deleted = await TermsOfService.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Terms deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createTerms,
  getAllTerms,
  getTermsById,
  updateTerms,
  deleteTerms,
};
