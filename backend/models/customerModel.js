const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define Activity Schema for tracking customer insights
const ActivitySchema = new mongoose.Schema({
    page: { type: String, required: true }, // e.g., '/product/:id'
    clicks: { type: Number, default: 0 }, // Number of clicks on the page
    timeSpent: { type: Number, default: 0 }, // Time spent on the page in seconds
    timestamp: { type: Date, default: Date.now }, // When the activity occurred
});

// Define Customer Schema
const CustomerSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, // Basic email regex
    emailVerified: { type: Boolean, default: false },
    phoneNumber: { type: String, required: true, unique: true, match: /^[0-9]{10}$/ }, // 10-digit phone number
    phoneVerified: { type: Boolean, default: false },
    profilePicture: { type: String }, // URL to the profile picture
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist' }],
    paymentMethods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
    recentlyViewedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RecentlyViewed' }],
    password: { type: String, required: true }, // Hashed password
    twoFactorAuthEnabled: { type: Boolean, default: false }, // 2FA toggle
    isActive: { type: Boolean, default: true }, // For soft delete
    activityLogs: [ActivitySchema], // Embedded activity logs
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Middleware for password hashing
CustomerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10); // Hash password with salt rounds of 10
    next();
});

// Instance method for password comparison
CustomerSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password); // Compare entered password with hashed password
};

// Export the model
module.exports = mongoose.model('Customer', CustomerSchema);
