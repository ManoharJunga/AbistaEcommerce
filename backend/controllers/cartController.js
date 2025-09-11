const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Utility function to calculate price per unit based on dimensions
const calculatePrice = (product, quantity, { height = 0, width = 0, length = 0 }) => {
  let basePrice = product.dealPrice ?? product.price ?? 0;

  // Example calculation: price proportional to area or volume (customize as needed)
  if (product.type === "door") {
    basePrice *= (height * width) / (78 * 32); // relative to default dimensions
  } else if (product.type === "frame") {
    basePrice *= length / 7; // assuming 7 ft default length
  }

  return basePrice * quantity;
};

// =====================
// Get Cart
// =====================
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [], total: 0, itemCount: 0 });
      await cart.save();
    }
    return res.json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// =====================
// Add item to cart
// =====================
const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity, selectedColor, selectedSize, customDimensions } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const { height = 0, width = 0, length = 0 } = customDimensions || {};

    const pricePerUnit = calculatePrice(product, 1, { height, width, length });

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [
          {
            product: product._id,
            quantity,
            selectedColor,
            selectedSize,
            customDimensions: { height, width, length },
            price: pricePerUnit,
          },
        ],
      });
    } else {
      const existingIndex = cart.items.findIndex(
        (i) =>
          i.product.toString() === productId &&
          i.selectedColor === selectedColor &&
          i.selectedSize === selectedSize &&
          i.customDimensions.height === height &&
          i.customDimensions.width === width &&
          i.customDimensions.length === length
      );

      if (existingIndex > -1) {
        cart.items[existingIndex].quantity += quantity;
      } else {
        cart.items.push({
          product: product._id,
          quantity,
          selectedColor,
          selectedSize,
          customDimensions: { height, width, length },
          price: pricePerUnit,
        });
      }
    }

    cart.itemCount = cart.items.reduce((acc, i) => acc + i.quantity, 0);
    cart.total = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

    await cart.save();
    cart = await Cart.findById(cart._id).populate("items.product");
    return res.json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// =====================
// Update quantity
// =====================
const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity, selectedColor, selectedSize, customDimensions } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const { height = 0, width = 0, length = 0 } = customDimensions || {};

    const item = cart.items.find(
      (i) =>
        i.product.toString() === productId &&
        i.selectedColor === selectedColor &&
        i.selectedSize === selectedSize &&
        i.customDimensions.height === height &&
        i.customDimensions.width === width &&
        i.customDimensions.length === length
    );
    if (!item) return res.status(404).json({ error: "Item not found in cart" });

    item.quantity = quantity;
    const product = await Product.findById(item.product);
    item.price = calculatePrice(product, 1, { height, width, length });

    cart.itemCount = cart.items.reduce((acc, i) => acc + i.quantity, 0);
    cart.total = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.product");
    return res.json(updatedCart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// =====================
// Remove item
// =====================
const removeCartItem = async (req, res) => {
  try {
    const { productId, selectedColor, selectedSize, customDimensions } = req.body;
    const { height = 0, width = 0, length = 0 } = customDimensions || {};

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (i) =>
        !(
          i.product.toString() === productId &&
          i.selectedColor === selectedColor &&
          i.selectedSize === selectedSize &&
          i.customDimensions.height === height &&
          i.customDimensions.width === width &&
          i.customDimensions.length === length
        )
    );

    cart.itemCount = cart.items.reduce((acc, i) => acc + i.quantity, 0);
    cart.total = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.product");
    return res.json(updatedCart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// =====================
// Clear cart
// =====================
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = [];
    cart.total = 0;
    cart.itemCount = 0;

    await cart.save();
    return res.json(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartQuantity,
  removeCartItem,
  clearCart,
};
