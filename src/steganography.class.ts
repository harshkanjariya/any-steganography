import {Buffer} from "buffer";

const fs = require('fs');
const security = require('../src/security');

class Steganography {
	/**
	 * @param param File path or File bytes as Buffer
	 */
	static getBufferFromParams(param: string | Buffer): Buffer {
		let buffer;
		if (typeof param === 'string')
			buffer = Buffer.from(fs.readFileSync(param));
		else
			buffer = Buffer.from(param);
		return buffer;
	}

	/**
	 * @param file File path or File bytes as Buffer
	 * @param message Text message to hide
	 * @param key Key to encrypt message
	 */
	static write(file: string | Buffer, message: string, key: string) {
		let buffer = Steganography.getBufferFromParams(file);
		let cipher = security.encrypt(message, key);
		return Buffer.concat([buffer, Buffer.from(cipher)]);
	}

	/**
	 * @param file File path or File bytes as Buffer
	 * @param fileType
	 * @param key Key to decrypt message
	 */
	static decode(file: string | Buffer, fileType: 'jpg' | 'jpeg' | 'png' | 'pdf', key: string) {
		let buffer = Steganography.getBufferFromParams(file);
		let data = [];

		let str;
		if (fileType === 'jpg' || fileType === 'jpeg') {
			for (let i = buffer.length - 1; i >= 0; i--) {
				if (buffer[i] === 0xd9 && buffer[i - 1] === 0xff) {
					break;
				}
				data.push(buffer[i]);
			}
			data.reverse();
			buffer = Buffer.from(data);
			str = buffer.toString('ascii');
		} else if (fileType === 'png') {
			for (let i = buffer.length - 1; i >= 0; i--) {
				if (buffer[i] === 0x82 && buffer[i - 1] === 0x60 && buffer[i - 2] === 0x42 && buffer[i - 3] === 0xae &&
					buffer[i - 4] === 0x44 && buffer[i - 5] === 0x4e && buffer[i - 6] === 0x45 && buffer[i - 7] === 0x49 &&
					buffer[i - 8] === 0x00 && buffer[i - 9] === 0x00 && buffer[i - 10] === 0x00 && buffer[i - 11] === 0x00) {
					break;
				}
				data.push(buffer[i]);
			}
			data.reverse();
			buffer = Buffer.from(data);
			str = buffer.toString('ascii');
		} else if (fileType === 'pdf') {
			str = buffer.toString('ascii');
			str = str.substring(str.indexOf('%%EOF') + 5);
		}

		return security.decrypt(str, key);
	}
}

module.exports = Steganography;