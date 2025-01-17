// routes/interactions.js
const express = require('express');
const {
  saveInteraction,
  getCustomerInteractions,
  getAllInteractions,
  deleteInteraction,
} = require('../controllers/interactionController');

const router = express.Router();

// Save Interaction
router.post('/save', saveInteraction);

// Get Interactions for a Customer
router.get('/customer/:userId', getCustomerInteractions);

// Get All Interactions (Admin)
router.get('/all', getAllInteractions);

// Delete Interaction
router.delete('/:id', deleteInteraction);

module.exports = router;
