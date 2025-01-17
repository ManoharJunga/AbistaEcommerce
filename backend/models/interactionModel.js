const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  page: { type: String, required: true },
  timeSpent: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  searchQuery: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
  sessionId: { type: String }, // Unique session ID for tracking sessions and website visits
  pageViews: { type: Number, default: 1 }, // Track the number of page views
});

const Interaction = mongoose.model('Interaction', interactionSchema);

module.exports = Interaction;
