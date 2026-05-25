const express = require('express');
const Document = require('../models/Document');
const router = express.Router();

router.get('/dashboard', async (req, res) => {
  const totalUploads = await Document.countDocuments({});
  const recentUploads = await Document.find({}).sort({ createdAt: -1 }).limit(5);
  const byType = await Document.aggregate([
    { $group: { _id: '$mimetype', count: { $sum: 1 } } },
  ]);
  const sentimentCounts = await Document.aggregate([
    { $group: { _id: '$analysis.sentiment', count: { $sum: 1 } } },
  ]);

  res.json({ totalUploads, recentUploads, byType, sentimentCounts });
});

module.exports = router;
