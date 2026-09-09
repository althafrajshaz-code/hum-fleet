const fs = require('fs');
let content = fs.readFileSync('public/map.html', 'utf8');

content = content.replace(/font-size: 22px !important;/g, 'font-size: 16px !important;');
content = content.replace(/padding: 18px 24px !important;/g, 'padding: 12px 18px !important;');
content = content.replace(/max-height: 200px !important;/g, 'max-height: 350px !important;');

fs.writeFileSync('public/map.html', content);
console.log('Fixed map CSS scaling');
