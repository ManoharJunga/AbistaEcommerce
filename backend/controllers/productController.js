const Product = require('../models/productModel');
const SubCategory = require('../models/subCategoryModel');
const mongoose = require('mongoose');
const upload = require('../config/multer'); // Import Cloudinary multer config

// Middleware for handling image uploads
exports.uploadProductImages = upload.uploadProductImage.array('images', 5); // Max 5 images for a product

// Add new product
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, subCategory, sizes, attributes, variants } = req.body;
    
    if (!name || !description || !price || !stock || !category || !subCategory) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const images = req.files?.map(file => file.path) || [];

    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      subCategory,
      sizes: JSON.parse(sizes || '[]'),
      attributes: JSON.parse(attributes || '{}'),
      variants: JSON.parse(variants || '[]'),
      images
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all products with pagination, search, and filtering
exports.getProducts = async (req, res) => {
  try {
    const { search, category, subCategory, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }

    const products = await Product.find(filter)
      .populate('category subCategory')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.status(200).json({ total, page, limit, products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const product = await Product.findById(productId).populate('category subCategory');

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    let updateData = { ...req.body };

    if (req.files?.length) {
      updateData.images = req.files.map(file => file.path);
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Featured Products (Random 10)
exports.getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.aggregate([{ $sample: { size: 10 } }]);
    res.status(200).json(featuredProducts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Best-Selling Products (Based on totalReviews)
exports.getBestSellingProducts = async (req, res) => {
  try {
    const bestSellingProducts = await Product.find().sort({ totalReviews: -1 }).limit(10);
    res.status(200).json(bestSellingProducts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



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
