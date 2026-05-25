const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

const extractTextFromImage = async (filePath) => {
  const result = await Tesseract.recognize(filePath, 'eng', {
    logger: () => {},
  });
  return result.data.text || '';
};

const extractTextFromFile = async (document) => {
  if (!document) return '';
  const ext = path.extname(document.path).toLowerCase();
  if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    return extractTextFromImage(document.path);
  }

  if (['.txt', '.md', '.csv', '.json'].includes(ext)) {
    return fs.readFileSync(document.path, 'utf-8');
  }

  if (ext === '.pdf') {
    const pdfjsLib = require('pdf-parse');
    const fileBuffer = fs.readFileSync(document.path);
    const data = await pdfjsLib(fileBuffer);
    return data.text || '';
  }

  if (ext === '.docx') {
    const mammoth = require('mammoth');
    const fileBuffer = fs.readFileSync(document.path);
    const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
    return value || '';
  }

  if (['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac'].includes(ext)) {
    return `Audio file metadata: name=${document.originalName || path.basename(document.path)}, type=${document.mimetype}, size=${document.size || 'unknown'} bytes.`;
  }

  if (['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv'].includes(ext)) {
    return `Video file metadata: name=${document.originalName || path.basename(document.path)}, type=${document.mimetype}, size=${document.size || 'unknown'} bytes.`;
  }

  return `File metadata: name=${document.originalName || path.basename(document.path)}, type=${document.mimetype}, size=${document.size || 'unknown'} bytes.`;
};

module.exports = { extractTextFromFile };
