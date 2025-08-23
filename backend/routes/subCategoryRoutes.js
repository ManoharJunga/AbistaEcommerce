const express = require("express");
const router = express.Router();
const subCategoryController = require("../controllers/subCategoryController");

// Add new subcategory with image upload
router.post(
  "/",
  subCategoryController.uploadSubCategoryImage,
  subCategoryController.addSubCategory
);

// Get all subcategories
router.get("/", subCategoryController.getSubCategories);

// Get subcategories by categoryId (specific route should come before "/:id")
router.get("/category/:categoryId", subCategoryController.getSubCategoriesByCategory);

// Get / Delete subcategory by ID
router.route("/:id")
  .get(subCategoryController.getSubCategoryById)
  .delete(subCategoryController.deleteSubCategory);

// Get / Update / Delete subcategory by ID
router.route("/:id")
  .get(subCategoryController.getSubCategoryById)
  .put(
    subCategoryController.uploadSubCategoryImage,
    subCategoryController.updateSubCategory
  )
  .delete(subCategoryController.deleteSubCategory);


module.exports = router;
