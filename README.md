# any-steganography

How to use it in a __Nodejs__ environment

_require: node libs to read files_
const fs = require('fs');
const path = require('path');
_require: steno_
const steno = require('any-steganography');

_define file paths, this can be from a file upload, etc_
const file = path.join(__dirname, 'images', 'test.jpg');
const output = path.join(__dirname, 'images', 'test-steno.jpg');

## Let's write our message into a file

_first: read file_
fs.readFile(file, (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  
  _next: pass data, message, and key to write_
  const b = steno.write(data, 'message', 'key');
  
  _finally: output new file with message_
  fs.writeFile(output, b, (err) => {
    if (err) {
      console.log(err);
    }
  })
});

## Now let's make sure it worked as expected

_first: read file with message_
fs.readFile(output, (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  _next: pass data, file type (can be read from file itself), key_
  const b = steno.decode(data, 'jpg', 'key');

  _finally: log message which should match message from steno.write_
  console.log(b);
});