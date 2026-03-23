const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://raw.githubusercontent.com/antonyjagger-oss/brandscope-radar/main/brandscope.png';
const dest = path.join(__dirname, '..', 'brandscope_logo.png');

console.log('Downloading logo from:', url);
console.log('Saving to:', dest);

const file = fs.createWriteStream(dest);

https.get(url, (response) => {
  if (response.statusCode !== 200) {
    console.error('Failed to download. Status code:', response.statusCode);
    file.close();
    fs.unlink(dest, () => {});
    return;
  }
  
  response.pipe(file);
  
  file.on('finish', () => {
    file.close();
    const stats = fs.statSync(dest);
    console.log('Logo saved successfully!');
    console.log('File size:', stats.size, 'bytes');
  });
}).on('error', (err) => {
  file.close();
  fs.unlink(dest, () => {});
  console.error('Error downloading logo:', err.message);
});
