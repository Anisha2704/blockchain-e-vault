const fs = require('fs');
const Document = require('../models/Document');
const { generateFileHash } = require('../services/hashService');
const { verifyDocumentOnChain, getDocumentFromChain } = require('../services/blockchainService');

/**
 * @desc    Verify uploaded document against stored Blockchain hash
 * @route   POST /api/verification/verify
 * @access  Public
 */
const verifyDocument = async (req, res, next) => {
  let uploadedFilePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload the document file to verify' });
    }

    uploadedFilePath = req.file.path;
    const { documentId } = req.body;

    if (!documentId) {
      if (fs.existsSync(uploadedFilePath)) fs.unlinkSync(uploadedFilePath);
      return res.status(400).json({ success: false, message: 'Please provide the Document ID for verification' });
    }

    // 1. Calculate SHA-256 hash of the uploaded file
    const uploadedHash = await generateFileHash(uploadedFilePath);

    // Clean up temporary verification upload file
    if (fs.existsSync(uploadedFilePath)) {
      try { fs.unlinkSync(uploadedFilePath); } catch (e) {}
    }

    // 2. Fetch corresponding MongoDB document metadata (if present)
    const dbDoc = await Document.findOne({ blockchainDocumentId: documentId.trim() });

    // 3. Query Blockchain smart contract for verification
    let chainResult;
    try {
      chainResult = await verifyDocumentOnChain(documentId.trim(), uploadedHash);
    } catch (chainErr) {
      // Fallback: Check if document exists on chain or error was "not found"
      return res.status(404).json({
        success: false,
        verified: false,
        documentId: documentId,
        uploadedHash: uploadedHash,
        message: `Verification failed: ${chainErr.message}`
      });
    }

    const { isMatch, timestamp, ownerAddress, originalHash } = chainResult;

    if (isMatch) {
      return res.json({
        success: true,
        verified: true,
        documentId: documentId,
        uploadedHash: uploadedHash,
        blockchainHash: originalHash,
        message: 'Document Verified - Original. Hash matches the blockchain record.',
        details: {
          title: dbDoc ? dbDoc.title : 'Registered Document',
          category: dbDoc ? dbDoc.category : 'N/A',
          timestamp: timestamp,
          ownerWalletAddress: ownerAddress || (dbDoc ? dbDoc.ownerWalletAddress : ''),
          transactionHash: dbDoc ? dbDoc.blockchainTransactionHash : 'On-Chain Verified'
        }
      });
    } else {
      return res.json({
        success: true,
        verified: false,
        documentId: documentId,
        uploadedHash: uploadedHash,
        blockchainHash: originalHash,
        message: 'Document Verification Failed - Document may have been modified.',
        details: {
          title: dbDoc ? dbDoc.title : 'Registered Document',
          category: dbDoc ? dbDoc.category : 'N/A',
          timestamp: timestamp,
          ownerWalletAddress: ownerAddress,
          transactionHash: dbDoc ? dbDoc.blockchainTransactionHash : ''
        }
      });
    }
  } catch (error) {
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      try { fs.unlinkSync(uploadedFilePath); } catch (e) {}
    }
    next(error);
  }
};

/**
 * @desc    Get public metadata of a registered document by ID
 * @route   GET /api/verification/:documentId
 * @access  Public
 */
const getVerificationInfo = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const dbDoc = await Document.findOne({ blockchainDocumentId: documentId }).select('-filePath -user');

    let chainDoc = null;
    try {
      chainDoc = await getDocumentFromChain(documentId);
    } catch (e) {
      console.warn('Could not query chain directly for ID:', documentId);
    }

    if (!dbDoc && !chainDoc) {
      return res.status(404).json({ success: false, message: 'Document ID not found on record or blockchain' });
    }

    return res.json({
      success: true,
      data: {
        documentId: documentId,
        title: dbDoc ? dbDoc.title : 'Registered Document',
        category: dbDoc ? dbDoc.category : 'N/A',
        sha256Hash: chainDoc ? chainDoc.documentHash : (dbDoc ? dbDoc.sha256Hash : ''),
        ownerWalletAddress: chainDoc ? chainDoc.ownerAddress : (dbDoc ? dbDoc.ownerWalletAddress : ''),
        timestamp: chainDoc ? chainDoc.timestamp : (dbDoc ? dbDoc.blockchainTimestamp : null),
        transactionHash: dbDoc ? dbDoc.blockchainTransactionHash : '',
        status: dbDoc ? dbDoc.status : 'Registered'
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyDocument,
  getVerificationInfo
};
