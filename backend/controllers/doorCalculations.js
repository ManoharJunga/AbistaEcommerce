const Product = require('../models/productModel');

// Standard Sizes
const standardHeights = [72, 75, 78, 81, 84, 87, 90];
const standardWidths = [32, 34, 36, 38, 40, 42, 44];

// Find the next higher standard size
const findNextHigherStandardSize = (value, standardSizes) => {
    for (const size of standardSizes) {
        if (value <= size) {
            return size;
        }
    }
    return standardSizes[standardSizes.length - 1];
};

// Calculate cost function
const calculateCost = async (req, res) => {
    try {
        const { width, height, numberOfDoors, productName } = req.body;

        // Validate inputs
        if (isNaN(width) || isNaN(height) || isNaN(numberOfDoors) || !productName) {
            return res.status(400).json({ message: 'Invalid input data.' });
        }

        // Find product by name
        const product = await Product.findOne({ name: productName });
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Calculate dimensions
        const finalWidth = findNextHigherStandardSize(width, standardWidths);
        const finalHeight = findNextHigherStandardSize(height, standardHeights);

        // Calculate total cost
        const squareFeet = (finalWidth * finalHeight) / 144;
        const totalCost = Math.ceil(squareFeet * product.price * numberOfDoors);

        res.json({ totalCost });
    } catch (error) {
        console.error('Error calculating cost:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = {
    calculateCost,
};
