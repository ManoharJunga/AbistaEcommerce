const mongoose = require("mongoose");

const DealProductSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    dealPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true, // toggle if you want to deactivate manually
    },
  },
  { timestamps: true }
);

// 🔎 Index for querying active deals faster
DealProductSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model("DealProduct", DealProductSchema);
