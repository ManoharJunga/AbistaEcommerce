const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
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
    match: [/^\d{5}(-\d{4})?$/, "Postal Code must be a valid format (e.g., 12345 or 12345-6789)"] 
  },
  country: { 
    type: String, 
    required: [true, "Country is required"], 
    trim: true 
  },
  isDefault: { 
    type: Boolean, 
    default: false 
  },
});

module.exports = mongoose.model('Address', AddressSchema);
