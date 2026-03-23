const fs = require('fs');
const path = require('path');
const https = require('https');

const dest = path.join(__dirname, '..', 'brandscope_logo.png');
const url = 'https://raw.githubusercontent.com/antonyjagger-oss/brandscope-radar/main/brandscope.png';

const file = fs.createWriteStream(dest);
https.get(url, (res) => {
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Done. Size:', fs.statSync(dest).size);
  });
});
