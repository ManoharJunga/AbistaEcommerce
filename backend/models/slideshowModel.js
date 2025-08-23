const mongoose = require('mongoose');

// Define Slideshow Schema
const SlideshowSchema = new mongoose.Schema({
  subtitle: {
    type: String,
    trim: true,
    required: true, // e.g., "Premium Quality Products"
  },
  title: {
    type: String,
    required: true,
    trim: true, // e.g., "Discover Doors"
  },
  description: {
    type: String,
    trim: true,
    required: true, // e.g., "Explore our extensive collection of doors..."
  },
  ctaText: {
    type: String,
    default: "Shop Now", // Call-to-action button text
  },
  ctaLink: {
    type: String,
    default: "/", // Link for the button
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
  order: {
    type: Number,
    default: 0, // To control slide position/order
  }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Export the model
module.exports = mongoose.model('Slideshow', SlideshowSchema);
