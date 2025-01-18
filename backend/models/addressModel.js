const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer ID is required'],
  },
  addressLine1: { 
    type: String, 
    required: [true, "Address Line 1 is required"], 
    trim: true, 
    minlength: [5, "Address Line 1 must be at least 5 characters long"] 
  },
  addressLine2: { 
    type: String, 
    trim: true, 
    maxlength: [100, "Address Line 2 cannot exceed 100 characters"] 
  },
  city: { 
    type: String, 
    required: [true, "City is required"], 
    trim: true 
  },
  state: { 
    type: String, 
    required: [true, "State is required"], 
    trim: true 
  },
  postalCode: { 
    type: String, 
    required: [true, "Postal Code is required"], 
    match: [/^\d{6}$/, "Postal Code must be a valid 6-digit format"] 
  },
  country: { 
    type: String, 
    required: [true, "Country is required"], 
    trim: true,
    default: 'India'
  },
  isDefault: { 
    type: Boolean, 
    default: false 
  },
});

module.exports = mongoose.model('Address', AddressSchema);
