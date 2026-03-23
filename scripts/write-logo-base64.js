const fs = require('fs');
const path = require('path');
const https = require('https');

const dest = path.join(__dirname, '..', 'brandscope_logo.png');
const url = 'https://raw.githubusercontent.com/antonyjagger-oss/brandscope-radar/main/brandscope.png';

console.log('Downloading BrandScope logo...');

const file = fs.createWriteStream(dest);
https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error('HTTP error:', res.statusCode);
    process.exit(1);
  }
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    const size = fs.statSync(dest).size;
    console.log('Saved to:', dest);
    console.log('File size:', size, 'bytes');
  });
}).on('error', (err) => {
  fs.unlink(dest, () => {});
  console.error('Download error:', err.message);
  process.exit(1);
});
