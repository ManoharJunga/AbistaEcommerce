const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true, // URL of the uploaded image
  },
  mainHeader: {
    type: String,
    required: true, // Main header of the card
  },
  description: {
    type: String,
    required: true, // Description for the card
  },
}, { timestamps: true });

module.exports = mongoose.model('Card', CardSchema);
