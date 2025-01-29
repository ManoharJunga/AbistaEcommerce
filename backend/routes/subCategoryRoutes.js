const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');
const { uploadSubCategoryImage } = require('../config/multer'); // Middleware for image upload
const { check, validationResult } = require('express-validator');

// Create SubCategory with image upload
router.post(
  '/',
  uploadSubCategoryImage.single('image'),
  [
    check('name').notEmpty().withMessage('Name is required'),
    check('category').notEmpty().withMessage('Category is required')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  subCategoryController.createSubCategory
);

// Get all SubCategories
router.get('/', subCategoryController.getSubCategories);

// Get a single SubCategory by ID
router.get('/:id', subCategoryController.getSubCategoryById);

// Get SubCategories by Category
router.get('/category/:categoryId', subCategoryController.getSubCategoriesByCategory);

// Update a SubCategory with image upload
router.put(
  '/:id',
  uploadSubCategoryImage.single('image'),
  subCategoryController.updateSubCategory
);

// Delete a SubCategory
router.delete('/:id', subCategoryController.deleteSubCategory);

module.exports = router;
