const SubCategory = require("../models/subCategoryModel");
const upload = require("../config/multer");
const mongoose = require("mongoose");

// Upload middleware
exports.uploadSubCategoryImage = upload.uploadSubCategoryImage.single("image");

// ➕ Add SubCategory
exports.addSubCategory = async (req, res) => {
  try {
    const { name, slug, categoryId, description } = req.body;

    if (!name || !slug || !categoryId) {
      return res.status(400).json({ message: "Name, slug, and categoryId are required." });
    }

    const subCategoryData = {
      name,
      slug,
      categoryId,
      description: description || "",
      image: req.file ? req.file.path : "",
    };

    const subCategory = new SubCategory(subCategoryData);
    await subCategory.save();

    res.status(201).json({
      message: "✅ SubCategory added successfully!",
      subCategory,
    });
  } catch (err) {
    console.error("🔥 Error adding subcategory:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// 📋 Get All SubCategories
exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate("categoryId", "name");
    res.status(200).json(subCategories);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🔎 Get Single SubCategory
exports.getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate("categoryId", "name");
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found!" });
    }
    res.status(200).json(subCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🗑️ Delete SubCategory
exports.deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found!" });
    }
    res.status(200).json({ message: "✅ SubCategory deleted successfully!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 📂 Get SubCategories by Category
exports.getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!mongoose.isValidObjectId(categoryId)) {
      return res.status(400).json({ message: "Invalid Category ID." });
    }

    const subCategories = await SubCategory.find({ categoryId }).populate("categoryId", "name");
    res.status(200).json(subCategories);
  } catch (error) {
    console.error("🔥 Error fetching subcategories by category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✏️ Update SubCategory
exports.updateSubCategory = async (req, res) => {
  try {
    const { name, slug, categoryId, description } = req.body;

    // Build update data
    const updateData = {
      name,
      slug,
      categoryId,
      description: description || "",
    };

    // If a new image was uploaded, replace it
    if (req.file) {
      updateData.image = req.file.path;
    }

    const subCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("categoryId", "name");

    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found!" });
    }

    res.status(200).json({
      message: "✅ SubCategory updated successfully!",
      subCategory,
    });
  } catch (err) {
    console.error("🔥 Error updating subcategory:", err.message);
    res.status(400).json({ message: err.message });
  }
};
