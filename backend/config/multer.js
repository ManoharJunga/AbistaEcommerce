const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary'); // Assuming Cloudinary config is in a separate file

// Function to configure Cloudinary storage dynamically
const getCloudinaryStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder, // Dynamic folder name for different use cases
      allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed image formats
    },
  });
};

// Function to initialize multer for a specific folder
const getMulterUpload = (folder) => {
  const storage = getCloudinaryStorage(folder);
  return multer({ storage });
};

// Export multer configurations for different use cases
module.exports = {
  uploadProductImage: getMulterUpload('ecommerce/products'),
  uploadCategoryImage: getMulterUpload('ecommerce/categories'),
  uploadSubCategoryImage: getMulterUpload('ecommerce/subcategories'),
};
