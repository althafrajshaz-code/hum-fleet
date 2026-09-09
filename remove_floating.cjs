const fs = require('fs');

let code = fs.readFileSync('src/pages/DriverDashboard.jsx', 'utf8');

const regex = /\{\/\*\s*FLOATING HAMBURGER MENU\s*\*\/\}\s*<button[\s\S]*?onClick=\{\(\) => setShowMainMenu\(!showMainMenu\)\}[\s\S]*?<\/button>/;
code = code.replace(regex, '');

fs.writeFileSync('src/pages/DriverDashboard.jsx', code);
console.log('Removed floating hamburger menu.');
