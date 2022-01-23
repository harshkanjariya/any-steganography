const Steganography = require("../index");
const fs = require('fs');

let key = 'abcdefghabcdefghabcdefghabcdefgh';
let file = Steganography.write('sample.pdf', 'Hello', key);
fs.writeFileSync('./sample_with_message.pdf', file);
let msg = Steganography.decode('./sample_with_message.pdf', 'pdf', key);
console.log("Decrypted Message : ", msg);