const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://harbour-precisely-don-served.trycloudflare.com';

function findJsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory() && file !== 'node_modules' && file !== 'dist') {
      findJsxFiles(path.join(dir, file), fileList);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const allFiles = [...findJsxFiles('src'), ...findJsxFiles('admin-cms/src')];

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  if (content.includes(TARGET_URL)) {
    content = content.replace(new RegExp(TARGET_URL, 'g'), 'http://localhost:5000');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(file, content);
    console.log('Restored localhost URL in:', file);
  }
});
