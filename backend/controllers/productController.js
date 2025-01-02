const Product = require('../models/productModel');
const upload = require('../config/multer'); // Cloudinary multer config

// Middleware for uploading images
exports.uploadProductImages = upload.array('images', 5);

// Add New Product
exports.addProduct = async (req, res) => {
  try {
    // Log incoming request to debug
    console.log('Request Body:', req.body);
    console.log('Files:', req.files);

    // Validate if files exist
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded!' });
    }

    // Create a new product with image URLs
    const imageUrls = req.files.map((file) => file.path);

    const product = new Product({
      ...req.body,
      images: imageUrls,
    });

    // Save product
    await product.save();
    res.status(201).json(product); // Send the created product in the response
  } catch (err) {
    console.error(err); // Log any error
    res.status(400).json({ message: err.message }); // Send error message
  }
};


// Fetch All Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
