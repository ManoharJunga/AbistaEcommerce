const express = require('express');
const router = express.Router();

// Controllers for notification-related actions
const { createNotification, getNotifications } = require('../controllers/notificationController');

// Define notification-related routes
router.post('/', createNotification); // Create a new notification
router.get('/', getNotifications); // Get all notifications

module.exports = router;
