const SubCategory = require('../models/subCategoryModel');
const cloudinary = require('../config/cloudinary'); // Assuming cloudinary config is in utils/cloudinary.js

// Create SubCategory
exports.createSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    const image = req.file.path; // Image URL returned by Cloudinary after upload

    const newSubCategory = new SubCategory({
      name,
      category,
      image
    });

    await newSubCategory.save();
    res.status(201).json({ message: 'SubCategory created successfully', subCategory: newSubCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all SubCategories
exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate('category', 'name');
    res.status(200).json(subCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single SubCategory by ID
exports.getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate('category', 'name');
    if (!subCategory) {
      return res.status(404).json({ message: 'SubCategory not found' });
    }
    res.status(200).json(subCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a SubCategory
exports.updateSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    const updateData = { name, category };

    if (req.file) {
      // If a new image is uploaded, update the image URL
      updateData.image = req.file.path;
    }

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedSubCategory) {
      return res.status(404).json({ message: 'SubCategory not found' });
    }

    res.status(200).json({ message: 'SubCategory updated successfully', subCategory: updatedSubCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a SubCategory
exports.deleteSubCategory = async (req, res) => {
  try {
    const deletedSubCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!deletedSubCategory) {
      return res.status(404).json({ message: 'SubCategory not found' });
    }

    // Optionally, delete the image from Cloudinary
    const imageId = deletedSubCategory.image.split('/').pop().split('.')[0]; // Get image public ID from URL
    await cloudinary.uploader.destroy(imageId);

    res.status(200).json({ message: 'SubCategory deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
