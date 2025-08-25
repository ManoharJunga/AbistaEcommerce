// models/PrivacyPolicy.js
const mongoose = require("mongoose");

const privacyPolicySchema = new mongoose.Schema(
  {
    lastUpdated: { type: Date, required: true },

    // Main sections
    introduction: { type: String, required: true },
    informationWeCollect: {
      personalInformation: { type: String },
      usageInformation: { type: String },
      cookiesAndTracking: { type: String },
    },
    howWeUseInfo: [{ type: String }], // array of bullet points
    informationSharing: [{ type: String }],
    dataSecurity: { type: String },
    yourRights: [{ type: String }],
    cookiesPolicy: {
      essentialCookies: { type: String },
      analyticsCookies: { type: String },
      marketingCookies: { type: String },
    },
    contactUs: {
      email: { type: String },
      phone: { type: String },
      address: { type: String },
    },
  },
  { timestamps: true }
);

const PrivacyPolicy = mongoose.model("PrivacyPolicy", privacyPolicySchema);
module.exports = PrivacyPolicy;
