const mongoose = require("mongoose");
const slugify = require("slugify"); // npm install slugify

// ✅ Limit max array size
function arrayLimit(val) {
  return val.length <= 5;
}

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true }, // auto-generated
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true },

    sizes: {
      type: [
        {
          height: { type: Number, min: 0 },
          width: { type: Number, min: 0 },
          weight: { type: Number, min: 0 },
        },
      ],
      default: [],
    },


    attributes: {
      textures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Texture" }],
      finishes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Finish" }],
      materials: [{ type: mongoose.Schema.Types.ObjectId, ref: "Material" }],
    },

    images: {
      type: [{ type: String, required: true }],
      validate: [arrayLimit, "Maximum 5 images allowed"],
    },

    variants: [
      {
        name: { type: String, trim: true },
        color: { type: String, trim: true },
        images: {
          type: [{ type: String }],
          validate: [arrayLimit, "Maximum 5 images allowed"],
        },
        stock: { type: Number, min: 0 },
      },
    ],

    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// ✅ Generate unique slug before save
ProductSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    let newSlug = slugify(this.name, { lower: true, strict: true });

    // Check for slug collision
    let slugExists = await this.constructor.findOne({ slug: newSlug });
    let counter = 1;
    while (slugExists) {
      newSlug = `${slugify(this.name, { lower: true, strict: true })}-${counter}`;
      slugExists = await this.constructor.findOne({ slug: newSlug });
      counter++;
    }

    this.slug = newSlug;
  }
  next();
});

// ✅ Handle slug update on findOneAndUpdate
ProductSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.name) {
    let newSlug = slugify(update.name, { lower: true, strict: true });

    let slugExists = await this.model.findOne({ slug: newSlug });
    let counter = 1;
    while (slugExists) {
      newSlug = `${slugify(update.name, { lower: true, strict: true })}-${counter}`;
      slugExists = await this.model.findOne({ slug: newSlug });
      counter++;
    }

    update.slug = newSlug;
    this.setUpdate(update);
  }
  next();
});

// ✅ Indexes
ProductSchema.index({ slug: 1 });
ProductSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", ProductSchema);
