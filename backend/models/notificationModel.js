const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['OrderUpdate', 'Promotion', 'AccountAlert'], 
    required: [true, 'Notification type is required.'] 
  },
  message: { 
    type: String, 
    required: [true, 'Notification message is required.'], 
    trim: true,
    minlength: [5, 'Message must be at least 5 characters long.'],
    maxlength: [500, 'Message cannot exceed 500 characters.']
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  date: { 
    type: Date, 
    default: Date.now,
    validate: {
      validator: function (value) {
        return value <= Date.now(); // Ensure date is not in the future
      },
      message: 'Date cannot be in the future.'
    }
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);
