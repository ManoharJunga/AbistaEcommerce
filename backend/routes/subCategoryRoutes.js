const express = require("express");
const router = express.Router();
const subCategoryController = require("../controllers/subCategoryController");

// Routes for subcategory operations
router.post(
  "/",
  subCategoryController.uploadSubCategoryImage, // Middleware for image upload
  subCategoryController.addSubCategory // Controller to handle adding subcategory
);

router.route("/:id")
  .get(subCategoryController.getSubCategoryById)  // Get subcategory by ID
  .delete(subCategoryController.deleteSubCategory); // Delete subcategory by ID

router.get("/", subCategoryController.getSubCategories); // Get all subcategories
router.get("/category/:categoryId", subCategoryController.getSubCategoriesByCategory); // Get subcategories by category

module.exports = router;
