const express = require("express");
const {
  createFAQ,
  getFAQs,
  updateFAQ,
  deleteFAQ,
} = require("../controllers/faqController");

const router = express.Router();

router.post("/", createFAQ);      // Add new FAQ
router.get("/", getFAQs);         // Get all FAQs
router.put("/:id", updateFAQ);    // Update FAQ by ID
router.delete("/:id", deleteFAQ); // Delete FAQ by ID

module.exports = router;
