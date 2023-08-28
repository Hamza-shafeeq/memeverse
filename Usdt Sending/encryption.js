const NodeRSA = require('node-rsa');

const key = new NodeRSA({ b: 2048 });
const privateKey = key.exportKey('private');
let hero = privateKey.length
console.log(hero)
// console.log(privateKey)
// let priv = privateKey
// const key2 = new NodeRSA("priv");

// // Message to encrypt
// const message = 'Hello, World!';

// // Encrypt the message using the private key
// const encrypted = key2.encryptPrivate(message, 'base64');

// // Decrypt the encrypted message using the private key
// const decrypted = key2.decryptPublic(encrypted, 'utf8');

console.log('Encrypted:', encrypted);
console.log('Decrypted:', decrypted);
