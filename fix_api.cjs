const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walkDir('src');
let modified = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // The exact substring to replace
  const oldStr = `const API_BASE = (typeof window !== 'undefined' && window.location.hostname.includes('loca.lt'))
  ? 'https://hum-fleet-backend.loca.lt'
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:'))
    ? 'http://localhost:5000'
    : (import.meta.env.VITE_BACKEND_URL || 'https://server-ashen-beta.vercel.app');`;

  const newStr = "const API_BASE = 'http://187.127.165.79:5000';";

  if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated exactly', file);
    modified++;
  } else {
      // Fallback regex if formatting differs
      const apiRegex = /const API_BASE = [\s\S]*?;/g;
      const match = content.match(apiRegex);
      if (match && match.length > 0 && match[0].includes('server-ashen-beta')) {
          content = content.replace(apiRegex, newStr);
          fs.writeFileSync(file, content, 'utf8');
          console.log('Updated with regex', file);
          modified++;
      }
  }
});

console.log('Done. Modified ' + modified + ' files');
