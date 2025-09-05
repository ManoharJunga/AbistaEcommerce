const express = require("express");
const router = express.Router();
const dealProductController = require("../controllers/dealProductController");

// Create new deal
router.post("/", dealProductController.createDeal);

// Get all deals
router.get("/", dealProductController.getDeals);

// Get active deals only
router.get("/active", dealProductController.getActiveDeals);

// Get deal by ID
router.get("/:id", dealProductController.getDealById);

// Update deal
router.put("/:id", dealProductController.updateDeal);

// Delete deal
router.delete("/:id", dealProductController.deleteDeal);

module.exports = router;
