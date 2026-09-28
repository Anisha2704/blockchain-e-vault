const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_blockchain_evault_2026', {
    expiresIn: '30d'
  });
};

module.exports = generateToken;
