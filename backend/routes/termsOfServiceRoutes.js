const express = require("express");
const router = express.Router();

const {
  createTerms,
  getAllTerms,
  getTermsById,
  updateTerms,
  deleteTerms,
} = require("../controllers/termsOfServiceController");

// CRUD Endpoints
router.post("/", createTerms);
router.get("/", getAllTerms);
router.get("/:id", getTermsById);
router.put("/:id", updateTerms);
router.delete("/:id", deleteTerms);

module.exports = router;
