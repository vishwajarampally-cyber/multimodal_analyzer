const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const filePath = path.resolve('backend/package.json');
const form = new FormData();
form.append('file', fs.createReadStream(filePath));

const fetch = global.fetch;
if (!fetch) {
  throw new Error('fetch not available in this Node runtime');
}

fetch('http://127.0.0.1:5000/api/documents/upload', {
  method: 'POST',
  body: form,
  headers: form.getHeaders(),
})
  .then(async (res) => {
    console.log('STATUS', res.status);
    const text = await res.text();
    console.log('BODY', text);
  })
  .catch((err) => {
    console.error('ERROR', err);
  });
