const express = require('express');
const router = express.Router();
const featureSubCategoryController = require('../controllers/featureSubCategoryController');
const { uploadSubFeatureIcon } = require('../config/multer');

// ✅ Create new FeatureSubCategory
router.post(
  '/',
  uploadSubFeatureIcon.array('icons', 10), // multiple icons
  featureSubCategoryController.createFeatureSubCategory
);

// ✅ Get all FeatureSubCategories
router.get('/', featureSubCategoryController.getAllFeatureSubCategories);

// ✅ Get FeatureSubCategory by ID
router.get('/:id', featureSubCategoryController.getFeatureSubCategoryById);

// ✅ Update FeatureSubCategory
router.put(
  '/:id',
  uploadSubFeatureIcon.array('icons', 10),
  featureSubCategoryController.updateFeatureSubCategory
);

// ✅ Delete FeatureSubCategory
router.delete('/:id', featureSubCategoryController.deleteFeatureSubCategory);

module.exports = router;
