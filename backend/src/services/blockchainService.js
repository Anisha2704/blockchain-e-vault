const { ethers } = require('ethers');
const getContractConfig = require('../config/blockchain');

/**
 * Initializes and returns the ethers contract instance with a signer.
 */
const getContract = () => {
  const { rpcUrl, privateKey, contractAddress, contractAbi } = getContractConfig();

  if (!contractAddress) {
    throw new Error('Contract address not found. Please deploy the smart contract first via "npm run deploy" in the root directory.');
  }

  if (!contractAbi) {
    throw new Error('Contract ABI not found. Please compile the smart contract first.');
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  return new ethers.Contract(contractAddress, contractAbi, signer);
};

/**
 * Register a document hash on the Ethereum smart contract.
 * @param {string} documentId 
 * @param {string} documentHash 
 * @returns {Promise<{txHash: string, timestamp: Date, ownerAddress: string}>}
 */
const registerDocumentOnChain = async (documentId, documentHash) => {
  try {
    const contract = getContract();
    
    // Call contract method
    const tx = await contract.registerDocument(documentId, documentHash);
    const receipt = await tx.wait();

    // Fetch block to get actual block timestamp
    const provider = contract.runner.provider;
    const block = await provider.getBlock(receipt.blockNumber);
    const timestamp = block ? new Date(block.timestamp * 1000) : new Date();

    return {
      txHash: receipt.hash,
      timestamp: timestamp,
      ownerAddress: contract.runner.address
    };
  } catch (error) {
    console.error('❌ Error registering document on blockchain:', error);
    if (error.code === 'ECONNREFUSED' || (error.message && error.message.includes('ECONNREFUSED'))) {
      throw new Error('Hardhat node is offline at http://127.0.0.1:8545. Please start the node with "npm run node" and deploy the contract using "npm run deploy".');
    }
    throw new Error(`Blockchain registration failed: ${error.reason || error.message}`);
  }
};

/**
 * Verify a document hash against the stored blockchain record.
 * @param {string} documentId 
 * @param {string} documentHash 
 * @returns {Promise<{isMatch: boolean, timestamp: Date, ownerAddress: string, originalHash: string}>}
 */
const verifyDocumentOnChain = async (documentId, documentHash) => {
  try {
    const contract = getContract();
    const result = await contract.verifyDocument(documentId, documentHash);

    const isMatch = result[0]; // bool isValid
    const rawTimestamp = Number(result[1]); // uint256 timestamp
    const ownerAddress = result[2]; // address owner
    const originalHash = result[3]; // string originalHash

    return {
      isMatch,
      timestamp: new Date(rawTimestamp * 1000),
      ownerAddress,
      originalHash
    };
  } catch (error) {
    console.error('❌ Error verifying document on blockchain:', error);
    if (error.code === 'ECONNREFUSED' || (error.message && error.message.includes('ECONNREFUSED'))) {
      throw new Error('Hardhat node is offline at http://127.0.0.1:8545. Please start the node with "npm run node".');
    }
    throw new Error(`Blockchain verification query failed: ${error.reason || error.message}`);
  }
};

/**
 * Fetch document record from the blockchain smart contract.
 * @param {string} documentId 
 */
const getDocumentFromChain = async (documentId) => {
  try {
    const contract = getContract();
    const result = await contract.getDocument(documentId);
    return {
      documentId: result[0],
      documentHash: result[1],
      ownerAddress: result[2],
      timestamp: new Date(Number(result[3]) * 1000),
      isRegistered: result[4]
    };
  } catch (error) {
    console.error('❌ Error getting document from blockchain:', error);
    if (error.code === 'ECONNREFUSED' || (error.message && error.message.includes('ECONNREFUSED'))) {
      throw new Error('Hardhat node is offline at http://127.0.0.1:8545. Please start the node with "npm run node".');
    }
    throw new Error(`Blockchain fetch failed: ${error.reason || error.message}`);
  }
};

module.exports = {
  registerDocumentOnChain,
  verifyDocumentOnChain,
  getDocumentFromChain
};
