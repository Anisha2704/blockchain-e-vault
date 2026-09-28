# Blockchain-Based Secure Document Verification & E-Vault

A full-stack, production-grade digital document vault that leverages **Ethereum Smart Contracts (Solidity + Hardhat)** and **SHA-256 Cryptographic Fingerprinting** to guarantee document authenticity and detect tamper attempts.

---

## 1. Project Overview
In traditional document management systems, central databases can be compromised, and digital certificates (PDFs, images) can be easily edited or falsified using software. 

This project solves document counterfeiting by combining off-chain document storage with on-chain cryptographic proofs:
- **No raw file is ever uploaded to the blockchain** (preserving privacy and keeping gas fees minimal).
- **SHA-256 hashes** calculated from original document file bytes are immutably stored in a Solidity smart contract.
- Any verifier can upload a document copy to verify its SHA-256 fingerprint against the smart contract proof.

---

## 2. Features
- 🔐 **User Authentication**: Secure JWT-based authentication with bcrypt password hashing.
- 📜 **Solidity Smart Contract Registry**: Stores `(documentId, documentHash, owner, timestamp)` immutably.
- ⚡ **SHA-256 Cryptographic Hashing**: Hashes raw file bytes using Node.js native `crypto` module.
- 🛡️ **Tamper Detection**: Detects any file alteration down to a single byte/pixel.
- 🌐 **Public Verification Portal**: Verify document copies publicly without requiring user login.
- 💼 **Personal Document Vault**: Search, filter, view, and manage uploaded certificates and legal documents.
- 🦊 **Optional MetaMask Integration**: Connect browser Web3 wallets easily.
- 🎨 **Modern Glassmorphism UI**: Built with React, Tailwind CSS, Lucide icons, and Recharts.

---

## 3. Architecture

```
[React Frontend] ──REST API──► [Express Backend] ──Mongoose──► [MongoDB]
                                      │
                                  ethers.js
                                      │
                                      ▼
                        [Hardhat Ethereum Node]
                      (Solidity DocumentRegistry)
```

---

## 4. Technology Stack
- **Frontend**: React (Vite), JavaScript (ES6+), React Router v6, Tailwind CSS, Axios, Lucide React, Recharts.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, Multer, ethers.js, dotenv, cors, helmet, express-rate-limit.
- **Blockchain**: Solidity 0.8.20, Hardhat local Ethereum node, ethers.js.

---

## 5. Folder Structure

```
blockchain-e-vault/
├── frontend/             # React Vite Application
├── backend/              # Node.js Express REST API & Multer Storage
├── blockchain/           # Hardhat Environment, Solidity Contracts & Tests
├── docs/                 # System Architecture & Flow Guides
├── package.json          # Root Monorepo Scripts
├── .gitignore
└── README.md
```

---

## 6. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Installed locally or a MongoDB Atlas URI string
- **Git**

---

## 7. Installation

Clone or extract the project, then install dependencies for all modules:

```bash
# Navigate into project directory
cd blockchain-e-vault

# Install root dependencies
npm install

# Install dependencies for submodules
npm --prefix blockchain install
npm --prefix backend install
npm --prefix frontend install
```

---

## 8. Environment Variables

### Backend Configuration (`backend/.env`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/blockchain_evault
JWT_SECRET=super_secret_jwt_key_blockchain_evault_2026
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
BLOCKCHAIN_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
CONTRACT_ADDRESS=
```

### Frontend Configuration (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 9. MongoDB Setup
Ensure local MongoDB service is running:
```bash
# Windows Command Prompt / PowerShell
mongod --dbpath C:\data\db
```
*(Or use standard MongoDB Atlas URI in `backend/.env`)*.

---

## 10. Hardhat Setup & Smart Contract Compile

Compile the Solidity smart contract:
```bash
npm run compile
```

Run smart contract unit tests:
```bash
npm run test:contracts
```

---

## 11. MetaMask Setup (Optional)
1. Install MetaMask extension in Chrome/Brave/Edge.
2. Add Custom Network:
   - Network Name: Hardhat Localhost
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: ETH
3. Import Account using Account #0 Private Key:
   `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

---

## 12. Smart Contract Deployment

Start local Hardhat Ethereum node:
```bash
npm run node
```

In a new terminal, deploy smart contract:
```bash
npm run deploy
```
*(This automatically deploys `DocumentRegistry.sol` and exports its contract address & ABI to `backend/src/config/contractDetails.json`)*.

---

## 13. Backend Setup
Run backend tests:
```bash
npm run test:backend
```

Start backend API server:
```bash
npm run server
```

---

## 14. Frontend Setup
Start Vite frontend dev server:
```bash
npm run client
```

---

## 15. Running the Complete Application

To launch everything together:

1. **Terminal 1 (Blockchain Node)**:
   ```bash
   npm run node
   ```

2. **Terminal 2 (Deploy Contract once node is ready)**:
   ```bash
   npm run deploy
   ```

3. **Terminal 3 (Full Stack Servers)**:
   ```bash
   npm run dev
   ```

Open browser at: `http://localhost:3000`

---

## 16. API Documentation Overview
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Authenticate user
- `POST /api/documents` - Upload & register document on blockchain
- `GET /api/documents` - Fetch user vault documents
- `POST /api/verification/verify` - Publicly verify file copy against smart contract proof

*(See full details in `docs/api-documentation.md`)*.

---

## 17. Blockchain Verification Flow
```
Upload Document ──► Compute SHA-256 Hash ──► Register Hash in Solidity ──► Immutable On-Chain Record
                                                                                  │
Verify Document ──► Compute SHA-256 Hash ──► Fetch On-Chain Hash ◄───────── Compare ──► Match / Mismatch
```
*(See diagram in `docs/blockchain-flow.md`)*.

---

## 18. Security Considerations
- **Zero Raw File On-Chain Policy**: Files are stored off-chain only.
- **SHA-256 Byte Fingerprinting**: Hashing is executed on actual file binary streams.
- **JWT & bcryptjs**: Password hashes are salted with factor 10.
- **Helmet & Rate Limiting**: Protection against brute-force and header vulnerabilities.

---

## 19. Limitations
- Local file storage is used for this demonstration project; cloud S3 storage is recommended for production.
- Gas fees are paid by the backend system signer so standard users do not require ETH balance.

---

## 20. Future Enhancements
- IPFS / Filecoin decentralized storage integration.
- Multi-signature document authorization for legal contracts.
- QR Code generation for instant physical document scanning.
