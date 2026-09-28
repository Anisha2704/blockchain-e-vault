const crypto = require('crypto');
const fs = require('fs');

/**
 * Calculates SHA-256 hash of a file at given filePath
 * @param {string} filePath - Absolute path to the local file
 * @returns {Promise<string>} Hexadecimal SHA-256 hash string
 */
const generateFileHash = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);

      stream.on('data', (data) => {
        hash.update(data);
      });

      stream.on('end', () => {
        const hexHash = hash.digest('hex');
        resolve(hexHash);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Calculates SHA-256 hash from a Buffer (in-memory file content)
 * @param {Buffer} buffer 
 * @returns {string} Hexadecimal SHA-256 hash string
 */
const generateBufferHash = (buffer) => {
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  return hash.digest('hex');
};

module.exports = {
  generateFileHash,
  generateBufferHash
};
