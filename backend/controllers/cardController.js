const Card = require('../models/cardModel'); // Import Card model
const upload = require('../config/multer'); // Correct import for multer configuration

// Upload a single card image
exports.uploadCardImage = upload.uploadCardImage.single('image');

// Add Card
exports.addCard = async (req, res) => {
  try {
    // Check if the image is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded!' });
    }

    // Process the card data (Assuming the form has other fields)
    const cardData = {
      mainHeader: req.body.mainHeader,
      description: req.body.description,
      image: req.file.path, // Cloudinary URL for the uploaded image
    };

    const card = new Card(cardData);
    await card.save();

    res.status(201).json({
      message: 'Card added successfully!',
      card,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Get All Cards
exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find(); // Fetch all cards
    res.status(200).json(cards); // Return cards
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get Single Card by ID
exports.getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found!' });
    }
    res.status(200).json(card);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a Card
exports.updateCard = async (req, res) => {
  try {
    const { mainHeader, description } = req.body;
    const image = req.file ? req.file.path : null;

    const updatedFields = { mainHeader, description };
    if (image) updatedFields.image = image;

    const updatedCard = await Card.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    if (!updatedCard) {
      return res.status(404).json({ message: 'Card not found!' });
    }

    res.status(200).json({
      message: 'Card updated successfully!',
      updatedCard,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a Card
exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found!' });
    }
    res.status(200).json({ message: 'Card deleted successfully!' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
