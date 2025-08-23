const mongoose = require('mongoose');
const slugify = require('slugify'); // ✅ install this: npm install slugify

function arrayLimit(val) {
  return val.length <= 5;
}

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true, trim: true }, // ✅ new field
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },

  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },  
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true },

  sizes: [{
    height: { type: Number, required: true, min: 0 },
    width: { type: Number, required: true, min: 0 },
    weight: { type: Number, min: 0 }
  }],

  attributes: {
    textures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Texture" }],
    finishes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Finish" }],
    materials: [{ type: mongoose.Schema.Types.ObjectId, ref: "Material" }]
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

// ✅ Auto-generate slug from name before save
ProductSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
