const Product = require('../models/productModel');
const upload = require('../config/multer'); // Cloudinary multer config

// Middleware for uploading images
exports.uploadProductImages = upload.array('images', 5);

// Add New Product
exports.addProduct = async (req, res) => {
  try {
    // Validate if files exist
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded!' });
    }

    // Collect Cloudinary image URLs
    const imageUrls = req.files.map((file) => file.path);

    // Create a new product
    const product = new Product({
      ...req.body,
      images: imageUrls,
    });

    await product.save();
    res.status(201).json(product); // Respond with the created product
  } catch (err) {
    res.status(400).json({ message: err.message });
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
