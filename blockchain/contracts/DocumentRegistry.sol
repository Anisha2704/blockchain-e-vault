// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DocumentRegistry
 * @dev Secure registry for storing document cryptographic hashes and metadata on-chain.
 * Files themselves are NEVER stored on-chain to save gas and maintain confidentiality.
 */
contract DocumentRegistry {
    
    struct DocumentRecord {
        string documentId;
        string documentHash;
        address owner;
        uint256 timestamp;
        bool isRegistered;
    }

    // Mapping from document ID string to DocumentRecord
    mapping(string => DocumentRecord) private _documents;
    
    // Total count of registered documents
    uint256 public totalDocuments;

    // Events
    event DocumentRegistered(
        string indexed docIdHash,
        string documentId,
        string documentHash,
        address indexed owner,
        uint256 timestamp
    );

    /**
     * @dev Registers a new document hash on the blockchain.
     * @param documentId Unique identifier for the document
     * @param documentHash Cryptographic SHA-256 hash of the document content
     */
    function registerDocument(string memory documentId, string memory documentHash) public {
        require(bytes(documentId).length > 0, "Document ID cannot be empty");
        require(bytes(documentHash).length > 0, "Document hash cannot be empty");
        require(!_documents[documentId].isRegistered, "Document ID already registered");

        _documents[documentId] = DocumentRecord({
            documentId: documentId,
            documentHash: documentHash,
            owner: msg.sender,
            timestamp: block.timestamp,
            isRegistered: true
        });

        totalDocuments++;

        emit DocumentRegistered(
            documentId,
            documentId,
            documentHash,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @dev Checks whether a document ID is registered.
     */
    function documentExists(string memory documentId) public view returns (bool) {
        return _documents[documentId].isRegistered;
    }

    /**
     * @dev Retrieves document details by document ID.
     */
    function getDocument(string memory documentId) public view returns (
        string memory docId,
        string memory docHash,
        address owner,
        uint256 timestamp,
        bool isRegistered
    ) {
        require(_documents[documentId].isRegistered, "Document not found");
        DocumentRecord memory doc = _documents[documentId];
        return (doc.documentId, doc.documentHash, doc.owner, doc.timestamp, doc.isRegistered);
    }

    /**
     * @dev Verifies an uploaded document hash against the stored blockchain hash.
     * @param documentId Unique identifier for the document
     * @param documentHash Hash of the document to verify
     */
    function verifyDocument(string memory documentId, string memory documentHash) public view returns (
        bool isValid,
        uint256 timestamp,
        address owner,
        string memory originalHash
    ) {
        require(_documents[documentId].isRegistered, "Document not found on-chain");
        DocumentRecord memory doc = _documents[documentId];
        
        bool isMatch = keccak256(bytes(doc.documentHash)) == keccak256(bytes(documentHash));
        return (isMatch, doc.timestamp, doc.owner, doc.documentHash);
    }
}

