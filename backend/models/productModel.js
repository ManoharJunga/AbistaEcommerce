const mongoose = require('mongoose');

function arrayLimit(val) {
  return val.length <= 5;
}

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },  
  subCategory: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: true 
  },
  sizes: [{
    height: { type: Number, required: true, min: 0 },
    width: { type: Number, required: true, min: 0 },
    weight: { type: Number, min: 0 } // Optional field
  }],
  attributes: {
    texture: { type: String, trim: true },
    finish: { type: String, trim: true },
    material: { type: String, trim: true }
  },
  images: { 
    type: [{ type: String, required: true }], 
    validate: [arrayLimit, 'Maximum 5 images allowed'] 
  }, 
  variants: [{
    name: { type: String, trim: true },
    color: { type: String, trim: true },
    images: { 
      type: [{ type: String }], 
      validate: [arrayLimit, 'Maximum 5 images allowed'] 
    }, 
    stock: { type: Number, min: 0 }
  }],
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
