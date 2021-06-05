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
	 * @param {string} message Message to be stored
	 * @param {string} key Key to encrypt message
	 * @return {Buffer}
	 */
	static write(s,message,key){
		let buffer = this.getBufferFromParam(s);
		let cipher = security.encrypt(message, key);
		return Buffer.concat([buffer, Buffer.from(cipher)]);
	}
	/**
	 * @param {string|Array} s File Path Or Bytes Array
	 * @param {'pdf'|'jpg'|'jpeg'|'png'|'gif'} type File Type
	 * @param {string} key
	 * @return {string}
	 */
	static decode(s,type,key){
		let buffer;
		if (typeof s === 'string')
			buffer = Buffer.from(fs.readFileSync(s));
		else
			buffer = s;
			let data = [];
	
		let str;
		if (type === 'jpg' || type === 'jpeg') {
			for (let i=buf.length-1;i>=0; i--){
				if (buf[i] === 0xd9 && buf[i-1] === 0xff){
					break;
				}
				data.push(buf[i]);
			}
			data.reverse();
			buffer = Buffer.from(data);
			str = buffer.toString('ascii');
		}else if (type === 'png'){
			for (let i=buf.length-1;i>=0; i--){
				if (buf[i] === 0x82 && buf[i-1] === 0x60 && buf[i-2] === 0x42 && buf[i-3] === 0xae &&
					buf[i-4] === 0x44 && buf[i-5] === 0x4e && buf[i-6] === 0x45 && buf[i-7] === 0x49 &&
					buf[i-8] === 0x00 && buf[i-9] === 0x00 && buf[i-10] === 0x00 && buf[i-11] === 0x00){
					break;
				}
				data.push(buf[i]);
			}
			data.reverse();
			buffer = Buffer.from(data);
			str = buffer.toString('ascii');
		}else if (type === 'pdf'){
			str = buffer.toString('ascii');
			str = str.substr(str.indexOf('%%EOF')+5);
		}

		str = security.decrypt(str,key);
		return str;
	}
}
module.exports = Steganography;