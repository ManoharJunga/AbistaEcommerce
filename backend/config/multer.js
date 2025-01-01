const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce/products', // Folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed formats
  },
});

// Initialize multer with Cloudinary storage
const upload = multer({ storage });

module.exports = upload;
