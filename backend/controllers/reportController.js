// controllers/reportController.js
const Interaction = require('../models/interactionModel');
const Customer = require('../models/customerModel');

// Get Dashboard Report
exports.getDashboardReport = async (req, res) => {
  try {
    // Aggregate data for the report
    const totalInteractions = await Interaction.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const topPages = await Interaction.aggregate([
      { $group: { _id: '$page', visits: { $sum: 1 }, totalTime: { $sum: '$timeSpent' } } },
      { $sort: { visits: -1 } },
      { $limit: 5 }
    ]);

    const topSearchQueries = await Interaction.aggregate([
      { $match: { searchQuery: { $ne: '' } } },
      { $group: { _id: '$searchQuery', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const averageTimePerPage = await Interaction.aggregate([
      { $group: { _id: '$page', averageTime: { $avg: '$timeSpent' } } },
      { $sort: { averageTime: -1 } },
      { $limit: 5 }
    ]);

    // Prepare the report
    const report = {
      totalInteractions,
      totalCustomers,
      topPages,
      topSearchQueries,
      averageTimePerPage,
    };

    res.status(200).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
