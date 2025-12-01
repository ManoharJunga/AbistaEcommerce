const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

/**
 * Utility function to calculate price per unit based on dimensions
 */
const calculatePrice = (product, { height = 0, width = 0, length = 0 }) => {
  let basePrice = product.dealPrice ?? product.price ?? 0;

  // Determine type by name (since we don’t have product.type field)
  const name = product.name.toLowerCase();

  if (name.includes("frame")) {
    // Frame pricing based on length (default 7 feet)
    const defaultLength = 7;
    return basePrice * (length / defaultLength);
  } else if (name.includes("door")) {
    // Door pricing based on area ratio (default 78x32)
    const defaultHeight = 78;
    const defaultWidth = 32;
    const areaRatio = (height * width) / (defaultHeight * defaultWidth);
    return basePrice * areaRatio;
  } else {
    // Otherwise flat rate
    return basePrice;
  }
};

/**
 * Get cart for user
 */
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [], total: 0, itemCount: 0 });
      await cart.save();
    }
    return res.json(cart);
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Add item to cart
 */

const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, selectedColor, selectedSize, customDimensions = {} } = req.body;
    const { height = 0, width = 0, length = 0 } = customDimensions;

    // 🔹 Find product
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // 🔹 Calculate price per unit
    const pricePerUnit =
      req.body.price && req.body.price > 0
        ? req.body.price
        : calculatePrice(product, { height, width, length });

    // 🔹 Find or create user cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    // 🔹 Normalize dimensions to ensure numeric equality comparison
    const normalizeDim = (d) => ({
      height: Number(d?.height) || 0,
      width: Number(d?.width) || 0,
      length: Number(d?.length) || 0,
    });

    const newDims = normalizeDim({ height, width, length });

    // 🔹 Check if same item already exists
    const existingIndex = cart.items.findIndex((item) => {
      const existingDims = normalizeDim(item.customDimensions);
      return (
        item.product.toString() === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize &&
        existingDims.height === newDims.height &&
        existingDims.width === newDims.width &&
        existingDims.length === newDims.length
      );
    });

    if (existingIndex > -1) {
      // 🔸 Update quantity
      cart.items[existingIndex].quantity += quantity;
    } else {
      // 🔸 Add new item
      cart.items.push({
        product: product._id,
        quantity,
        selectedColor,
        selectedSize,
        customDimensions: newDims,
        price: pricePerUnit, // per-unit price
      });
    }

    // 🔹 Recalculate totals
    cart.itemCount = cart.items.reduce((acc, i) => acc + i.quantity, 0);
    cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // 🔹 Save and populate product info
    await cart.save();
    cart = await Cart.findById(cart._id).populate("items.product");

    return res.status(200).json(cart);
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    return res.status(500).json({ error: "Server error" });
  }
};


/**
 * Update item quantity
 */
const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity, selectedColor, selectedSize, customDimensions } = req.body;
    const { height = 0, width = 0, length = 0 } = customDimensions || {};

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(
      (i) =>
        i.product.toString() === productId &&
        i.selectedColor === selectedColor &&
        i.selectedSize === selectedSize &&
        i.customDimensions.height === height &&
        i.customDimensions.width === width &&
        i.customDimensions.length === length
    );

    if (!item) return res.status(404).json({ error: "Item not found" });

    const product = await Product.findById(item.product);
    item.quantity = quantity;


    cart.itemCount = cart.items.reduce((acc, i) => acc + i.quantity, 0);
    cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    await cart.save();
    const updated = await Cart.findById(cart._id).populate("items.product");
    res.json(updated);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Remove item
 */
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
    cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    await cart.save();
    const updated = await Cart.findById(cart._id).populate("items.product");
    res.json(updated);
  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Clear cart
 */
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = [];
    cart.total = 0;
    cart.itemCount = 0;
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartQuantity,
  removeCartItem,
  clearCart,
};
