const FAQ = require("../models/faqModel");

// @desc Create FAQ
// @route POST /api/faqs
const createFAQ = async (req, res) => {
  try {
    const { category, question, answer } = req.body;

    const faq = new FAQ({ category, question, answer });
    await faq.save();

    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Get all FAQs
// @route GET /api/faqs
const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ category: 1, createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update FAQ
// @route PUT /api/faqs/:id
const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFAQ = await FAQ.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedFAQ) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.json(updatedFAQ);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Delete FAQ
// @route DELETE /api/faqs/:id
const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFAQ = await FAQ.findByIdAndDelete(id);

    if (!deletedFAQ) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFAQ,
  getFAQs,
  updateFAQ,
  deleteFAQ,
};
