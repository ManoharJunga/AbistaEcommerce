const SubCategory = require('../models/subCategoryModel');
const upload = require('../config/multer'); // Cloudinary multer config

// Middleware for uploading images
exports.uploadSubCategoryImage = upload.single('image');

// Create a SubCategory
exports.createSubCategory = async (req, res) => {
  try {
    // Log incoming request for debugging
    console.log('Request Body:', req.body);
    console.log('File:', req.file);

    // Validate if image is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded!' });
    }

    const { name, category } = req.body;

    const newSubCategory = new SubCategory({
      name,
      image: req.file.path, // Store image URL
      category,
    });

    const savedSubCategory = await newSubCategory.save();
    res.status(201).json(savedSubCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all SubCategories
exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate('category');
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
    // Log incoming request for debugging
    console.log('Request Body:', req.body);
    console.log('File:', req.file);

    const { name, category } = req.body;
    const updateData = { name, category };

    // If a new image is uploaded, update the image URL
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
  } catch (error) {
    console.error(error);
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
