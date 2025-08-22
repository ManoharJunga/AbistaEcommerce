const mongoose = require('mongoose');

const FeatureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Feature title is required'],
    trim: true,
    minlength: [3, 'Feature title must be at least 3 characters long'],
    maxlength: [100, 'Feature title must be less than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Feature description is required'],
    trim: true,
    minlength: [10, 'Feature description must be at least 10 characters long'],
    maxlength: [500, 'Feature description must be less than 500 characters'],
  },
  icon: {
    type: String,
    required: true, // Cloudinary URL for the icon (PNG/SVG)
    validate: {
      validator: function (v) {
        return /^(http(s)?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i.test(v);
      },
      message: props => `${props.value} is not a valid image URL`,
    },
  },
});

// FeatureCategory Schema (connects category with its features)
const FeatureCategorySchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true, // Each feature belongs to a category
    },
    features: [FeatureSchema], // Array of features
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeatureCategory', FeatureCategorySchema);
