const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  type: { type: String, enum: ['OrderUpdate', 'Promotion', 'AccountAlert'], required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', NotificationSchema);
