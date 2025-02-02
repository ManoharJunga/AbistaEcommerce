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
// Define product-related routes
router.post('/upload', uploadProductImages, addProduct);  // Add a new product with images
router.get('/get', getProducts);  // Get all products
router.get('/getBySubcategory', getProductsBySubcategory);
router.put('/:id', updateProduct); // Update a product by ID
router.delete('/:id', deleteProduct); // Delete a product by ID
router.get('/:id', getProductById); // Get a single product by ID


module.exports = router;
