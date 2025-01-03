const mongoose = require('mongoose');

// Define SubCategory Schema
const SubCategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, // SubCategory name is required
    trim: true, 
    unique: true // Ensures no duplicate subcategory names
  },
  image: { 
    type: String, 
    required: false // Image is optional
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, // Reference to Category schema
    ref: 'Category', 
    required: true // SubCategory must belong to a Category
  },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Export the model
module.exports = mongoose.model('SubCategory', SubCategorySchema);
