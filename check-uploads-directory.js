const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

console.log('Checking uploads directory...');
console.log('Directory exists:', fs.existsSync(uploadsDir));

if (fs.existsSync(uploadsDir)) {
  const files = fs.readdirSync(uploadsDir);
  console.log('Files in uploads directory:');
  files.forEach(file => {
    console.log(`- ${file}`);
  });
} else {
  console.log('Uploads directory does not exist');
}
