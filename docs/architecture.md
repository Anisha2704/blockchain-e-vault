# System Architecture Overview

## Blockchain-Based Secure Document Verification & E-Vault

This project combines a classic MERN stack (MongoDB, Express, React, Node.js) with Ethereum Smart Contracts (Solidity + Hardhat) to achieve verifiable, tamper-evident document proof without compromising document privacy or inflating gas fees.

---

## 1. High-Level System Architecture

```
                                +-----------------------------------+
                                |          React Frontend           |
                                | (Vite, Tailwind, Axios, Lucide)  |
                                +-----------------+-----------------+
                                                  |
                                                  | REST API Requests
                                                  v
                                +-----------------+-----------------+
                                |         Express.js Backend        |
                                | (Auth, Hashing, Rate-Limit, JWT)  |
                                +----+------------------------+-----+
                                     |                        |
             SHA-256 Hash & Metadata |                        | Binary File Storage
                                     v                        v
            +------------------------+----+       +-----------+------------+
            |  Local Hardhat Blockchain   |       | Local File Storage / Uploads|
            | (Solidity DocumentRegistry) |       |  (S3 / Object Storage in   |
            +-----------------------------+       |        Production)         |
                                                  +------------------------+
                                                              |
                                                              v
                                                  +-----------+------------+
                                                  |    MongoDB Database    |
                                                  |  (Metadata & References)|
                                                  +------------------------+
```

---

## 2. Why Files Are NEVER Stored On-Chain

Storing raw document files (PDFs, images, scans) directly on an Ethereum blockchain is fundamentally flawed due to:
1. **Gas Cost & Storage Scalability**: Storing 1 MB of data on Ethereum costs thousands of dollars in gas fees.
2. **Confidentiality & Data Privacy**: Blockchains are public, immutable ledgers. Storing confidential user documents (IDs, legal papers) on-chain exposes sensitive personal data permanently.
3. **Immutability Conflict with GDPR**: Once data is written on a blockchain, it cannot be deleted.

### The Solution: Cryptographic Fingerprinting
Instead of storing files on-chain:
1. The backend calculates a **SHA-256 hash** directly from the raw file bytes (`hash = sha256(fileBytes)`).
2. Only the resulting **64-character hexadecimal hash** is saved on the Solidity smart contract.
3. The actual document file remains safely stored off-chain in encrypted local or object storage (AWS S3).

---

## 3. Key Components & Responsibilities

| Component | Technology | Primary Role |
| :--- | :--- | :--- |
| **Frontend** | React (Vite, JS, Tailwind) | Provides modern security UI, drag-and-drop file upload, verification interface, & dashboard metrics. |
| **Backend API** | Node.js, Express.js | Authenticates users, validates file uploads, computes SHA-256 hashes, interacts with smart contracts via `ethers.js`. |
| **Database** | MongoDB + Mongoose | Stores user accounts, document titles, categories, and references to uploaded files. |
| **Blockchain** | Solidity 0.8.20 + Hardhat | Maintains immutable audit logs of `(documentId, documentHash, owner, timestamp)` mapping. |
