const express = require('express');
const router = express.Router();
const costController = require('../controllers/doorCalculations');

// Calculate Cost API
router.post('/calculate-cost', costController.calculateCost);

module.exports = router;
