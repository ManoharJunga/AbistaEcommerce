const express = require('express');
const router = express.Router();
const {
  addSlideshow,
  getSlideshows,
  getSlideshowById,
  deleteSlideshow,
  uploadSlideshowImage,
} = require('../controllers/slideshowController');

// Routes for slideshows
router.post('/', uploadSlideshowImage, addSlideshow); // Add a new slideshow with image
router.get('/', getSlideshows); // Get all slideshows
router.get('/:id', getSlideshowById); // Get slideshow by ID
router.delete('/:id', deleteSlideshow); // Delete slideshow by ID

module.exports = router;
