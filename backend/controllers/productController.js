const Product = require('../models/productModel');
const upload = require('../config/multer'); // Cloudinary multer config

// Middleware for uploading images
exports.uploadProductImages = upload.uploadProductImage.array('images', 5); // Middleware for handling file upload

// Add New Product
exports.addProduct = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('Files:', req.files);

    // Validate if images are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded!' });
    }

    // Map the uploaded files to get their Cloudinary URLs
    const imageUrls = req.files.map((file) => file.path || null).filter(Boolean);

    // If no valid image URLs are found, return an error
    if (imageUrls.length === 0) {
      return res.status(400).json({ message: 'Image upload failed!' });
    }

    // Validate required fields
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ message: 'Product name and price are required!' });
    }

    // Create a new Product with the provided data and uploaded images
    const product = new Product({
      ...req.body,
      images: imageUrls,
    });

    // Save the product to the database
    await product.save();
    
    res.status(201).json({
      message: 'Product added successfully!',
      product,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Fetch All Products with Optional Pagination
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Product.countDocuments();
    res.status(200).json({ products, total, page, limit });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
