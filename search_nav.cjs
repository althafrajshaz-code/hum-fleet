const fs = require('fs');
const text = fs.readFileSync('admin-cms/src/pages/AdminDashboard.jsx', 'utf8');
const lines = text.split('\n');
const startIndex = lines.findIndex(l => l.includes('nav-btn'));
console.log(lines.slice(startIndex - 5, startIndex + 35).join('\n'));
