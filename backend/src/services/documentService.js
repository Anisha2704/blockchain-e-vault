const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const { generateFileHash } = require('./hashService');
const { registerDocumentOnChain } = require('./blockchainService');

/**
 * Handles creation of a new document, computing SHA-256 hash, saving to MongoDB, and registering on Blockchain.
 */
const createDocument = async ({ user, title, description, category, file }) => {
  const filePath = file.path;
  
  // 1. Calculate SHA-256 hash from file content
  const sha256Hash = await generateFileHash(filePath);

  // 2. Generate unique document ID (e.g. DOC-TIMESTAMP-RANDOM)
  const timestamp = Date.now();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const blockchainDocumentId = `DOC-${timestamp}-${randomSuffix}`;

  // 3. Save initial metadata in MongoDB
  let document;
  try {
    document = await Document.create({
      user: user._id,
      title,
      description,
      category,
      originalFileName: file.originalname,
      storedFileName: file.filename,
      filePath: file.path,
      fileType: file.mimetype,
      fileSize: file.size,
      sha256Hash,
      blockchainDocumentId,
      ownerWalletAddress: user.walletAddress || '',
      status: 'Registered'
    });
  } catch (dbErr) {
    // If DB save fails, clean up local file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(`Database error saving document: ${dbErr.message}`);
  }

  // 4. Register on Smart Contract
  try {
    const chainResult = await registerDocumentOnChain(blockchainDocumentId, sha256Hash);

    // Update document record with transaction hash and chain timestamp
    document.blockchainTransactionHash = chainResult.txHash;
    document.blockchainTimestamp = chainResult.timestamp;
    if (chainResult.ownerAddress && !document.ownerWalletAddress) {
      document.ownerWalletAddress = chainResult.ownerAddress;
    }
    await document.save();

    return document;
  } catch (chainErr) {
    // If blockchain registration fails, mark state clearly or clean up
    console.error('❌ Blockchain registration failed for document:', document._id, chainErr.message);
    document.status = 'Verification Failed';
    document.description += ` [Blockchain Registration Warning: ${chainErr.message}]`;
    await document.save();

    throw new Error(`Document saved locally, but blockchain registration failed: ${chainErr.message}`);
  }
};

/**
 * Fetch documents for a user with optional search, category filter, and pagination.
 */
const getUserDocuments = async (userId, { search, category, page = 1, limit = 20 }) => {
  const query = { user: userId };

  if (category && category !== 'All') {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { originalFileName: { $regex: search, $options: 'i' } },
      { blockchainDocumentId: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const documents = await Document.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Document.countDocuments(query);

  return {
    documents,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    }
  };
};

module.exports = {
  createDocument,
  getUserDocuments
};
