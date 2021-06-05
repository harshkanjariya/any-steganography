const fs = require('fs');
const security = require('./security');

class Steganography{
	/**
	 * @param {string|Array} s File Path Or Bytes Array
	 * @return {Buffer}
	 */
	static getBufferFromParam(s){
		let buffer;
		if (typeof s === 'string')
			buffer = Buffer.from(fs.readFileSync(s));
		else
			buffer = Buffer.from(s);
		return buffer;
	}
	/**
	 * @param {string|Array} s File Path Or Bytes Array
	 * @param {'pdf'|'jpg'|'jpeg'|'png'|'gif'} type File Type
	 * @param {string} message
	 * @param {string} key
	 * @return {Buffer}
	 */
	static write(s,type,message,key){
		let buffer = this.getBufferFromParam(s);
		let cipher = security.encrypt(message,key);
		return Buffer.concat([buffer,Buffer.from(cipher)]);
	}
	/**
	 * @param {string|Array} s File Path Or Bytes Array
	 * @param {'pdf'|'jpg'|'jpeg'|'png'|'gif'} type File Type
	 * @param {string} key
	 * @return {string}
	 */
	static decode(s,type,key){
		let buffer = this.getBufferFromParam(s);
		let str = buffer.toString('ascii');
		str = str.substr(str.indexOf('%%EOF')+5);
		str = security.decrypt(str,key);
		return str;
	}
}
module.exports = Steganography;