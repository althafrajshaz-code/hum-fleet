const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      processDir(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      const newContent = content.replace(
        /const API_BASE = [\s\S]*?(?:'https:\/\/hum-fleet-api\.onrender\.com'|"https:\/\/hum-fleet-api\.onrender\.com");/g,
        "const API_BASE = 'https://hum-fleet-api.onrender.com';"
      );
      
      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent);
        console.log(`Updated ${filePath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log("Done.");
