const mongoose = require('mongoose');

// Define Project Schema
const ProjectSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  image: { 
    type: String, 
    required: true // URL or path to the project image
  }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Export the model
module.exports = mongoose.model('Project', ProjectSchema);
