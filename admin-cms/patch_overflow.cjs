const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'AdminDashboard.jsx');
let code = fs.readFileSync(filePath, 'utf8');

// Replace overflow: 'hidden' with overflowX: 'auto' for the table wrappers
code = code.replace(/borderRadius: '12px', overflow: 'hidden'/g, "borderRadius: '12px', overflowX: 'auto'");

fs.writeFileSync(filePath, code, 'utf8');
console.log("Updated table overflow in AdminDashboard.jsx");
