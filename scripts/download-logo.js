const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://raw.githubusercontent.com/antonyjagger-oss/brandscope-radar/main/brandscope.png';
const dest = path.join(__dirname, '..', 'brandscope_logo.png');

const file = fs.createWriteStream(dest);

https.get(url, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Logo downloaded successfully to:', dest);
  });
}).on('error', (err) => {
  fs.unlink(dest, () => {});
  console.error('Error downloading logo:', err.message);
});
