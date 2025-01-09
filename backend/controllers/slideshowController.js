const Slideshow = require('../models/slideshowModel'); // Import Slideshow Model
const {uploadSlideshowImage} = require('../config/multer'); // Import multer configuration

exports.uploadSlideshowImage = uploadSlideshowImage.single('image');

// Add a New Slideshow
exports.addSlideshow = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required!' });
    }

    const slideshow = new Slideshow({
      name: req.body.name,
      title: req.body.title,
      tags: req.body.tags,
      image: req.file.path, // Cloudinary URL
    });

    await slideshow.save();
    res.status(201).json(slideshow);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Slideshows
exports.getSlideshows = async (req, res) => {
  try {
    const slideshows = await Slideshow.find(); // Fetch all slideshows
    res.status(200).json(slideshows); // Return slideshows
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get Single Slideshow by ID
exports.getSlideshowById = async (req, res) => {
  try {
    const slideshow = await Slideshow.findById(req.params.id);
    if (!slideshow) {
      return res.status(404).json({ message: 'Slideshow not found!' });
    }
    res.status(200).json(slideshow);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a Slideshow
exports.deleteSlideshow = async (req, res) => {
  try {
    const slideshow = await Slideshow.findByIdAndDelete(req.params.id);
    if (!slideshow) {
      return res.status(404).json({ message: 'Slideshow not found!' });
    }
    res.status(200).json({ message: 'Slideshow deleted successfully!' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
