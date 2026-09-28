const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a document title'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Certificate', 'Identity', 'Experience', 'Achievement', 'Legal', 'Other'],
      default: 'Certificate',
      index: true
    },
    originalFileName: {
      type: String,
      required: true
    },
    storedFileName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    sha256Hash: {
      type: String,
      required: true
    },
    blockchainDocumentId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    blockchainTransactionHash: {
      type: String,
      default: ''
    },
    blockchainTimestamp: {
      type: Date
    },
    ownerWalletAddress: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Registered', 'Verified', 'Verification Failed'],
      default: 'Registered'
    }
  },
  {
    timestamps: true
  }
);

documentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Document', documentSchema);
