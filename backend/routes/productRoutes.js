const express = require('express');
const router = express.Router();

// Controllers for product-related actions
const { 
  addProduct, 
  getProducts, 
  uploadProductImages, 
  getProductsBySubcategory, 
  updateProduct, 
  deleteProduct,
  getProductById
} = require('../controllers/productController');  

// ✅ Add a new product with images
router.post('/upload', uploadProductImages, addProduct);  

// ✅ Get all products
router.get('/get', getProducts);  

// ✅ Get products by subcategory slug (changed from query-based to param)
router.get('/subcategory/:slug', getProductsBySubcategory);  

// ✅ Get a single product by ID
router.get('/:id', getProductById);  

// ✅ Update product by ID (will also check slug in controller if provided)
router.put('/:id', uploadProductImages, updateProduct);  

// ✅ Delete product by ID
router.delete('/:id', deleteProduct);  

module.exports = router;
