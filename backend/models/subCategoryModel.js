const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      validate: {
        validator: function (v) {
          return mongoose.Types.ObjectId.isValid(v);
        },
        message: 'Invalid category ID format',
      },
    },
    image: {
      type: String, // Cloudinary image URL or local path
      required: true,
    },
    roomType: {
      type: Boolean,
      default: false, // Default value is false if not provided
    },
    roomTypeImage: {
      type: String, // Cloudinary image URL or local path
      default: null, // Optional
    },
  },
  { timestamps: true }
);

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
module.exports = SubCategory;
