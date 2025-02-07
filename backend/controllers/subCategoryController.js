const SubCategory = require('../models/subCategoryModel'); // Import SubCategory Model
const upload = require('../config/multer'); // Correct import for multer config

// Upload a single subcategory image
exports.uploadSubCategoryImage = upload.uploadSubCategoryImage.single('image');

// Add SubCategory
exports.addSubCategory = async (req, res) => {
  try {
    // Check if the image is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded!' });
    }

    // Process the subcategory data (Assuming you have other form data for the subcategory)
    const subCategoryData = {
      name: req.body.name,
      category: req.body.category,
      image: req.file.path,  // Cloudinary URL for the uploaded image
    };

    // You can add more fields as required
    const subCategory = new SubCategory(subCategoryData);
    await subCategory.save();

    res.status(201).json({
      message: 'SubCategory added successfully!',
      subCategory,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Get All SubCategories
exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find(); // Fetch all subcategories
    res.status(200).json(subCategories); // Return subcategories
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get Single SubCategory by ID
exports.getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ message: 'SubCategory not found!' });
    }
    res.status(200).json(subCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a SubCategory
exports.deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ message: 'SubCategory not found!' });
    }

    // Delete image from Cloudinary
    const imageId = subCategory.image.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(imageId);

    res.status(200).json({ message: 'SubCategory deleted successfully!' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Get SubCategories by Category
exports.getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!mongoose.isValidObjectId(categoryId)) {
      return res.status(400).json({ message: "Invalid Category ID." });
    }

    const subCategories = await SubCategory.find({ category: categoryId }).populate("category", "name");
    res.status(200).json(subCategories);
  } catch (error) {
    console.error("Error fetching subcategories by category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
