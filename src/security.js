const {random_string} = require("./extra");

function encodeCipher(block,key){
	let cipher = "";
	let last = 0;
	let len = key.length;
	let p = 0;
	for (let i=0; i<len; i++){
		p ^= key.charCodeAt(i);
	}
	for (let j=0;j<block.length;j++) {
		let d = block.charCodeAt(j) ^ p;
		d ^= key.charCodeAt(j%len);
		d ^= last;
		last = d;
		cipher += String.fromCharCode(d);
	}
	return cipher;
}

function encrypt(message,k) {
	let l = Math.round(Math.random()*10);
	let pre = random_string(4);
	let post = random_string(l);
	let len = Math.round(Math.random()*5)+10;
	let key = random_string(len);
	let cipher = encodeCipher(post+message,key);
	let enc_key = encodeCipher(pre+len+key+post,k);
	return Buffer.from(cipher + "::" + enc_key).toString('base64');
}
function decodeCipher(block,key){
	let dec = "";
	let last = 0;
	let len = key.length;
	if (len===0)return block;
	let p = 0;
	for (let i=0; i<len; i++){
		p ^= key.charCodeAt(i);
	}
	for (let i=0; i < block.length; i++){
		let d = block.charCodeAt(i) ^ p;
		d ^= key.charCodeAt(i%len);
		d ^= last;
		last = block.charCodeAt(i);
		dec = dec+String.fromCharCode(d);
	}
	return dec;
}
function decrypt(msg,k){
	let cipher;
	try{
		cipher = Buffer.from(msg,'base64').toString();
	}catch (e) {
		return msg;
	}
	cipher = cipher.split('::');
	if (cipher.length!==2)return msg;
	let key = decodeCipher(cipher[1],k);
	key = key.substr(4);
	let len = parseInt(key.substr(0,2));
	key = key.substr(2);
	let tlen = key.length - len;
	key = key.substr(0,len);
	let result = decodeCipher(cipher[0],key);
	result = result.substr(tlen);
	return result;
}

module.exports = {encrypt,decrypt}