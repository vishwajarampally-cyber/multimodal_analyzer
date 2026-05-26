const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  summary: String,
  keywords: [String],
  entities: [String],
  sentiment: String,
  insights: [String],
  topQuestions: [String],
  metadata: mongoose.Schema.Types.Mixed,
});

const documentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  text: { type: String, default: '' },
  analysis: analysisSchema,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Document', documentSchema);
