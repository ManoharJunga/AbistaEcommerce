// models/About.js
const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // e.g. "About ModernShop"
    description: { type: String, required: true }, // intro paragraph

    storyTitle: { type: String, default: "Our Story" },
    storyParagraphs: [{ type: String }], // array of paragraphs
    storyImage: { type: String }, // image/icon url

    stats: [
      {
        icon: { type: String }, // lucide icon name or custom
        value: { type: String }, // "5M+"
        label: { type: String }, // "Happy Customers"
      },
    ],

    valuesTitle: { type: String, default: "Our Values" },
    values: [
      {
        title: { type: String },
        description: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.About || mongoose.model("About", aboutSchema);
