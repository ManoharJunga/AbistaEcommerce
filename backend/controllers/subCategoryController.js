// controllers/subCategoryController.js
const SubCategory = require('../models/subCategoryModel');

// Create a SubCategory
exports.createSubCategory = async (req, res) => {
  try {
    const { name, image, category } = req.body;

    const newSubCategory = new SubCategory({
      name,
      image,
      category,
    });

    const savedSubCategory = await newSubCategory.save();
    res.status(201).json(savedSubCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all SubCategories
exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate('category'); // Populate category details
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single SubCategory by ID
exports.getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate('category');
    if (!subCategory) {
      return res.status(404).json({ message: 'SubCategory not found' });
    }
    res.status(200).json(subCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a SubCategory
exports.updateSubCategory = async (req, res) => {
  try {
    const { name, image, category } = req.body;

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      { name, image, category },
      { new: true, runValidators: true }
    );

    if (!updatedSubCategory) {
      return res.status(404).json({ message: 'SubCategory not found' });
    }

    res.status(200).json(updatedSubCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a SubCategory
exports.deleteSubCategory = async (req, res) => {
  try {
    const deletedSubCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!deletedSubCategory) {
      return res.status(404).json({ message: 'SubCategory not found' });
    }
    res.status(200).json({ message: 'SubCategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


