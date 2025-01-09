const mongoose = require('mongoose');

// Define Slideshow Schema
const SlideshowSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  tags: {
    type: String,
    enum: ['doors', 'frames', 'hardware', 'main page'],
    required: true,
  },
  image: {
    type: String,
    required: true, // URL or path to the slideshow image
  },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Export the model
module.exports = mongoose.model('Slideshow', SlideshowSchema);
