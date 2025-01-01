const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

// Create an address
router.post('/', addressController.createAddress);

// Get all addresses
router.get('/', addressController.getAddresses);

// Update an address
router.put('/:id', addressController.updateAddress);

// Delete an address
router.delete('/:id', addressController.deleteAddress);

module.exports = router;
