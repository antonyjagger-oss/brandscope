const fs = require('fs');
const path = require('path');

// Base64-encoded PNG of the new BrandScope logo
// Source: https://raw.githubusercontent.com/antonyjagger-oss/brandscope-radar/main/brandscope.png
const BASE64_PNG = require('./logo-base64.json').data;

const dest = path.resolve(__dirname, '..', 'brandscope_logo.png');
const buf = Buffer.from(BASE64_PNG, 'base64');
fs.writeFileSync(dest, buf);
console.log('brandscope_logo.png saved —', buf.length, 'bytes');
