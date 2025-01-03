// routes/subCategoryRoutes.js
const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');

// Create a SubCategory
router.post('/', subCategoryController.createSubCategory);

// Get all SubCategories
router.get('/', subCategoryController.getSubCategories);

// Get a single SubCategory by ID
router.get('/:id', subCategoryController.getSubCategoryById);

// Update a SubCategory
router.put('/:id', subCategoryController.updateSubCategory);

// Delete a SubCategory
router.delete('/:id', subCategoryController.deleteSubCategory);

module.exports = router;
