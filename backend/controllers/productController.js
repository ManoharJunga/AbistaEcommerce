const Product = require('../models/productModel');
const upload = require('../config/multer'); // Cloudinary multer config
const mongoose = require('mongoose');
const SubCategory = require('../models/subCategoryModel'); 
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

    // Map the uploaded files to get their Cloudinary URLs (or use local file path if you're not using Cloudinary)
    const imageUrls = req.files.map((file) => file.path || null).filter(Boolean);

    // If no valid image URLs are found, return an error
    if (imageUrls.length === 0) {
      return res.status(400).json({ message: 'Image upload failed!' });
    }

    // Validate required fields
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ message: 'Product name and price are required!' });
    }

    // Validate that subcategory is provided
    if (!req.body.subCategory) {
      return res.status(400).json({ message: 'Subcategory ID is required!' });
    }

    // Check if the subcategory exists in the database
    const subCategoryExists = await SubCategory.findById(req.body.subCategory);
    if (!subCategoryExists) {
      return res.status(400).json({ message: 'Subcategory ID is not valid!' });
    }

    // Create a new Product with the provided data, uploaded images, and subcategory
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      subCategory: req.body.subCategory, // Ensure subCategory is stored correctly
      images: imageUrls, // Assuming you're storing URLs of uploaded images
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
    // Destructure query parameters
    const { subcategory, page = 1, limit = 10 } = req.query;

    // Validate page and limit are valid numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      return res.status(400).json({ message: 'Invalid page or limit values' });
    }

    let filter = {};

    // Validate subcategory ObjectId format
    if (subcategory) {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(subcategory);
      if (!isValidObjectId) {
        return res.status(400).json({ message: 'Invalid subcategory ID format' });
      }
      filter.subCategory = subcategory; // Add subcategory filter if valid
    }

    // Fetch products with filter, pagination, and population
    const products = await Product.find(filter)
      .populate('category', 'name') // Populate category name
      .populate('subCategory', 'name') // Populate subcategory name
      .skip((pageNumber - 1) * limitNumber) // Skip based on page
      .limit(limitNumber); // Limit results per page

    // Get total count of products for pagination
    const total = await Product.countDocuments(filter);

    // Send response with products, pagination info
    res.status(200).json({
      products,
      total,
      page: pageNumber,
      limit: limitNumber,
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(400).json({ message: err.message });
  }
};

// Fetch Products by Subcategory
// Fetch Products by Subcategory
exports.getProductsBySubcategory = async (req, res) => {
  try {
    const { subcategory } = req.query;

    // Validate if subcategory ID is provided
    if (!subcategory) {
      return res.status(400).json({ message: 'Subcategory ID is required!' });
    }

    // Fetch products by subcategory ID
    const products = await Product.find({ subCategory: subcategory })
      .populate('category', 'name') // Populate category name
      .populate('subCategory', 'name') // Populate subcategory name

    // If no products are found
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this subcategory' });
    }

    res.status(200).json({ products });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

