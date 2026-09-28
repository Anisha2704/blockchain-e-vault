const test = require('node:test');
const assert = require('node:assert');
const { generateBufferHash } = require('../services/hashService');
const { isValidEmail, isValidFileType } = require('../utils/validators');

test('Validation Utilities - Email check', () => {
  assert.strictEqual(isValidEmail('test@example.com'), true);
  assert.strictEqual(isValidEmail('invalid-email'), false);
});

test('Validation Utilities - File type check', () => {
  assert.strictEqual(isValidFileType('application/pdf', 'cert.pdf'), true);
  assert.strictEqual(isValidFileType('image/png', 'photo.png'), true);
  assert.strictEqual(isValidFileType('text/plain', 'script.exe'), false);
});

test('Cryptographic Hashing Service - Buffer SHA-256', () => {
  const content = Buffer.from('Hello Blockchain E-Vault 2026');
  const hash1 = generateBufferHash(content);
  const hash2 = generateBufferHash(content);
  
  assert.strictEqual(typeof hash1, 'string');
  assert.strictEqual(hash1.length, 64);
  assert.strictEqual(hash1, hash2);

  const modifiedContent = Buffer.from('Hello Blockchain E-Vault 2026!');
  const modifiedHash = generateBufferHash(modifiedContent);
  assert.notStrictEqual(hash1, modifiedHash);
});
