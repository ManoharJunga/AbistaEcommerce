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

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded!' });
    }

    const imageUrls = req.files.map((file) => file.path || null).filter(Boolean);

    if (imageUrls.length === 0) {
      return res.status(400).json({ message: 'Image upload failed!' });
    }

    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ message: 'Product name and price are required!' });
    }

    if (!req.body.subCategory) {
      return res.status(400).json({ message: 'Subcategory ID is required!' });
    }

    const subCategoryExists = await SubCategory.findById(req.body.subCategory);
    if (!subCategoryExists) {
      return res.status(400).json({ message: 'Subcategory ID is not valid!' });
    }

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      subCategory: req.body.subCategory,
      images: imageUrls,
    });

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
    const { subcategory, page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      return res.status(400).json({ message: 'Invalid page or limit values' });
    }

    let filter = {};

    if (subcategory) {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(subcategory);
      if (!isValidObjectId) {
        return res.status(400).json({ message: 'Invalid subcategory ID format' });
      }
      filter.subCategory = subcategory;
    }

    const products = await Product.find(filter)
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await Product.countDocuments(filter);

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
exports.getProductsBySubcategory = async (req, res) => {
  try {
    const { subcategory } = req.query;

    if (!subcategory) {
      return res.status(400).json({ message: 'Subcategory ID is required!' });
    }

    const products = await Product.find({ subCategory: subcategory })
      .populate('category', 'name')
      .populate('subCategory', 'name');

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this subcategory' });
    }

    res.status(200).json({ products });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found!' });
    }
    res.status(200).json({ message: 'Product updated successfully!', updatedProduct });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found!' });
    }
    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
