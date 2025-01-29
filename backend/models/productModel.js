const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },  
  subCategory: { // Add sub-category reference
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true // Optional field
  },
  sizes: [{
    height: { type: Number, required: true },
    width: { type: Number, required: true },
    weight: { type: Number, required: true },
  }],
  attributes: {
    texture: { type: String, trim: true },
    finish: { type: String, trim: true },
    color: { type: String, trim: true },
    material: { type: String, trim: true },
  },
  images: [{ type: String, required: true }],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
