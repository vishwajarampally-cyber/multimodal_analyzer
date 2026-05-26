const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const { extractTextFromFile } = require('../services/ocrService');
const { analyzeText } = require('../services/grokService');

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const extractedText = await extractTextFromFile(req.file);
    const textFallback = extractedText || `File metadata: name=${req.file.originalname}, type=${req.file.mimetype}, size=${req.file.size} bytes.`;
    const analysis = await analyzeText(textFallback);

    const document = await Document.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      text: extractedText,
      analysis,
    });

    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
};

const listDocuments = async (req, res) => {
  const search = req.query.search || '';
  const filter = {};
  if (search) {
    filter.$or = [
      { originalName: { $regex: search, $options: 'i' } },
      { 'analysis.summary': { $regex: search, $options: 'i' } },
    ];
  }

  const documents = await Document.find(filter).sort({ createdAt: -1 }).limit(50);
  res.json(documents);
};

const getDocument = async (req, res) => {
  const document = await Document.findById(req.params.id);
  if (!document) return res.status(404).json({ message: 'Document not found' });
  res.json(document);
};

const deleteDocument = async (req, res) => {
  const document = await Document.findByIdAndDelete(req.params.id);
  if (!document) return res.status(404).json({ message: 'Document not found' });
  if (fs.existsSync(document.path)) {
    fs.unlinkSync(document.path);
  }
  res.json({ message: 'Document deleted' });
};

const refreshAnalysis = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    const extractedText = fs.existsSync(document.path)
      ? await extractTextFromFile(document)
      : document.text;
    const textFallback = extractedText || `File metadata: name=${document.originalName}, type=${document.mimetype}, size=${document.size} bytes.`;
    const analysis = await analyzeText(textFallback);

    document.text = extractedText;
    document.analysis = analysis;
    await document.save();
    res.json(document);
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadDocument, listDocuments, getDocument, deleteDocument, refreshAnalysis };
