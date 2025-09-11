const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { protect } = require("../middlewares/authMiddleware");

// =====================
// Cart Routes
// =====================

// Get current user's cart
router.get("/", protect, cartController.getCart);

// Add item to cart (with customDimensions and price calculation)
router.post("/add", protect, cartController.addItemToCart);

// Update quantity of a cart item
router.put("/update", protect, cartController.updateCartQuantity);

// Remove a specific item from cart
router.delete("/remove", protect, cartController.removeCartItem);

// Clear entire cart
router.delete("/clear", protect, cartController.clearCart);

module.exports = router;
