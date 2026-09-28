const fs = require('fs');
const Document = require('../models/Document');
const { createDocument, getUserDocuments } = require('../services/documentService');

/**
 * @desc    Upload document, compute SHA-256 hash & register on blockchain
 * @route   POST /api/documents
 * @access  Private
 */
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a document file' });
    }

    const { title, description, category } = req.body;

    if (!title) {
      // Cleanup file if title missing
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ success: false, message: 'Please provide a document title' });
    }

    const newDocument = await createDocument({
      user: req.user,
      title,
      description: description || '',
      category: category || 'Certificate',
      file: req.file
    });

    return res.status(201).json({
      success: true,
      message: 'Document uploaded and registered on blockchain successfully',
      data: newDocument
    });
  } catch (error) {
    // Ensure uploaded temporary file is removed on controller error
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    next(error);
  }
};

/**
 * @desc    Get user's documents with search, category filter & pagination
 * @route   GET /api/documents
 * @access  Private
 */
const getDocuments = async (req, res, next) => {
  try {
    const { search, category, page, limit } = req.query;
    const result = await getUserDocuments(req.user._id, { search, category, page, limit });

    return res.json({
      success: true,
      data: result.documents,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single document details by ID
 * @route   GET /api/documents/:id
 * @access  Private
 */
const getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Check ownership or admin
    if (document.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this document' });
    }

    return res.json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete document locally from server & DB
 * @route   DELETE /api/documents/:id
 * @access  Private
 */
const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Authorization check
    if (document.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this document' });
    }

    // Delete file from local filesystem if exists
    if (fs.existsSync(document.filePath)) {
      try {
        fs.unlinkSync(document.filePath);
      } catch (fileErr) {
        console.warn('Could not remove file from disk:', fileErr.message);
      }
    }

    // Remove DB record
    await Document.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: 'Document deleted from application storage. Note: Blockchain audit record remains immutable on-chain.',
      blockchainNote: 'The cryptographic proof on the blockchain cannot be deleted or mutated.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument
};
