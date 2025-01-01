const Category = require('../models/categoryModel'); // Import Category Model
const upload = require('../config/multer'); // Multer for image upload

// Middleware for image upload
exports.uploadCategoryImage = upload.single('image');

// Add a New Category
exports.addCategory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required!' });
    }

    // Create a new category
    const category = new Category({
      name: req.body.name,
      image: req.file.path // Save the uploaded image URL or path
    });

    await category.save();
    res.status(201).json(category); // Return the created category
  } catch (err) {
    res.status(400).json({ message: err.message }); // Handle errors
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch all categories
    res.status(200).json(categories); // Return categories
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get Single Category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found!' });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a Category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found!' });
    }
    res.status(200).json({ message: 'Category deleted successfully!' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
