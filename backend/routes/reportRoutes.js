// routes/reports.js
const express = require('express');
const { getDashboardReport } = require('../controllers/reportController');

const router = express.Router();

// Get Dashboard Report
router.get('/dashboard', getDashboardReport);

module.exports = router;
