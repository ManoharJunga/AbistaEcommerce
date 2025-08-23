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
router.put("/:id", uploadCategoryImage, updateCategory); // 👈 Add multer here
router.post("/", uploadCategoryImage, addCategory); 
router.get("/", getCategories); 
router.get("/:id", getCategoryById); 
router.delete("/:id", deleteCategory); 


module.exports = router;
