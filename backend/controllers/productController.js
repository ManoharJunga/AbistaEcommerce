const Product = require('../models/productModel');
const SubCategory = require('../models/subCategoryModel');
const mongoose = require('mongoose');
const upload = require('../config/multer'); // Import Cloudinary multer config
const Finish = require('../models/finishModel');
const Material = require('../models/materialModel');
const Texture = require('../models/textureModel');
const slugify = require("slugify");


// Middleware for handling image uploads
exports.uploadProductImages = upload.uploadProductImage.array('images', 5); // Max 5 images for a product


// ✅ Add new product
exports.addProduct = async (req, res) => {
  try {
    let { name, description, price, stock, category, subCategory, categoryId, subCategoryId, sizes, attributes, variants, specifications } = req.body;

    // Normalize category fields
    if (!category && categoryId) category = categoryId;
    if (!subCategory && subCategoryId) subCategory = subCategoryId;

    if (!name || !description || !price || !stock || !category || !subCategory) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const images = req.files?.map(file => file.path) || [];

    // ✅ Parse attributes correctly
    let parsedAttributes = {};
    if (attributes) {
      if (typeof attributes === "string") {
        try {
          parsedAttributes = JSON.parse(attributes);
        } catch (err) {
          return res.status(400).json({ message: "Invalid attributes format" });
        }
      } else {
        parsedAttributes = attributes;
      }
    }

    // ✅ Parse specifications (custom key-value pairs)
    let parsedSpecifications = {};
    if (specifications) {
      if (typeof specifications === "string") {
        try {
          parsedSpecifications = JSON.parse(specifications);
        } catch (err) {
          return res.status(400).json({ message: "Invalid specifications format" });
        }
      } else {
        parsedSpecifications = specifications;
      }
    }

    const product = new Product({
      name,
      slug: slugify(name, { lower: true, strict: true }),
      description,
      price,
      stock,
      category,
      subCategory,
      sizes: sizes ? JSON.parse(sizes) : [],
      attributes: {
        textures: parsedAttributes.selectedTextures || [],
        finishes: parsedAttributes.selectedFinishes || [],
        materials: parsedAttributes.selectedMaterials || []
      },
      variants: variants ? JSON.parse(variants) : [],
      images,
      specifications: parsedSpecifications // ✅ Save specifications
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });

  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all products with pagination, search, and filtering
exports.getProducts = async (req, res) => {
  try {
    const { search, category, subCategory, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }

    const products = await Product.find(filter)
      .populate('category subCategory')
      .populate('attributes.textures')   // ✅ Populate textures
      .populate('attributes.finishes')   // ✅ Populate finishes
      .populate('attributes.materials')  // ✅ Populate materials
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.status(200).json({ total, page, limit, products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    const product = await Product.findById(id)
      .populate('category subCategory')
      .populate('attributes.textures')
      .populate('attributes.finishes')
      .populate('attributes.materials');

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;  

    // Validate Product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    let updateData = { ...req.body };

    // ✅ Parse attributes if sent as JSON string
    if (updateData.attributes && typeof updateData.attributes === "string") {
      try {
        updateData.attributes = JSON.parse(updateData.attributes);
      } catch {
        return res.status(400).json({ message: "Invalid attributes format" });
      }
    }

    // ✅ Parse specifications if sent as JSON string
    if (updateData.specifications && typeof updateData.specifications === "string") {
      try {
        updateData.specifications = JSON.parse(updateData.specifications);
      } catch {
        return res.status(400).json({ message: "Invalid specifications format" });
      }
    }

    // ✅ Fix category fields
    if (updateData.categoryId) {
      updateData.category = updateData.categoryId;
      delete updateData.categoryId;
    }
    if (updateData.subCategoryId) {
      updateData.subCategory = updateData.subCategoryId;
      delete updateData.subCategoryId;
    }

    // ✅ Handle images
    if (req.files?.length) {
      updateData.images = req.files.map(file => file.path);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
      const { id } = req.params;  // Accessing the product ID from request params

      // Validate the ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid Product ID" });
      }

      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
          return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
      console.error("Error deleting product:", error);  // Log the error for debugging
      res.status(500).json({ message: "Server error", error });
  }
};

// Get Featured Products (Random 10)
exports.getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.aggregate([{ $sample: { size: 10 } }]);
    res.status(200).json(featuredProducts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Best-Selling Products (Based on totalReviews)
exports.getBestSellingProducts = async (req, res) => {
  try {
    const bestSellingProducts = await Product.find().sort({ totalReviews: -1 }).limit(10);
    res.status(200).json(bestSellingProducts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getProductsBySubcategory = async (req, res) => {
  try {
    const { subcategory } = req.query;

    if (!subcategory) {
      return res.status(400).json({ message: 'Subcategory ID is required!' });
    }

    const products = await Product.find({ subCategory: subcategory })
      .populate('category', 'name')
      .populate('subCategory', 'name');

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this subcategory' });
    }

    res.status(200).json({ products });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug })
      .populate('category subCategory')
      .populate('attributes.textures')
      .populate('attributes.finishes')
      .populate('attributes.materials');

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
