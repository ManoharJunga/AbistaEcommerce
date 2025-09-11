const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true, // e.g., "Orders & Shipping"
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const FAQ = mongoose.model("FAQ", faqSchema);

module.exports = FAQ;
