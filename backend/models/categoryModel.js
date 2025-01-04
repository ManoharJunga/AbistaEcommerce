const mongoose = require('mongoose');

// Define Category Schema
const CategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Category name is required'], // Custom error message
    trim: true, 
    unique: true, // Ensures no duplicate category names
    minlength: [3, 'Category name must be at least 3 characters long'], // Minimum length validation
    maxlength: [50, 'Category name must be less than 50 characters'], // Maximum length validation
    match: [/^[a-zA-Z0-9\s]+$/, 'Category name can only contain alphanumeric characters and spaces'], // Regex validation
  },
  image: { 
    type: String, 
    required: false, // URL or path to the category image
    validate: {
      validator: function(v) {
        return !v || /^(http(s)?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i.test(v); // URL validation for image
      },
      message: props => `${props.value} is not a valid image URL`
    }
  },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Export the model
module.exports = mongoose.model('Category', CategorySchema);
