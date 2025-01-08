const mongoose = require('mongoose');

// SubCategory Schema
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',  // Assuming a Category model exists
      required: true
    },
    image: {
      type: String,  // URL of the image on Cloudinary
      required: true
    }
  },
  { timestamps: true }
);

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
