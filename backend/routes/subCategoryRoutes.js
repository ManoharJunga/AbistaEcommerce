const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');

// Upload images middleware
router.post(
  '/',
  subCategoryController.uploadSubCategoryImages, // Image upload middleware
  subCategoryController.addSubCategory // Add subcategory controller
);

// Get all subcategories
router.get('/', subCategoryController.getSubCategories);

// Get subcategories by category
router.get('/category/:categoryId', subCategoryController.getSubCategoriesByCategory);

// Get and delete subcategory by ID
router
  .route('/:id')
  .get(subCategoryController.getSubCategoryById)
  .delete(subCategoryController.deleteSubCategory);

module.exports = router;
