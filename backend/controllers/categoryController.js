const Category = require('../models/categoryModel'); // Import Category Model
const upload = require('../config/multer'); // Correct import for multer config

// Upload a single category image
exports.uploadCategoryImage = upload.uploadCategoryImage.single('image');

// Add Category (Example of your category creation logic)
exports.addCategory = async (req, res) => {
  try {
    // Check if the image is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded!' });
    }

    // Process the category data (Assuming you have other form data for the category)
    const categoryData = {
      name: req.body.name,
      image: req.file.path,  // Cloudinary URL for the uploaded image
    };

    // You can add more fields as required
    const category = new Category(categoryData);
    await category.save();

    res.status(201).json({
      message: 'Category added successfully!',
      category,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
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
