const DealProduct = require("../models/dealProductModel");
const Product = require("../models/productModel");

// ✅ Create new deal
exports.createDeal = async (req, res) => {
  try {
    const { product, dealPrice, startDate, endDate } = req.body;

    // ensure product exists
    const prod = await Product.findById(product);
    if (!prod) return res.status(404).json({ message: "Product not found" });

    const deal = await DealProduct.create({
      product,
      dealPrice,
      startDate,
      endDate,
    });

    res.status(201).json(deal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all deals
exports.getDeals = async (req, res) => {
  try {
    const deals = await DealProduct.find()
      .populate("product", "name price stock slug images")
      .sort({ createdAt: -1 });

    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get active deals only
exports.getActiveDeals = async (req, res) => {
  try {
    const now = new Date();
    const deals = await DealProduct.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
      isActive: true,
    }).populate("product", "name price stock slug images");

    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get single deal by ID
exports.getDealById = async (req, res) => {
  try {
    const deal = await DealProduct.findById(req.params.id)
      .populate("product", "name price stock slug images");

    if (!deal) return res.status(404).json({ message: "Deal not found" });

    res.json(deal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update deal
exports.updateDeal = async (req, res) => {
  try {
    const deal = await DealProduct.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("product", "name price stock slug images");

    if (!deal) return res.status(404).json({ message: "Deal not found" });

    res.json(deal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete deal
exports.deleteDeal = async (req, res) => {
  try {
    const deal = await DealProduct.findByIdAndDelete(req.params.id);

    if (!deal) return res.status(404).json({ message: "Deal not found" });

    res.json({ message: "Deal deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
