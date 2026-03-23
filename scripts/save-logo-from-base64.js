/**
 * This script downloads the BrandScope logo from GitHub and saves it
 * to the project root as brandscope_logo.png
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const dest = path.resolve(__dirname, '..', 'brandscope_logo.png');
const url = 'https://raw.githubusercontent.com/antonyjagger-oss/brandscope-radar/main/brandscope.png';

const chunks = [];
https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error('Failed:', res.statusCode);
    process.exit(1);
  }
  res.on('data', (chunk) => chunks.push(chunk));
  res.on('end', () => {
    const buf = Buffer.concat(chunks);
    fs.writeFileSync(dest, buf);
    console.log('Saved brandscope_logo.png —', buf.length, 'bytes');
  });
}).on('error', (e) => { console.error(e); process.exit(1); });
