const mongoose = require('mongoose');
const SubCategory = require('../models/subCategoryModel');
const upload = require('../config/multer'); // Ensure multer is properly set up

// Middleware to upload images (Main image + Room Type Image)
exports.uploadSubCategoryImages = upload.uploadSubCategoryImage.fields([
  { name: 'image', maxCount: 1 },
  { name: 'roomTypeImage', maxCount: 1 },
]);

// ✅ Add a New SubCategory
exports.addSubCategory = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'Main image is required!' });
    }

    const subCategoryData = {
      name: req.body.name,
      category: req.body.category,
      image: req.files.image[0].path, // Main image path
      roomType: req.body.roomType === 'true', // Convert string to boolean
      roomTypeImage: req.files.roomTypeImage ? req.files.roomTypeImage[0].path : null, // Optional roomTypeImage
    };

    const subCategory = new SubCategory(subCategoryData);
    await subCategory.save();

    res.status(201).json({
      message: 'SubCategory added successfully!',
      subCategory,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// ✅ Get All SubCategories
exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate('category', 'name');
    res.status(200).json(subCategories);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// ✅ Get SubCategory by ID
exports.getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate('category', 'name');
    if (!subCategory) {
      return res.status(404).json({ message: 'SubCategory not found!' });
    }
    res.status(200).json(subCategory);
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID', error: err.message });
  }
};

// ✅ Delete a SubCategory by ID
exports.deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ message: 'SubCategory not found!' });
    }
    res.status(200).json({ message: 'SubCategory deleted successfully!' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID', error: err.message });
  }
};

// ✅ Get SubCategories by Category
exports.getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!mongoose.isValidObjectId(categoryId)) {
      return res.status(400).json({ message: 'Invalid Category ID.' });
    }

    const subCategories = await SubCategory.find({ category: categoryId }).populate('category', 'name');
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
