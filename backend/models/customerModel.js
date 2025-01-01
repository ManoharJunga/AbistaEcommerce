const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CustomerSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    emailVerified: { type: Boolean, default: false },
    phoneNumber: { type: String, required: true, unique: true, match: /^[0-9]{10}$/ },
    phoneVerified: { type: Boolean, default: false },
    profilePicture: { type: String }, // URL to the profile picture
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist' }],
    paymentMethods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
    recentlyViewedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RecentlyViewed' }],
    password: { type: String, required: true },
    twoFactorAuthEnabled: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, // For soft delete
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

// Password hashing
CustomerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Password comparison
CustomerSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Customer', CustomerSchema);
