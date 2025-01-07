const mongoose = require('mongoose');

// Define the SubCategory Schema
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'], // Validation for name
      trim: true,
    },
    image: {
      type: String, // URL of the uploaded image (Cloudinary URL)
      required: [true, 'Image is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Category model
      ref: 'Category', // Relational mapping to the Category model
      required: [true, 'Category is required'],
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
  }
);

// Create and export the SubCategory model
module.exports = mongoose.model('SubCategory', subCategorySchema);
