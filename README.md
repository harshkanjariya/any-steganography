# any-steganography

How to use!!!

_require libs_

```javascript
const fs = require('fs');
const path = require('path');
const sg = require('any-steganography');
```

_define file paths, this can be from a file upload, etc_

```javascript
const file = path.join(__dirname, 'images', 'test.jpg');
const output = path.join(__dirname, 'images', 'test-with-message.jpg');
```

## Let's write our message into a file

_first: read file_

```javascript
const key = '<encryption key with length 128>';
const buffer = sg.write(file, 'message', key);
fs.writeFile(output, buffer, (err) => {
	if (err) {
		console.log(err);
		return;
	}
});
```

## Now let's make sure it worked as expected

_decode message_

```javascript
const buffer = fs.readFileSync(output);
const message = steno.decode(buffer, 'jpg', key);
console.log(message);
```