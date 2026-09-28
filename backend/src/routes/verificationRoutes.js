const express = require('express');
const router = express.Router();
const { verifyDocument, getVerificationInfo } = require('../controllers/verificationController');
const upload = require('../middleware/uploadMiddleware');

router.post('/verify', upload.single('file'), verifyDocument);
router.get('/:documentId', getVerificationInfo);

module.exports = router;
