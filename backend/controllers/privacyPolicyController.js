// controllers/privacyPolicyController.js
const PrivacyPolicy = require("../models/privacyPolicyModel");

// Create Privacy Policy
// controllers/privacyPolicyController.js
// controllers/privacyPolicyController.js
const createPrivacyPolicy = async (req, res) => {
  try {
    const mappedData = {
      lastUpdated: req.body.lastUpdated || new Date(),
      introduction: req.body.introduction, // ✅ match frontend

      informationWeCollect: {
        personalInformation: req.body.informationWeCollect?.personalInformation,
        usageInformation: req.body.informationWeCollect?.usageInformation,
        cookiesAndTracking: req.body.informationWeCollect?.cookiesAndTracking,
      },

      howWeUseInfo: req.body.howWeUseInfo || [], // ✅ already array
      informationSharing: req.body.informationSharing || [], // ✅ already array
      dataSecurity: req.body.dataSecurity,
      yourRights: req.body.yourRights || [], // ✅ already array

      cookiesPolicy: {
        essentialCookies: req.body.cookiesPolicy?.essentialCookies,
        analyticsCookies: req.body.cookiesPolicy?.analyticsCookies,
        marketingCookies: req.body.cookiesPolicy?.marketingCookies,
      },

      contactUs: {
        email: req.body.contactUs?.email,
        phone: req.body.contactUs?.phone,
        address: req.body.contactUs?.address,
      },
    };

    const policy = new PrivacyPolicy(mappedData);
    await policy.save();
    res.status(201).json(policy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Get Privacy Policy (latest one)
const getPrivacyPolicy = async (req, res) => {
  try {
    const policy = await PrivacyPolicy.findOne().sort({ createdAt: -1 });
    if (!policy) {
      return res.status(404).json({ message: "Privacy Policy not found" });
    }
    res.json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Privacy Policy
const updatePrivacyPolicy = async (req, res) => {
  try {
    const policy = await PrivacyPolicy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!policy) {
      return res.status(404).json({ message: "Privacy Policy not found" });
    }
    res.json(policy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Privacy Policy
const deletePrivacyPolicy = async (req, res) => {
  try {
    const policy = await PrivacyPolicy.findByIdAndDelete(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: "Privacy Policy not found" });
    }
    res.json({ message: "Privacy Policy deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPrivacyPolicy,
  getPrivacyPolicy,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
};
