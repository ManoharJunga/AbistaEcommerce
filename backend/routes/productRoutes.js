const express = require('express');
const router = express.Router();

// Controllers for product-related actions
const { addProduct, getProducts, uploadProductImages, getProductsBySubcategory  } = require('../controllers/productController');  // Import both functions

// Define product-related routes
router.post('/upload', uploadProductImages, addProduct);  // Add a new product with images
router.get('/get', getProducts);  // Get all products
router.get('/getBySubcategory', getProductsBySubcategory);


module.exports = router;
