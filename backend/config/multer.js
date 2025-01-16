const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary'); // Cloudinary configuration

const getCloudinaryStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder, // Dynamic folder name
      allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed image formats
    },
  });
};

const getMulterUpload = (folder) => {
  const storage = getCloudinaryStorage(folder);
  return multer({ storage });
};

module.exports = {
  uploadProductImage: getMulterUpload('ecommerce/products'),
  uploadCategoryImage: getMulterUpload('ecommerce/categories'),
  uploadSubCategoryImage: getMulterUpload('ecommerce/subcategories'),
  uploadProjectImage: getMulterUpload('ecommerce/projects'),
  uploadSlideshowImage: getMulterUpload('ecommerce/slideshows'),
  uploadCardImage: getMulterUpload('ecommerce/cards'), 
};
