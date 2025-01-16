// Import required modules
const express = require('express');
const dotenv = require('dotenv');

const cors = require('cors'); // Import the CORS middleware
const connectDB = require('./config/db');
const errorMiddleware = require('./middlewares/errorMiddleware');

// Import Routes
const addressRoutes = require('./routes/addressRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const recentlyViewedRoutes = require('./routes/recentlyViewedRoutes');
const productRoutes = require('./routes/productRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const otpRoutes = require('./routes/otpRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const projectRoutes = require('./routes/projectRoutes');
const costRoutes = require('./routes/costRoutes');
const subcategoryRoutes = require('./routes/subCategoryRoutes');
const slideshowRoutes = require('./routes/slideshowRoutes');
const cardRoutes = require('./routes/cardRoutes');

// Initialize express app
const app = express();

// Configure dotenv to load environment variables
dotenv.config();

// Middleware for parsing JSON
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: 'http://localhost:5173', // Allow only your React frontend
  }));
  
// Connect to MongoDB
connectDB();

// Register routes
app.use('/api/addresses', addressRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/recentlyviewed', recentlyViewedRoutes);
app.use('/api/products', productRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/otp', otpRoutes); // OTP route for customer verification
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', costRoutes);
app.use('/api/slideshow', slideshowRoutes);
app.use('/api/cards', cardRoutes);

// Error Middleware (to handle errors globally)
app.use(errorMiddleware);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
