const express = require('express');
const router = express.Router();
const {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/')
  .post(upload.single('file'), uploadDocument)
  .get(getDocuments);

router.route('/:id')
  .get(getDocumentById)
  .delete(deleteDocument);

module.exports = router;
