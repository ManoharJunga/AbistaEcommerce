// routes/privacyPolicyRoutes.js
const express = require("express");
const router = express.Router();
const {
  createPrivacyPolicy,
  getPrivacyPolicy,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
} = require("../controllers/privacyPolicyController");

// POST -> Create
router.post("/", createPrivacyPolicy);

// GET -> Fetch latest
router.get("/", getPrivacyPolicy);

// PUT -> Update
router.put("/:id", updatePrivacyPolicy);

// DELETE -> Remove
router.delete("/:id", deletePrivacyPolicy);

module.exports = router;
