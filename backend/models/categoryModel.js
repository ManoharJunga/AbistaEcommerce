const mongoose = require('mongoose');

// Define Category Schema
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      minlength: [3, 'Category name must be at least 3 characters long'],
      maxlength: [50, 'Category name must be less than 50 characters'],
      match: [/^[a-zA-Z0-9\s]+$/, 'Category name can only contain alphanumeric characters and spaces'],
    },

    slug: {
      type: String,
      required: [true, 'Slug is required'],
      trim: true,
      unique: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL friendly (e.g., my-category)'],
    },

    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    image: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          return !v || /^(http(s)?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i.test(v);
        },
        message: (props) => `${props.value} is not a valid image URL`,
      },
    },

    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory', // Reference to SubCategory model
      },
    ],
  },
  { timestamps: true }
);

// Export the model
module.exports = mongoose.model('Category', CategorySchema);
