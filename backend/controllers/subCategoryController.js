const SubCategory = require('../models/subCategoryModel');
const asyncHandler = require('express-async-handler'); // For cleaner async handling
const upload = require('../config/multer'); // Import the multer config

// Middleware for uploading images
exports.uploadSubCategoryImage = upload.uploadSubCategoryImage.single('image'); // Use the specific upload method

// Create a SubCategory
exports.createSubCategory = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Image is required!' });
  }

  const { name, category } = req.body;

  const newSubCategory = new SubCategory({
    name,
    image: req.file.path, // Store image URL
    category,
  });

  const savedSubCategory = await newSubCategory.save();
  res.status(201).json(savedSubCategory);
});

// Get all SubCategories
exports.getSubCategories = asyncHandler(async (req, res) => {
  const subCategories = await SubCategory.find().populate('category');
  res.status(200).json(subCategories);
});

// Get a single SubCategory by ID
exports.getSubCategoryById = asyncHandler(async (req, res) => {
  const subCategory = await SubCategory.findById(req.params.id).populate('category');
  if (!subCategory) {
    return res.status(404).json({ message: 'SubCategory not found' });
  }
  res.status(200).json(subCategory);
});

// Update a SubCategory
exports.updateSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  const updateData = { name, category };
  if (req.file) {
    updateData.image = req.file.path;
  }

  const updatedSubCategory = await SubCategory.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedSubCategory) {
    return res.status(404).json({ message: 'SubCategory not found' });
  }

  res.status(200).json(updatedSubCategory);
});

// Delete a SubCategory
exports.deleteSubCategory = asyncHandler(async (req, res) => {
  const deletedSubCategory = await SubCategory.findByIdAndDelete(req.params.id);
  if (!deletedSubCategory) {
    return res.status(404).json({ message: 'SubCategory not found' });
  }
  res.status(200).json({ message: 'SubCategory deleted successfully' });
});
