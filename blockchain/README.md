# Blockchain Module - Smart Contracts

This folder contains the Solidity smart contract, deployment scripts, and unit tests using Hardhat.

## Contract Overview: `DocumentRegistry.sol`
- Stores document ID, SHA-256 hash, owner wallet address, and timestamp.
- Ensures document hashes are stored immutably on-chain.
- Does NOT store document file contents (to save gas and preserve confidentiality).

## Commands
- `npm run compile` - Compile Solidity contracts
- `npm run test` - Run smart contract unit tests
- `npm run node` - Start local Hardhat Ethereum node
- `npm run deploy` - Deploy contract to local Hardhat node
