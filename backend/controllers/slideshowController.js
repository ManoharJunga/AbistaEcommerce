const Slideshow = require('../models/slideshowModel'); 
const { uploadSlideshowImage } = require('../config/multer'); 

// Middleware for handling image upload
exports.uploadSlideshowImage = uploadSlideshowImage.single('image');

// Add a New Slideshow
exports.addSlideshow = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required!' });
    }

    const slideshow = new Slideshow({
      subtitle: req.body.subtitle,
      title: req.body.title,
      description: req.body.description,
      ctaText: req.body.ctaText || "Shop Now",
      ctaLink: req.body.ctaLink || "/",
      tags: req.body.tags,
      image: req.file.path, // Cloudinary URL or local path
      order: req.body.order || 0,
    });

    await slideshow.save();
    res.status(201).json(slideshow);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Slideshows (sorted by order)
exports.getSlideshows = async (req, res) => {
  try {
    const slideshows = await Slideshow.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json(slideshows);
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

// Update a Slideshow
exports.updateSlideshow = async (req, res) => {
  try {
    const updateData = {
      subtitle: req.body.subtitle,
      title: req.body.title,
      description: req.body.description,
      ctaText: req.body.ctaText,
      ctaLink: req.body.ctaLink,
      tags: req.body.tags,
      order: req.body.order,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const slideshow = await Slideshow.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

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
