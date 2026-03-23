/**
 * Downloads the BrandScope logo from GitHub and saves it to brandscope_logo.png
 * Run with: node scripts/restore-logo.js
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const dest = path.resolve(__dirname, '..', 'brandscope_logo.png');
const url = 'https://raw.githubusercontent.com/antonyjagger-oss/brandscope-radar/main/brandscope.png';

const chunks = [];
https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error('HTTP error:', res.statusCode);
    process.exit(1);
  }
  res.on('data', (chunk) => chunks.push(chunk));
  res.on('end', () => {
    const buf = Buffer.concat(chunks);
    fs.writeFileSync(dest, buf);
    console.log('brandscope_logo.png saved —', buf.length, 'bytes');
  });
}).on('error', (e) => {
  console.error('Download failed:', e.message);
  process.exit(1);
});
