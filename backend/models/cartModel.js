const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  selectedColor: { type: String },
  selectedSize: { type: String },
  customDimensions: {
    height: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    length: { type: Number, default: 0 },
  },
  price: { type: Number, required: true, default: 0 }, // price per unit
});


const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // change if you have a User model
      required: true,
      unique: true, // one cart per user
    },
    items: [cartItemSchema],
    total: { type: Number, default: 0 },
    itemCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
