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
  
  if (content.includes('http://localhost:5000')) {
    content = content.replace(/http:\/\/localhost:5000/g, TARGET_URL);
    modified = true;
  }
  
  if (content.includes('getBackendUrl = () => {')) {
    content = content.replace(/getBackendUrl = \(\) => {[\s\S]*?};/g, `getBackendUrl = () => { return '${TARGET_URL}'; };`);
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(file, content);
    console.log('Fixed:', file);
  }
});
