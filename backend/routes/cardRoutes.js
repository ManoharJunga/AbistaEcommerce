const express = require('express');
const cardController = require('../controllers/cardController');

const router = express.Router();

// Routes
router.post('/', cardController.uploadCardImage, cardController.addCard); // Add a card
router.get('/', cardController.getCards); // Get all cards
router.get('/:id', cardController.getCardById); // Get a single card by ID
router.put('/:id', cardController.uploadCardImage, cardController.updateCard); // Update a card
router.delete('/:id', cardController.deleteCard); // Delete a card

module.exports = router;
