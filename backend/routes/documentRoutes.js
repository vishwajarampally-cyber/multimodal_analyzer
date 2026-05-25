const express = require('express');
const upload = require('../utils/fileStorage');
const { uploadDocument, listDocuments, getDocument, deleteDocument, refreshAnalysis } = require('../controllers/documentController');
const router = express.Router();

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', listDocuments);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);
router.post('/:id/analyze', refreshAnalysis);

module.exports = router;
