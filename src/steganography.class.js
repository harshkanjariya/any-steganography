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
			for (let i=buffer.length-1;i>=0; i--){
				if (buffer[i] === 0xd9 && buffer[i-1] === 0xff){
					break;
				}
				data.push(buffer[i]);
			}
			data.reverse();
			buffer = Buffer.from(data);
			str = buffer.toString('ascii');
		}else if (type === 'png'){
			for (let i=buffer.length-1;i>=0; i--){
				if (buffer[i] === 0x82 && buffer[i-1] === 0x60 && buffer[i-2] === 0x42 && buffer[i-3] === 0xae &&
					buffer[i-4] === 0x44 && buffer[i-5] === 0x4e && buffer[i-6] === 0x45 && buffer[i-7] === 0x49 &&
					buffer[i-8] === 0x00 && buffer[i-9] === 0x00 && buffer[i-10] === 0x00 && buffer[i-11] === 0x00){
					break;
				}
				data.push(buffer[i]);
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