const mongoose = require("mongoose");

const termsOfServiceSchema = new mongoose.Schema({
  lastUpdated: { type: String, required: true },
  acceptanceOfTerms: { type: String, required: true },
  useLicense: { type: [String], required: true },
  accountTerms: {
    accountCreation: { type: String, required: true },
    accountResponsibilities: { type: String, required: true },
  },
  purchaseTerms: {
    productInformation: { type: String, required: true },
    pricingAndPayment: { type: String, required: true },
    orderAcceptance: { type: String, required: true },
    shippingAndReturns: { type: String, required: true },
  },
  prohibitedUses: { type: [String], required: true },
  disclaimer: { type: String, required: true },
  limitations: { type: String, required: true },
  governingLaw: { type: String, required: true },
  contactInformation: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
});

const TermsOfService = mongoose.model("TermsOfService", termsOfServiceSchema);

module.exports = TermsOfService;
