const express = require('express');
const router = express.Router();
const slideshowController = require('../controllers/slideshowController');

// Upload middleware
router.post(
  '/',
  slideshowController.uploadSlideshowImage,
  slideshowController.addSlideshow
);

router.get('/', slideshowController.getSlideshows);
router.get('/:id', slideshowController.getSlideshowById);

router.put(
  '/:id',
  slideshowController.uploadSlideshowImage,
  slideshowController.updateSlideshow
);

router.delete('/:id', slideshowController.deleteSlideshow);

module.exports = router;
