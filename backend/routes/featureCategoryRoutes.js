const express = require('express');
const router = express.Router();
const featureCategoryController = require('../controllers/featureCategoryController');
const { uploadFeatureIcon } = require('../config/multer');

// ✅ Create new FeatureCategory (multiple features with icons)
router.post(
  '/',
  uploadFeatureIcon.array('icons', 10), // Allow multiple icons
  featureCategoryController.createFeatureCategory
);

// ✅ Get all FeatureCategories
router.get('/', featureCategoryController.getAllFeatureCategories);

// ✅ Get FeatureCategory by ID
router.get('/:id', featureCategoryController.getFeatureCategoryById);

// ✅ Update FeatureCategory (replace icons if uploaded)
router.put(
  '/:id',
  uploadFeatureIcon.array('icons', 10),
  featureCategoryController.updateFeatureCategory
);

// ✅ Delete FeatureCategory
router.delete('/:id', featureCategoryController.deleteFeatureCategory);

module.exports = router;
