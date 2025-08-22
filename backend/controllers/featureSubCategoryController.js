const FeatureSubCategory = require('../models/featureSubCategoryModel');
const SubCategory = require('../models/subCategoryModel');

// ✅ Create FeatureSubCategory with multiple features
exports.createFeatureSubCategory = async (req, res) => {
  try {
    const { subCategory, features } = req.body;

    // Validate subCategory exists
    const subCategoryExists = await SubCategory.findById(subCategory);
    if (!subCategoryExists) {
      return res.status(404).json({ error: 'SubCategory not found' });
    }

    // Parse features
    let parsedFeatures = JSON.parse(features); // frontend should send features as JSON string

    // Handle Cloudinary uploads
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        if (parsedFeatures[index]) {
          parsedFeatures[index].icon = file.path; // Cloudinary URL
        }
      });
    }

    const newFeatureSubCategory = new FeatureSubCategory({
      subCategory,
      features: parsedFeatures,
    });

    await newFeatureSubCategory.save();
    res.status(201).json(newFeatureSubCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all FeatureSubCategories
exports.getAllFeatureSubCategories = async (req, res) => {
  try {
    const featureSubCategories = await FeatureSubCategory.find()
      .populate('subCategory', 'name image category');
    res.json(featureSubCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get FeatureSubCategory by ID
exports.getFeatureSubCategoryById = async (req, res) => {
  try {
    const featureSubCategory = await FeatureSubCategory.findById(req.params.id)
      .populate('subCategory', 'name image category');

    if (!featureSubCategory) {
      return res.status(404).json({ error: 'FeatureSubCategory not found' });
    }

    res.json(featureSubCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update FeatureSubCategory
exports.updateFeatureSubCategory = async (req, res) => {
  try {
    const { features } = req.body;
    let parsedFeatures = features ? JSON.parse(features) : [];

    // Handle Cloudinary uploads if new icons uploaded
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        if (parsedFeatures[index]) {
          parsedFeatures[index].icon = file.path; // Replace with new icon
        }
      });
    }

    const updatedFeatureSubCategory = await FeatureSubCategory.findByIdAndUpdate(
      req.params.id,
      { features: parsedFeatures },
      { new: true }
    );

    if (!updatedFeatureSubCategory) {
      return res.status(404).json({ error: 'FeatureSubCategory not found' });
    }

    res.json(updatedFeatureSubCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete FeatureSubCategory
exports.deleteFeatureSubCategory = async (req, res) => {
  try {
    const deletedFeatureSubCategory = await FeatureSubCategory.findByIdAndDelete(req.params.id);
    if (!deletedFeatureSubCategory) {
      return res.status(404).json({ error: 'FeatureSubCategory not found' });
    }
    res.json({ message: 'FeatureSubCategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
