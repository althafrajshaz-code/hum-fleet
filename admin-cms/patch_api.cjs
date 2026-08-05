const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const newApi = "const API_BASE = 'https://hum-fleet-api.onrender.com';";

fs.readdirSync(pagesDir).forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(pagesDir, file);
    let code = fs.readFileSync(filePath, 'utf8');
    
    // Replace hardcoded TryCloudflare and localtunnel URLs
    code = code.replace(/const API_BASE = 'https?:\/\/[^']+';/g, newApi);
    code = code.replace(/const API_BASE = "https?:\/\/[^"]+";/g, newApi);
    
    fs.writeFileSync(filePath, code, 'utf8');
  }
});

console.log("Updated API_BASE in all admin-cms pages.");
