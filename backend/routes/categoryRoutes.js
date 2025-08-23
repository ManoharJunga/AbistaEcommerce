const express = require('express');
const router = express.Router();
const {
  addCategory,
  getCategories,
  getCategoryById,
  deleteCategory,
  uploadCategoryImage, 
  updateCategory
} = require('../controllers/categoryController');

// Routes for categories
router.put("/:id", updateCategory);
router.post('/', uploadCategoryImage, addCategory); // Add new category
router.get('/', getCategories); // Get all categories
router.get('/:id', getCategoryById); // Get single category by ID
router.delete('/:id', deleteCategory); // Delete category by ID

module.exports = router;
