const fs = require('fs');
let html = fs.readFileSync('public/map.html', 'utf8');
html = html.replace(/<button class="locate-btn" onclick="locateUser\(\)">Locate Me<\/button>/g, '');
html = html.replace(/\.locate-btn\s*\{[\s\S]*?\}/g, '');
html = html.replace(/\.locate-btn:hover\s*\{[\s\S]*?\}/g, '');
html = html.replace(/\.locate-btn:active\s*\{[\s\S]*?\}/g, '');
fs.writeFileSync('public/map.html', html, 'utf8');
console.log('Removed Locate Me button from map.html');
