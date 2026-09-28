const fs = require('fs');
const path = require('path');

const getContractConfig = () => {
  let contractAddress = process.env.CONTRACT_ADDRESS || '';
  let contractAbi = null;

  try {
    const detailsPath = path.join(__dirname, 'contractDetails.json');
    if (fs.existsSync(detailsPath)) {
      const details = JSON.parse(fs.readFileSync(detailsPath, 'utf8'));
      if (!contractAddress && details.address) {
        contractAddress = details.address;
      }
      if (details.abi) {
        contractAbi = details.abi;
      }
    }
  } catch (err) {
    console.warn('⚠️ Could not load contractDetails.json:', err.message);
  }

  return {
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545',
    privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    contractAddress: contractAddress,
    contractAbi: contractAbi
  };
};

module.exports = getContractConfig;
