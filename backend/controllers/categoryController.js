const Category = require('../models/categoryModel'); // Import Category Model
const upload = require('../config/multer'); // Multer config

// Upload a single category image
exports.uploadCategoryImage = upload.uploadCategoryImage.single('image');

// ✅ Add Category
exports.addCategory = async (req, res) => {
  try {
    console.log("📥 Incoming category data:", req.body);
    console.log("📷 Uploaded file:", req.file);

    const categoryData = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description || '',
      image: req.file ? req.file.path : "",  // <-- safe fallback
      subcategories: req.body.subcategories || [],
    };

    const category = new Category(categoryData);
    await category.save();

    res.status(201).json({
      message: '✅ Category added successfully!',
      category,
    });
  } catch (err) {
    console.error("🔥 Server Error while adding category:", err);
    res.status(500).json({ message: err.message });
  }
};




// ✅ Get All Categories (with subcategories populated)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('subcategories');
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Get Single Category by ID (with subcategories populated)
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('subcategories');
    if (!category) {
      return res.status(404).json({ message: 'Category not found!' });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Update Category
exports.updateCategory = async (req, res) => {
  try {
    console.log("➡️ Update request received for ID:", req.params.id);
    console.log("➡️ Body:", req.body);
    if (req.file) console.log("➡️ File uploaded:", req.file.path);

    const updateData = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!category) {
      console.log("❌ Category not found for ID:", req.params.id);
      return res.status(404).json({ message: 'Category not found!' });
    }

    console.log("✅ Category updated:", category);
    res.status(200).json({
      message: '✅ Category updated successfully!',
      category,
    });
  } catch (err) {
    console.error("🔥 Error updating category:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// ✅ Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found!' });
    }
    res.status(200).json({ message: '✅ Category deleted successfully!' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
