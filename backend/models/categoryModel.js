const mongoose = require('mongoose');

// Define Category Schema
const CategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true, 
    unique: true // Ensures no duplicate category names
  },
  image: { 
    type: String, 
    required: false // URL or path to the category image
  },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Export the model
module.exports = mongoose.model('Category', CategorySchema);
