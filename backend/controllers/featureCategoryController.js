const FeatureCategory = require('../models/featurecategoryModel');
const Category = require('../models/categoryModel');

// ✅ Create FeatureCategory with multiple features
exports.createFeatureCategory = async (req, res) => {
  try {
    const { category, features } = req.body;

    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // If icon uploaded via Cloudinary
    let parsedFeatures = JSON.parse(features); // frontend should send features as stringified JSON

    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        if (parsedFeatures[index]) {
          parsedFeatures[index].icon = file.path; // Cloudinary URL
        }
      });
    }

    const newFeatureCategory = new FeatureCategory({
      category,
      features: parsedFeatures,
    });

    await newFeatureCategory.save();
    res.status(201).json(newFeatureCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all FeatureCategories
exports.getAllFeatureCategories = async (req, res) => {
  try {
    const featureCategories = await FeatureCategory.find()
      .populate('category', 'name image');
    res.json(featureCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get FeatureCategory by ID
exports.getFeatureCategoryById = async (req, res) => {
  try {
    const featureCategory = await FeatureCategory.findById(req.params.id)
      .populate('category', 'name image');

    if (!featureCategory) {
      return res.status(404).json({ error: 'FeatureCategory not found' });
    }

    res.json(featureCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update FeatureCategory
exports.updateFeatureCategory = async (req, res) => {
  try {
    const { features } = req.body;

    let parsedFeatures = features ? JSON.parse(features) : [];

    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        if (parsedFeatures[index]) {
          parsedFeatures[index].icon = file.path; // Replace with new icon
        }
      });
    }

    const updatedFeatureCategory = await FeatureCategory.findByIdAndUpdate(
      req.params.id,
      { features: parsedFeatures },
      { new: true }
    );

    if (!updatedFeatureCategory) {
      return res.status(404).json({ error: 'FeatureCategory not found' });
    }

    res.json(updatedFeatureCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete FeatureCategory
exports.deleteFeatureCategory = async (req, res) => {
  try {
    const deletedFeatureCategory = await FeatureCategory.findByIdAndDelete(req.params.id);
    if (!deletedFeatureCategory) {
      return res.status(404).json({ error: 'FeatureCategory not found' });
    }
    res.json({ message: 'FeatureCategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
